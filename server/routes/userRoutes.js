const express = require('express');
// User controllers
const { login, register, verifyOtp, forgotPassword, resetPassword, updateProfile, deleteUserProfile, sendOtp, getProfileById, deleteUser, refreshToken, updateUserProfile } = require("../controllers/userController.js");
// Auth middlewares
const { protect } = require("../middlewares/authMiddleware.js");

const { uploadProfileImage } = require('../controllers/userController');
const upload  = require('../config/multerConfig.js'); 

const router = express.Router();

// Route for user registration
router.post("/register", register);

// Route to send otp
router.post("/send-otp", sendOtp)

// Route for OTP verification
router.post("/verify-otp", verifyOtp);

// Protected route for user login
router.post("/login", login);

// Route for forgot password
router.post('/forgot-password', forgotPassword);

// Route for reset password
router.post("/reset-password", resetPassword);

// Route to upload profile image
router.post('/upload-profile-image', protect, upload.single('profileImage'), uploadProfileImage);

// Route for refreshing access token
router.post('/refresh-token', refreshToken)

// Route to fetch user profile by ID
router.get('/profile/:id', protect, getProfileById); // Assuming the user needs to be authenticated to access profile

// Route to update user profile
router.put('/update-profile', protect, updateUserProfile); // Assuming the user needs to be authenticated to update their profile

// Route to delete user account
router.delete('/profile/:id', protect, deleteUser); // Assuming the user needs to be authenticated to delete their account

module.exports = router;
