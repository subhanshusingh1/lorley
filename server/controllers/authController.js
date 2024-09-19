const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendEmail');

// User Registration
registerUser = async (req, res) => {
  const { name, email, mobile, password } = req.body;
  const userExists = await User.findOne({ $or: [{ email }, { mobile }] });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const user = await User.create({ name, email, password, mobile });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  user.otp = otp;
  await user.save();
// Use Any of the two you think is more secure
  /*const otp = generateOtp();
  user.otp = otp;
  user.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes expiry
  await user.save();*/

  if (email) {
    await sendOtp(email, otp);  // Send OTP to email
  } else if (mobile) {
    // Implement mobile OTP sending (using Twilio orany other tools)
    await sendOtp(mobile, otp);
  }

  res.status(201).json({
    message: 'OTP sent',
    userId: user._id,
  });
};

// OTP Verification
verifyOtp = async (req, res) => {
  const { userId, otp } = req.body;

  const user = await User.findById(userId);
  if (!user || user.otp !== otp || user.otpExpiry < Date.now()) {
    return res.status(400).json({ message: 'Invalid OTP' });
  }

// Use This or   
  user.isVerified = true;
  user.otp = null; // Clear OTP after verification
  await user.save();

  res.json({
    token: generateToken(user._id),
  });
};

// This one
/*  
  user.otp = undefined;
  user.otpExpiry = undefined;
  await user.save();
  
  res.json({ token: generateToken(user._id) });
};
*/

// User Login
const loginUser = async (req, res) => {
  const { email, mobile, password } = req.body;

  const user = await User.findOne({ $or: [{ email }, { mobile }] });
  if (!user) {
    return res.status(400).json({ message: 'User not found' });
  }
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Invalid credentials' });
  }
  
  res.json({ token: generateToken(user._id) });
};

module.exports = { registerUser, verifyOtp, loginUser };
