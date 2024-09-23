const Business = require('../models/Business');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { sendEmailNotification, createInAppNotification } = require('./notificationController');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

// Register a new business (done after user registration)
exports.addBusiness = asyncHandler(async (req, res) => {
    const { name, description, address, businessType, contactInfo, logo, openingHours, photos } = req.body;

    const newBusiness = new Business({
        name,
        description,
        address,
        businessType,
        contactInfo,
        logo,
        openingHours,
        photos,
        owner: req.user.id,
    });

    const business = await newBusiness.save();
    res.status(201).json(business);
});

// Login a business
exports.businessLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'Business not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });

    res.json({ token, message: 'Login successful' });
});

// Get all businesses with filtering (category, type, etc.)
exports.getBusinesses = asyncHandler(async (req, res) => {
    const { category, businessType } = req.query;

    let filter = {};
    if (category) filter.category = category;
    if (businessType) filter.businessType = businessType;

    const businesses = await Business.find(filter);
    res.json(businesses);
});

// Update business details from dashboard (by business owner)
exports.updateBusiness = asyncHandler(async (req, res) => {
    const business = await Business.findById(req.params.id);

    if (business.owner.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized to update this business' });
    }

    const { name, description, address, businessType, contactInfo, logo, photos, openingHours } = req.body;
    business.name = name || business.name;
    business.description = description || business.description;
    business.address = address || business.address;
    business.businessType = businessType || business.businessType;
    business.contactInfo = contactInfo || business.contactInfo;
    if (logo) business.logo = logo;
    if (photos) business.photos = photos;
    if (openingHours) business.openingHours = openingHours;

    const updatedBusiness = await business.save();
    res.json(updatedBusiness);
});

// Delete a business (by business owner)
exports.deleteBusiness = asyncHandler(async (req, res) => {
    const business = await Business.findById(req.params.id);

    if (business.owner.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized to delete this business' });
    }

    await business.remove();
    res.json({ message: 'Business removed' });
});

// Verify a business (mark it as pending for verification)
exports.verifyBusiness = asyncHandler(async (req, res) => {
    const businessId = req.params.id;
    const business = await Business.findById(businessId);

    if (!business) {
        return res.status(404).json({ error: 'Business not found' });
    }

    business.verificationStatus = 'Pending';
    await business.save();
    res.json({ message: 'Verification request submitted successfully' });
});

// Get business by ID (including views increment and limited reviews)
exports.getBusinessById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const business = await Business.findById(id).select('name logo photos openingHours address description contactInfo reviews');

    if (!business) {
        return res.status(404).json({ error: 'Business not found' });
    }

    // Increment views count
    business.views += 1;
    await business.save();

    // Limit to the most recent 5 reviews (if you have a `createdAt` field in reviews)
    const limitedReviews = business.reviews.slice(-5);
    
    res.json({ ...business.toObject(), reviews: limitedReviews });
});

// Add a review to a business
exports.addReview = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const business = await Business.findById(id);

    if (!business) {
        return res.status(404).json({ error: 'Business not found' });
    }

    const newReview = {
        user: req.user.id,
        rating: req.body.rating,
        comment: req.body.comment,
        createdAt: new Date(), // Ensure to save the creation date if needed
    };

    business.reviews.push(newReview);
    await business.save();

    // Send notification to business owner
    const businessOwner = await User.findById(business.owner);
    if (businessOwner) {
        const message = `Your business "${business.name}" has received a new review.`;
        await sendEmailNotification(businessOwner.email, 'New Review', message);
        await createInAppNotification(businessOwner._id, message);
    }

    res.json(business);
});

// Update business customization (theme, additional details)
exports.updateBusinessCustomization = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { theme, additionalDetails } = req.body;

    const business = await Business.findById(id);
    if (!business) {
        return res.status(404).json({ message: 'Business not found' });
    }

    business.theme = theme || business.theme;
    business.additionalDetails = additionalDetails || business.additionalDetails;
    await business.save();

    res.status(200).json({ message: 'Customization updated successfully' });
});
