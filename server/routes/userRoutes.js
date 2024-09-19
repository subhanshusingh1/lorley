const express = require('express');
const {
  getUserProfile,
  updateUserProfile,
  sendResetPasswordOtp,
  resetPassword,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.route('/reset-password').post(sendResetPasswordOtp).put(resetPassword);

module.exports = router;
