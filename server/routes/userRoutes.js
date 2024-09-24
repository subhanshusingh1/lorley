const express = require('express');
// User controllers
const { login, register, verifyOtp, forgotPassword, resetPassword, updateProfile, deleteUserProfile, sendOtp } = require("../controllers/userController.js");
// Auth middlewares
const { protect } = require("../middlewares/authMiddleware.js");

const router = express.Router();

// Middleware for file upload
const { upload } = require('../config/multerConfig'); // Assuming you've set up multer in a config file

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

// Protected route for updating user profile (with image upload)
// router.put("/profile", protect, upload.single('profileImage'), updateProfile); 


// Route to delete user profile by ID
router.delete('/profile/:id', protect, deleteUserProfile);

module.exports = router;
