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
  const { name, email, password, mobile } = req.body;

  // Input validation
  if (!name || !email || !password || !mobile) {
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
    mobile,
  });

  // Generate OTP
  const otp = generateOtp();

  // Save OTP to the database
  await OTP.create({
    email,
    otp,
    createdAt: new Date(), // save the time for OTP creation
  });

  // Send OTP to user via email
  await sendMail(email, otp); // Send OTP using sendMail utility

  // // Create JSON Web Token (JWT) and store it in cookies
  // const token = await user.createJwt(res);

  // Send success response
  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    },
    // token,
    message: 'User registered successfully. Please check your email for the OTP.',
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
      const {email} = req.body;

      // validate email presence
      if(!email) {
        return res.status(400).send({message: 'Email is required'});
      }

      // check if user exists
      const user = await User.findOne({email});
      let otpData = await OTP.findOne({email});
    
      if(!user) {
        return res.status(404).send({message: 'User does not exist'})
      }

      // Generate OTP
      const otp = generateOtp();

      // update otp database
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

      // send otp via email
      await sendMail(email, otp)

      // send response
      res.status(200).send({
        success: true,
        message: 'OTP Send to your email for password reset',
      })

})

// @Desc Reset Password
// @Route POST /api/v1/users/reset-password
// Controller for reset password
exports.resetPassword = asyncHandler(async (req, res) => {
      const {email, otp, newPassword} = req.body;

      //validate input 
      if(!email || !otp || !newPassword) {
        return res.status(400).send({message: 'Email, otp and new password is required'});
      }

      // check for existing email
      const otpData = await OTP.findOne({email});
      if(!otpData) {
        return res.status(404).send({message: 'No OTP found for requested email'});
      }

      // verify otp
      if(otpData.otp != otp || !isOtpValid(otpData)) {
        return res.status(400).send({message: 'Invalid or Expired OTP'});
      }

      // Check if OTP is expired
      //  const currentTime = new Date();
      //  const timeDifference = currentTime - otpData.createdAt;
      //  if (timeDifference > 600000) { // 10 minutes expiration time
      //     return res.status(400).send({ message: 'OTP has expired. Please request a new one.' });
      //  }

      // update user password
      const user = await User.findOne({email})
      user.password = newPassword;
      await user.save(); 


      // Send success response
       res.status(200).send({
          success: true,
          message: 'Password reset successfully',
       });
})

// @Desc Update User Profile
// @Route PUT /api/v1/users/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, mobile } = req.body; // Get other fields from req.body
  const profileImage = req.file?.path; // Get the image URL from the uploaded file

  if (!name || !mobile) {
    return res.status(400).send({ message: 'Name and mobile are required' });
  }

  const userId = req.user._id; // Assuming you have user ID from token or session
  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).send({ message: 'User not found' });
  }

  // Update user details
  user.name = name;
  user.mobile = mobile;
  if (profileImage) {
    user.profileImage = profileImage; // Store the image URL
  }

  await user.save();

  res.status(200).send({
    success: true,
    message: 'Profile updated successfully',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
      profileImage: user.profileImage,
    },
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





  
  



