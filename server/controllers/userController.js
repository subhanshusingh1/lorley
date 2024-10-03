const asyncHandler = require('express-async-handler');
const User = require('../models/User'); 
const OTP = require('../models/otpModel'); 
const generateOtp = require('../utils/otp'); 
const sendMail = require('../utils/sendMail'); 
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Helper function to check OTP validity
const isOtpValid = (otpDocument) => {
  const currentTime = new Date();
  return otpDocument && (currentTime - otpDocument.createdAt) < 600000; // 10 minutes expiration time
};


// @Desc User Registration
// @route POST /api/v1/users
// Controller for user registration
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Input validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Check if the user already exists
  const userInfo = await User.findOne({ email });

  if (userInfo) {
    return res.status(400).json({ message: 'User Already Exists!' });
  }

  // Register the new user
  const user = await User.create({
    name,
    email,
    password, // password will be hashed in the User model's 'pre-save' hook
    // mobile,
  });

  // Send success response without sending OTP
  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      // mobile: user.mobile,
    },
    message: 'User registered successfully. Please verify otp',
  });
});

// @Desc Send OTP to User's Email
// @Route POST /api/v1/users/send-otp
// Controller to send OTP
exports.sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Validate email presence
  if (!email) {
      return res.status(400).json({ message: 'Email is required' });
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
      return res.status(404).json({ message: 'User does not exist. Please register first.' });
  }

  // Generate OTP
  const otp = generateOtp();

  // Save OTP to the database
  await OTP.create({
      email,
      otp,
      createdAt: new Date(),
  });

  // Send OTP to the user via email using sendMail
  await sendMail(email, otp);

  // Send response
  res.status(200).json({
      success: true,
      message: 'OTP sent successfully to the registered email.',
  });
});



// @Desc OTP Verification
// @Route POST /api/v1/users/verify-otp
// Controller for otp verification
exports.verifyOtp = asyncHandler(async (req, res) => {
  const { email, otp } = req.body;

  // Validate email and OTP presence
  if (!email || !otp) {
    return res.status(400).send({ message: 'Email and OTP are required' });
  }

  // Check for existing OTP document
  const otpDocument = await OTP.findOne({ email });

  if (!otpDocument) {
    return res.status(404).send({ message: 'No OTP record found for the requested email' });
  }

  // Verify OTP
  if (otpDocument.otp !== otp || !isOtpValid(otpDocument)) {
    return res.status(400).send({ message: 'Invalid or Expired OTP' });
  }

  // Fetch user
  const user = await User.findOne({ email });

  // Create JSON Web Token (JWT) and store it in cookies
  const token = await user.createJwt(res);

  // Respond with success
  res.status(200).send({
    success: true,
    token,
    message: 'OTP verified successfully',
  });
});


// @Desc User Login
// @Route POST /api/v1/users/login
// Controller for user login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return res.status(400).send({ message: 'Email and password are required' });
  }

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({ message: 'User does not exist. Please register.' });
  }

  // Check if the user has verified their email
  const otpDocument = await OTP.findOne({ email });
  if (!otpDocument) {
    return res.status(400).send({ message: 'Please verify your email first.' });
  }

  // Handle password login
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).send({ message: 'Invalid password' });
  }

  // Create JWT tokens and store them in cookies
  await user.createJwt(res);  // This will create both access and refresh tokens

  // Respond with success
  res.status(200).json({
    success: true,
    data: {
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    },
    message: 'User logged in successfully',
  });
});


// @Desc Forgot Password
// @Route POST /api/v1/users/forgot-password
// Controller for forgot password
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Validate email presence
  if (!email) {
      return res.status(400).send({ message: 'Email is required' });
  }

  // Check if user exists
  const user = await User.findOne({ email });
  let otpData = await OTP.findOne({ email });

  if (!user) {
      return res.status(404).send({ message: 'User does not exist' });
  }

  // Generate OTP
  const otp = generateOtp();

  // Update OTP database
  if (!otpData) {
      otpData = new OTP({
          email,
          otp,
          createdAt: new Date(),
      });
  } else {
      otpData.otp = otp;
      otpData.createdAt = new Date();
  }

  await otpData.save();

  // Send OTP via email using sendMail
  await sendMail(email, otp);

  // Send response
  res.status(200).send({
      success: true,
      message: 'OTP sent to your email for password reset',
  });
});

// @Desc Reset Password
// @Route POST /api/v1/users/reset-password
// Controller for reset password
exports.resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword } = req.body;

  // Validate input
  if (!email || !newPassword) {
    return res.status(400).send({ message: 'Email and new password are required' });
  }

  // Check if user exists
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).send({ message: 'User does not exist' });
  }

  // Update user password
  user.password = newPassword;
  await user.save();

  // Send success response
  res.status(200).send({
    success: true,
    message: 'Password reset successfully',
  });
});

// @Desc Get User Profile Details
// @Route Get /api/v1/users/profile/:id
// Controller to fetch email and name for user profile page 
exports.getProfileById = asyncHandler(async (req, res) => {
  const userId = req.params.id;

  // Log the received user ID
  console.log("User ID received:", userId);

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  try {
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      message: "User details retrieved successfully",
    });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


// @Desc Upload Profile Image
// @Route POST /api/v1/users/upload-profile-image
// Upload Profile Image
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    console.log("file upload started");

    const userId = req.user._id; // Make sure to get the user ID from the request

    // Update the user's profile with the new image URL
    const user = await User.findByIdAndUpdate(
      userId,
      { profileImage: req.file.path }, // req.file.path contains the Cloudinary URL
      { new: true }
    );

    return res.status(200).json({
      message: 'Profile image uploaded successfully.',
      profileImageUrl: user.profileImage,
    });
  } catch (error) {
    console.error('Error uploading profile image:', error);
    return res.status(500).json({ message: 'Error uploading profile image', error: error.message });
  }
};


// @Desc Delete User Account
// @Route DELETE /api/v1/users/profile/:id
// Delete user Account
exports.deleteUser = asyncHandler(async (req, res) => {

  console.log('User ID:', req.user ? req.user.id : 'No user in request');

  const { id } = req.params; // Get user ID from params

  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ success: false, message: "Invalid user ID" });
  }

  // Check if the user exists
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ message: `No user found with id: ${id}` });
  }

  // Check if OTP data exists for the user
  const otpData = await OTP.findOne({ email: user.email });
  if (!otpData) {
    return res.status(400).json({ message: 'No OTP data found for the user' });
  }

  // Proceed to delete the user and OTP data
  await User.deleteOne({ _id: id });
  await OTP.deleteOne({ _id: otpData._id });

  res.status(200).json({
    success: true,
    message: 'User Profile Deleted Successfully!',
  });
});



// @Desc Generate Refresh Token
// @Route Post /api/v1/users/refresh-token
exports.refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
      return res.status(401).json({
          success: false,
          message: 'Refresh Token not found, please log in again.',
      });
  }

  try {
      // Verify the refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET); // Use a different secret for refresh tokens

      // Find the user by the decoded token's user id
      const user = await User.findById(decoded._id).select('-password');
      if (!user) {
          return res.status(404).json({
              success: false,
              message: 'User not found',
          });
      }

      // Create a new access token
      const newAccessToken = await user.createJwt(res); // This method should create and return the new access token

      res.status(200).json({
          success: true,
          accessToken: newAccessToken,
      });
  } catch (error) {
      console.error('Refresh token error:', error);
      return res.status(401).json({
          success: false,
          message: 'Invalid Refresh Token, please log in again.',
      });
  }
});


exports.updateUserProfile = asyncHandler(async (req, res) => {

  console.log('User ID:', req.user ? req.user.id : 'No user in request');

  const userId = req.user.id; // Assuming user ID is derived from the authenticated user's request

  const { name, email } = req.body; // Extract updated name and email from the request body

  try {
    // Validate if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update user's profile fields
    user.name = name || user.name;
    user.email = email || user.email;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});









  
  



