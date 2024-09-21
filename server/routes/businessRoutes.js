const express = require('express');
const { 
    getBusinesses, 
    addBusiness, 
    updateBusiness, 
    deleteBusiness, 
    verifyBusiness, 
    getBusinessById, 
    addReview, 
    updateBusinessCustomization 
} = require('../controllers/businessController');
const { protect } = require('../middlewares/authMiddleware');
const multer = require('multer');

// Multer setup for file uploads
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

// Route to get all businesses (with optional category filtering)
router.get('/', getBusinesses);

// Route to add a new business
router.post('/', protect, addBusiness);

// Route to update a business
router.put('/:id', protect, updateBusiness);

// Route to delete a business
router.delete('/:id', protect, deleteBusiness);

// Route to verify a business
router.post('/:id/verify', protect, upload.single('document'), verifyBusiness);

// Route to get a business by ID
router.get('/:id', getBusinessById);

// Route to add a review to a business
router.post('/:id/review', protect, addReview);

// Route to update business customization
router.put('/:id/customization', protect, updateBusinessCustomization);

module.exports = router;
