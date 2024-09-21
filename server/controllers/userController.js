const asyncHandler = require('express-async-handler');
const User = require('../models/User'); 
const OTP = require('../models/otpModel'); 
const generateOtp = require('../utils/otp'); 
const sendMail = require('../utils/sendMail'); 
const bcrypt = require('bcryptjs');

// Helper function to check OTP validity
const isOtpValid = (otpDocument) => {
  const currentTime = new Date();
  return otpDocument && (currentTime - otpDocument.createdAt) < 600000; // 10 minutes expiration time
};


// @Desc User Registration
// @route POST /api/v1/users/
// Controller for user registration
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, mobile } = req.body;

  // Input validation
  if (!name || !email || !password || !mobile) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  // Check if the user already exists
  const userInfo = await User.findOne({ email });

  if (userInfo) {
    return res.status(400).send({ message: 'User Already Exists!' });
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
  await sendMail(req, email, otp); // Send OTP using sendMail utility

  // // Create JSON Web Token (JWT) and store it in cookies
  // const token = await user.createJwt(res);

  // Send success response
  res.status(201).send({
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
  const { email, password, otp } = req.body;

  // Validate email presence
  if (!email) {
    return res.status(400).send({ message: 'Email is required' });
  }

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).send({ message: 'User does not exist. Please register.' });
  }

  // Handle login with password
  if (password) {
    const isMatch = await user.comparePassword(password);
    if (isMatch) {
      // Create JWT token for the user
      const token = await user.createJwt(res);
      return res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          email: user.email,
        },
        message: 'User logged in successfully with password',
        token,
      });
    } else {
      return res.status(400).send({ message: 'Invalid password' });
    }
  }

  // Handle login with OTP
  if (!password && !otp) {
    return res.status(400).send({ message: 'Password or OTP is required for login' });
  }

  const otpData = await OTP.findOne({ email });
  const currentTime = new Date();

  // Check if an OTP already exists and is still valid (within 10 minutes)
  if (otpData && (currentTime - otpData.createdAt) < 600000) {
    return res.status(400).send({ message: 'An OTP has already been sent. Please wait before requesting a new one.' });
  }

  // Generate a new OTP and send it to the email
  const newOtp = generateOtp();
    otpData.otp = newOtp;
    otpData.createdAt = new Date();
    await otpData.save();
  

  // Send new OTP via email
  await sendMail(email, newOtp);

  return res.status(200).send({
    success: true,
    message: 'New OTP sent. Please verify the OTP.',
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
  
  



