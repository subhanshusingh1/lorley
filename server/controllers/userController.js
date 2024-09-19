const User = require('../models/User');
const { sendOtp } = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// Get user profile
exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      mobile: user.mobile,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.mobile = req.body.mobile || user.mobile;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      mobile: updatedUser.mobile,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// Send OTP for password reset
exports.sendResetPasswordOtp = async (req, res) => {
  const { email, mobile } = req.body;
  const user = await User.findOne({ $or: [{ email }, { mobile }] });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const otp = generateOtp();
  user.otp = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
  await user.save();

  if (email) {
    await sendOtp(email, otp);
  } else if (mobile) {
    // Implement mobile OTP sending (e.g., using Twilio)
    await sendOtp(mobile, otp);
  }

  res.json({ message: 'OTP sent for password reset' });
};

// Reset password
exports.resetPassword = async (req, res) => {
  const { otp, newPassword } = req.body;
  const user = await User.findOne({ otp });

  if (!user || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

  user.password = newPassword;
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();

  res.json({ message: 'Password reset successful' });
};
