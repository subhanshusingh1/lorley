const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// User Registration
const registerUser = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password, mobile });
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  await user.save();

  // Send OTP via email
  await sendEmail(email, otp);

  res.status(201).json({
    message: 'OTP sent to your email',
  });
};

// OTP Verification
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  user.isVerified = true;
  user.otp = null; // Clear OTP after verification
  await user.save();

  res.json({
    token: generateToken(user._id),
  });
};

// User Login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await user.matchPassword(password))) {
    return res.status(400).json({ message: 'Invalid email or password' });
  }

  if (!user.isVerified) {
    return res.status(400).json({ message: 'Please verify your email first' });
  }

  res.json({
    token: generateToken(user._id),
  });
};

module.exports = { registerUser, verifyOtp, loginUser };
