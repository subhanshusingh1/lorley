const Business = require('../models/Business');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { sendEmailNotification, createInAppNotification } = require('./notificationController');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const BusinessOtp = require('../models/businessOtpModel'); 
const Review = require('../models/Review'); 
// generate otp
const generateOtp = require('../utils/otp'); // Adjust the path as necessary
// mailgun
const mailgun = require('mailgun-js');
const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: process.env.MAILGUN_DOMAIN });
const { sendEmail } = require('../utils/mailgunService'); // Import the Mailgun sendEmail function

// Helper function to check OTP validity
const isOtpValid = (otpDocument) => {
    const currentTime = new Date();
    return otpDocument && (currentTime - otpDocument.createdAt) < 600000; // 10 minutes expiration time
};

// Register a new business
exports.addBusiness = asyncHandler(async (req, res) => {
    const { name, email, mobile, businessType, category } = req.body;

    // Check if the required fields are provided
    if (!name || !email || !mobile || !businessType || !category) {
        return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Create a new business
    const newBusiness = new Business({
        name,
        email,
        mobile,
        businessType,
        category,
        // Additional details can be added later
    });

    const business = await newBusiness.save();
    res.status(201).json({
        message: 'Business registered successfully!',
        business, // Send back the registered business details if needed
    });
});


// Controller to send OTP
exports.sendOtp = asyncHandler(async (req, res) => {
    const { email } = req.body;

    // Validate email presence
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    // Check if business already exists with this email
    const business = await Business.findOne({ email });

    if (!business) {
        return res.status(400).json({ message: 'A business does not exist. Please register first.' });
    }

    // Generate OTP
    const otp = generateOtp();

    // Save OTP to the database
    await BusinessOtp.create({
        email,
        otp,
        createdAt: new Date(),
    });

    // Send OTP to the business via email using the utility function
    await sendEmail(email, 'Your OTP for Business Registration', `Your OTP is: ${otp}. It is valid for a limited time.`);

    // Send response
    res.status(200).json({
        success: true,
        message: 'OTP sent successfully to the provided email.',
    });
});



// Controller to verify otp
exports.verifyOtp = asyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    // Validate email and OTP presence
    if (!email || !otp) {
        return res.status(400).send({ message: 'Email and OTP are required' });
    }

    // Check for existing OTP document
    const otpDocument = await BusinessOtp.findOne({ email });

    if (!otpDocument) {
        return res.status(404).send({ message: 'No OTP record found for the requested email' });
    }

    // Verify OTP
    if (otpDocument.otp !== otp || !isOtpValid(otpDocument)) {
        return res.status(400).send({ message: 'Invalid or Expired OTP' });
    }

    // Fetch user
    const business = await Business.findOne({ email });

    // Create JSON Web Token (JWT) and store it in cookies
    const token = await business.createJwt(res);

    // Respond with success
    res.status(200).send({
        success: true,
        token,
        message: 'OTP verified successfully',
    });
});


// @Desc Business Login
// @Route POST /api/v1/business/login
// Controller for business login
exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate email and password
    if (!email || !password) {
        return res.status(400).send({ message: 'Email and password are required' });
    }

    // Find the business by email
    const business = await Business.findOne({ email });
    if (!business) {
        return res.status(400).send({ message: 'Business does not exist. Please register.' });
    }

    // Check if the business has verified their email
    const otpDocument = await BusinessOtp.findOne({ email });
    if (!otpDocument) {
        return res.status(400).send({ message: 'Please verify your email first.' });
    }

    // Handle password login
    const isMatch = await business.comparePassword(password); // Assuming comparePassword is defined in your Business model
    if (!isMatch) {
        return res.status(400).send({ message: 'Invalid password' });
    }

    // Create JWT tokens and store them in cookies
    await business.createJwt(res); // This will create both access and refresh tokens

    // Respond with success
    res.status(200).json({
        success: true,
        data: {
            business: {
                _id: business._id,
                name: business.name,
                email: business.email,
            },
        },
        message: 'Business logged in successfully',
    });
});

// @Desc Forgot Password
// @Route POST /api/v1/business/forgot-password
// Controller for forgot password
exports.forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
  
    // Validate email presence
    if (!email) {
      return res.status(400).send({ message: 'Email is required' });
    }
  
    // Check if business exists
    const business = await Business.findOne({ email });
    let otpData = await BusinessOtp.findOne({ email });
  
    if (!business) {
      return res.status(404).send({ message: 'Business does not exist' });
    }
  
    // Generate OTP
    const otp = generateOtp();
  
    // Update OTP database
    if (!otpData) {
      otpData = new BusinessOtp({
        email,
        otp,
        createdAt: new Date(),
      });
    } else {
      otpData.otp = otp;
      otpData.createdAt = new Date();
    }
  
    await otpData.save();
  
    // Send OTP via email using the utility function
    await sendEmail(email, 'Your OTP for Password Reset', `Your OTP is: ${otp}`);
  
    // Send response
    res.status(200).send({
      success: true,
      message: 'OTP sent to your email for password reset',
    });
  });
  

// @Desc Reset Password
// @Route POST /api/v1/business/reset-password
// Controller for reset password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  // Validate input
  if (!email || !newPassword) {
    return res.status(400).send({ message: 'Email and new password are required' });
  }

  // Check if business exists
  const business = await Business.findOne({ email });

  if (!business) {
    return res.status(404).send({ message: 'Business does not exist' });
  }

  // Update business password
  business.password = newPassword; // You may want to hash the password here
  await business.save();

  // Send success response
  res.status(200).send({
    success: true,
    message: 'Password reset successfully',
  });
});


// Function to calculate average rating from reviews
const calculateAverageRating = (reviews) => {
    if (!reviews.length) return 0; // No reviews means average is 0
    const total = reviews.reduce((acc, review) => acc + review.rating, 0); // Assuming rating is a field in the review
    return total / reviews.length; // Calculate average
};

export const fetchBusinessById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    // Fetch business details by ID
    const business = await Business.findById(id)
        .populate('category') // Populate category for more details
        .populate({
            path: 'reviews',
            model: 'Review',
            populate: {
                path: 'user', // Populate user if needed (assuming reviews have a user reference)
                select: 'name profileImage' // Adjust based on your user model
            }
        });

    if (!business) {
        return res.status(404).json({ message: 'Business not found' });
    }

    // Format the response to include all necessary details
    const businessData = {
        id: business._id,
        name: business.name,
        logo: business.logo,
        email: business.email,
        mobile: business.mobile,
        address: business.address,
        category: business.category, // This will contain the category object
        photos: business.photos,
        totalReviews: business.reviews.length,
        averageRating: calculateAverageRating(business.reviews),
        openingHours: business.openingHours,
        views: business.views, // Include view count
        searchCount: business.searchCount // Include search count
    };

    res.json(businessData);
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

// // Verify a business (mark it as pending for verification)
// exports.verifyBusiness = asyncHandler(async (req, res) => {
//     const businessId = req.params.id;
//     const business = await Business.findById(businessId);

//     if (!business) {
//         return res.status(404).json({ error: 'Business not found' });
//     }

//     business.verificationStatus = 'Pending';
//     await business.save();
//     res.json({ message: 'Verification request submitted successfully' });
// });

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
