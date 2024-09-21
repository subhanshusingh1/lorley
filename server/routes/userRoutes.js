const express = require('express');
// user controllers
const {login, register, verifyOtp, forgotPassword, resetPassword} = require("../controllers/userController.js")
// auth middlewares
const {protect} = require("../middlewares/authMiddleware.js")
const router = express.Router();

// Route for user registration
router.post("/register", register);

// Route for OTP verification
router.post("/verify-otp", verifyOtp)

// Protected route for user login
router.post("/login", protect, login);

// Route for forgot password
router.post("/forgot-password", forgotPassword);

// Route for reset password
router.post("/reset-password", resetPassword);


module.exports = router;
