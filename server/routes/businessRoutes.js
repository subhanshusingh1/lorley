const express = require('express');
const { 
    addBusiness, 
    sendOtp, 
    verifyOtp, 
    login,
    forgotPassword,
    resetPassword,
    fetchBusinessById,
    refreshBusinessToken,
    updateBusinessDetails,
    uploadBusinessLogo,
    uploadBusinessPhotos,
    fetchAllBusinesses,
    searchBusinesses,
    registerBusiness,
    getBusinessDetails
} = require('../controllers/businessController'); // Ensure these controllers are defined
const multer = require('multer');

// protect middleware
const {protectBusiness} = require('../middlewares/businessMiddleware');

// Multer setup for file uploads if you plan to use it, can be removed if not needed
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Route to register a new business
router.post('/register', registerBusiness);

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

// Route to fetch Business Details
router.get('/profile/:id', protectBusiness, fetchBusinessById);

// Generate Refresh Token
router.post('/refresh-token', refreshBusinessToken)

// fetch details for dashboard
router.get('/dashboard/:businessId', protectBusiness, getBusinessDetails);

// Update Business Route
router.put('/:id', protectBusiness, updateBusinessDetails);

// Single file upload for logo
router.post('/upload-logo', protectBusiness, upload.single('file'), uploadBusinessLogo);

// Multiple file upload for photos
router.post('/upload-photos', protectBusiness, upload.array('files', 10), uploadBusinessPhotos); // Limiting to 10 files at once

// Define the route to fetch all businesses
router.get('/', fetchAllBusinesses);

// Search for business
router.get('/search', searchBusinesses);


module.exports = router;
