const express = require('express');
// User controllers
const { login, register, verifyOtp, forgotPassword, resetPassword, updateProfile, deleteUserProfile, sendOtp, getProfileById, deleteUser, refreshToken } = require("../controllers/userController.js");
// Auth middlewares
const { protect } = require("../middlewares/authMiddleware.js");

const { uploadProfileImage } = require('../controllers/userController');
const upload  = require('../config/multerConfig'); 

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

// Route to get particular user details
router.get("/profile/:id", protect , getProfileById)

// Route to upload profile image
router.post('/upload-profile-image', protect, upload.single('profileImage'), uploadProfileImage);

// Route to delete user profile by ID
router.delete('/profile/:id', protect, deleteUser);

// Route for refreshing access token
router.post('/refresh-token', refreshToken)

module.exports = router;
