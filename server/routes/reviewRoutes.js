const express = require('express');
const { createReview, getReviews, deleteReview } = require('../controllers/reviewController');
const {protect} = require('../middlewares/authMiddleware');

const router = express.Router();

// Create or Get Review 
router.route('/:businessId')
.post(protect, createReview)
.get(getReviews);

// Delete Specific Review
router.route('/:reviewId')
.delete(protect, deleteReview);

module.exports = router;
