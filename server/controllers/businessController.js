const Business = require('../models/Business');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
// const { sendEmailNotification, createInAppNotification } = require('./notificationController');
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
const cloudinary = require('../config/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const fs = require('fs');

// Configure Cloudinary storage for business uploads
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'business_assets', // Folder for business uploads in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
  },
});

// Multer middleware
const upload = multer({ storage: storage });

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

exports.fetchBusinessById = asyncHandler(async (req, res) => {
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


// @Desc Generate Refresh Token for Business
// @Route POST /api/v1/business/refresh-token
exports.refreshBusinessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res.status(401).json({
            success: false,
            message: 'Refresh Token not found. Please log in again.',
        });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

        // Find the business by the decoded token's business ID
        const business = await Business.findById(decoded._id);
        if (!business) {
            return res.status(404).json({
                success: false,
                message: 'Business not found',
            });
        }

        // Create new access and refresh tokens
        const tokens = await business.createJwt(res);

        res.status(200).json({
            success: true,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    } catch (error) {
        console.error('Refresh token error:', error);
        return res.status(401).json({
            success: false,
            message: 'Invalid refresh token. Please log in again.',
        });
    }
});

// Controller to update business details
exports.updateBusinessDetails = asyncHandler(async (req, res) => {
    const { id } = req.params; // Get the business ID from request parameters
    const {
        name,
        email,
        mobile,
        businessType,
        address,
        description,
        logo,
        photos,
        category,
        openingHours
    } = req.body; // Destructure incoming data

    // Find the business by ID
    const business = await Business.findById(id);

    if (!business) {
        return res.status(404).json({ success: false, message: 'Business not found.' });
    }

    // Update business details
    business.name = name || business.name;
    business.email = email || business.email;
    business.mobile = mobile || business.mobile;
    business.businessType = businessType || business.businessType;

    // Update address if provided
    if (address) {
        business.address.houseFlatBlockNo = address.houseFlatBlockNo || business.address.houseFlatBlockNo;
        business.address.areaStreetVillage = address.areaStreetVillage || business.address.areaStreetVillage;
        business.address.landmark = address.landmark || business.address.landmark;
        business.address.pincode = address.pincode || business.address.pincode;
        business.address.city = address.city || business.address.city;
        business.address.state = address.state || business.address.state;
    }

    business.description = description || business.description;
    business.logo = logo || business.logo;
    business.photos = photos || business.photos;
    business.category = category || business.category;
    business.openingHours = openingHours || business.openingHours;

    // Save the updated business
    const updatedBusiness = await business.save();

    // Generate new tokens if needed
    const { accessToken, refreshToken } = await business.createJwt(res); // Ensure createJwt method is called

    res.status(200).json({
        success: true,
        data: {
            business: updatedBusiness,
            accessToken, // Include the new access token in the response
            refreshToken, // Include the new refresh token in the response
            message: 'Business details updated successfully.'
        }
    });
});



// @Desc Upload Business Logo
// @Route POST /api/v1/business/upload-logo
// Controller for uploading business logo
exports.uploadBusinessLogo = asyncHandler(async (req, res) => {
  const businessId = req.business._id; // Assuming req.business is populated by middleware

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    // Upload file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'business_logos', // Separate folder for logos
      width: 200,
      height: 200,
      crop: "fill",
    });

    // Remove file from local storage
    fs.unlinkSync(req.file.path);

    // Update business model with the new logo URL
    const business = await Business.findByIdAndUpdate(
      businessId,
      { logo: result.secure_url },
      { new: true }
    );

    res.status(200).json({
      message: 'Business logo uploaded successfully.',
      logoUrl: business.logo,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading business logo', error: error.message });
  }
});

// @Desc Upload Business Photos
// @Route POST /api/v1/business/upload-photos
// Controller for uploading business photos
exports.uploadBusinessPhotos = asyncHandler(async (req, res) => {
  const businessId = req.business._id; // Assuming req.business is populated by middleware

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded.' });
  }

  try {
    const photoUrls = [];

    // Upload each file to Cloudinary
    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'business_photos', // Separate folder for photos
        width: 800,
        height: 600,
        crop: "fill",
      });

      // Add the Cloudinary URL to the array
      photoUrls.push(result.secure_url);

      // Remove file from local storage
      fs.unlinkSync(file.path);
    }

    // Update the business model with the new photos array (optional)
    const business = await Business.findByIdAndUpdate(
      businessId,
      { $push: { photos: { $each: photoUrls } } }, // Assuming photos is an array in the Business model
      { new: true }
    );

    res.status(200).json({
      message: 'Business photos uploaded successfully.',
      photos: business.photos,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading business photos', error: error.message });
  }
});

// Controller to fetch all businesses
exports.fetchAllBusinesses = asyncHandler(async (req, res) => {
    try {
        const businesses = await Business.find(); // Fetch all businesses from the database

        // Check if businesses exist
        if (!businesses || businesses.length === 0) {
            return res.status(404).json({ message: 'No businesses found.' });
        }

        // Send response with the businesses
        res.status(200).json({
            success: true,
            count: businesses.length,
            data: businesses,
        });
    } catch (error) {
        // Handle any errors that occur during the fetch operation
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later.',
        });
    }
});

// handle business search
exports.searchBusinesses = async (req, res) => {
    const { query } = req.query; // Get the search query from the request

    try {
        // Find businesses that match the search query
        const businesses = await Business.find({
            $or: [
                { name: { $regex: query, $options: 'i' } }, // Match name
                { description: { $regex: query, $options: 'i' } }, // Match description
                // Add more fields if needed
            ],
        });

        return res.status(200).json({ businesses });
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
};





