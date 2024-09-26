const express = require('express');
const { 
    addBusiness, 
    sendOtp, 
    verifyOtp, 
    login
} = require('../controllers/businessController'); // Ensure these controllers are defined
const multer = require('multer');

// Multer setup for file uploads if you plan to use it, can be removed if not needed
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Route to register/add a new business
router.post('/', addBusiness); // Assuming this will register a business

// Route for businesses to log in
router.post('/login', login);

// Route to send OTP for business verification
router.post('/send-otp', sendOtp);

// Route to verify the OTP for business
router.post('/verify-otp', verifyOtp);

// Route for Forgot Password 
router.post('/forgot-password', forgotPassword);

// Route for Reset Password
router.post('/reset-password', resetPassword);

module.exports = router;
