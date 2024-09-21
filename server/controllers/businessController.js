const Business = require('../models/Business');
const User = require('../models/User');
const { sendEmailNotification, createInAppNotification } = require('./notificationController');
const asyncHandler = require('express-async-handler');

// Create a new business
exports.addBusiness = asyncHandler(async (req, res) => {
    const { name, description, address } = req.body;
    const newBusiness = new Business({
        name,
        description,
        address,
        owner: req.user.id,
    });
    const business = await newBusiness.save();
    res.status(201).json(business);
});

// Get all businesses
exports.getBusinesses = asyncHandler(async (req, res) => {
    const { category } = req.query;
    const businesses = category ? await Business.find({ category }) : await Business.find({});
    res.json(businesses);
});

// Update a business
exports.updateBusiness = asyncHandler(async (req, res) => {
    const business = await Business.findById(req.params.id);

    if (business.owner.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized to update this business' });
    }

    const { name, description, address } = req.body;
    business.name = name || business.name;
    business.description = description || business.description;
    business.address = address || business.address;

    const updatedBusiness = await business.save();
    res.json(updatedBusiness);
});

// Delete a business
exports.deleteBusiness = asyncHandler(async (req, res) => {
    const business = await Business.findById(req.params.id);

    if (business.owner.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized to delete this business' });
    }

    await business.remove();
    res.json({ message: 'Business removed' });
});

// Verify a business
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

// Get business by ID
exports.getBusinessById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const business = await Business.findById(id);

    if (!business) {
        return res.status(404).json({ error: 'Business not found' });
    }

    // Increment views count
    business.views += 1;
    await business.save();
    res.json(business);
});

// Add a review
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

// Update business customization
exports.updateBusinessCustomization = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { theme, additionalDetails } = req.body;

    const business = await Business.findById(id);
    if (!business) {
        return res.status(404).json({ message: 'Business not found' });
    }

    business.theme = theme;
    business.additionalDetails = additionalDetails;
    await business.save();

    res.status(200).json({ message: 'Customization updated successfully' });
});
