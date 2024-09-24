const asyncHandler = require('express-async-handler');
const User = require('../models/User'); 
const OTP = require('../models/otpModel'); 
const generateOtp = require('../utils/otp'); 
const sendMail = require('../utils/sendMail'); 
const bcrypt = require('bcryptjs');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Configure Multer storage with Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'user_profiles', // The name of the folder in Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'], // Allowed image formats
  },
});

// Create the multer upload middleware
const upload = multer({ storage: storage });

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
    message: 'User registered successfully. Please request OTP separately.',
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

  // Send OTP to the user via email
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

  // Check if OTP is expired
  // const currentTime = new Date();
  // const timeDifference = currentTime - otpDocument.createdAt;
  // if (timeDifference > 600000) { // 10 minutes expiration time
  //   return res.status(400).send({ message: 'OTP has expired. Please request a new one.' });
  // }

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
  const { email, password} = req.body;

  // Validate email and password
    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required' });
    }

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({ message: 'User does not exist. Please register.' });
  }

  // Check if user is verified their email by otp after registration
  const otpDocument = await OTP.findOne({ email });
  if (!otpDocument) {
    return res.status(400).send({ message: 'Please verify your email first.' });
  }

   // Handle password login
   const isMatch = await user.comparePassword(password);
   if (!isMatch) {
     return res.status(400).send({ message: 'Invalid password' });
   }

  // Create JWT token for the user
  const token = await user.createJwt(res);

  // Respond with success
  res.status(200).json({
    success: true,
    data: {
      _id: user._id,
      email: user.email,
    },
    message: 'User logged in successfully',
    token,
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

  // Send OTP via email
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


// @Desc Delete User Account
// @Route DELETE /api/v1/profile/:id
exports.deleteUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params; 
  const { password } = req.body;

  try {
      // Find the user by their ID
      const user = await User.findById(id);
      
      // If user not found, return an error
      if (!user) {
          return res.status(404).json({ message: 'User not found.' });
      }

      // Use the comparePassword method from the User model
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
          return res.status(400).json({ message: 'Incorrect password.' });
      }

      // Delete the user account
      await User.findByIdAndDelete(id);

      // Also delete the corresponding OTP entry
      await OTP.findByIdAndDelete({ userId: id }); // Assuming OTP model has a userId field to link to the user

      res.status(200).json({ message: 'User account deleted successfully.' });
  } catch (error) {
      res.status(500).json({ message: 'Server error. Please try again.' });
  }
});





  
  



