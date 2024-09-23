const express = require('express');
const { 
    getBusinesses, 
    addBusiness, 
    updateBusiness, 
    deleteBusiness, 
    verifyBusiness, 
    getBusinessById, 
    addReview, 
    updateBusinessCustomization, 
    businessLogin 
} = require('../controllers/businessController');
const { protectBusiness } = require('../middlewares/businessMiddleware');
const multer = require('multer');

// Multer setup for file uploads (used for logos and verification documents)
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Route to get all businesses (with optional category and businessType filtering)
router.get('/', getBusinesses);

// Route to register/add a new business (must be logged in as a user)
router.post('/', protectBusiness, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'photos', maxCount: 5 }]), addBusiness);

// Route for businesses to log in
router.post('/login', businessLogin);

// Route to update a business (only the business owner can update)
router.put('/:id', protectBusiness, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'photos', maxCount: 5 }]), updateBusiness);

// Route to delete a business (only the business owner can delete)
router.delete('/:id', protectBusiness, deleteBusiness);

// Route to verify a business (uploading verification document)
router.post('/:id/verify', protectBusiness, upload.single('document'), verifyBusiness);

// Route to get a specific business by ID (view business details)
router.get('/:id', getBusinessById);

// Route to add a review for a business (must be logged in)
router.post('/:id/review', protectBusiness, addReview);

// Route to update business customization (only the business owner can customize)
router.put('/:id/customization', protectBusiness, updateBusinessCustomization);

module.exports = router;
