const express = require('express');
const { createReview, getReviewsForBusiness, getBusinessRating } = require('../controllers/reviewController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

// Add review (protected route)
router.post('/', protect, createReview);

// Get reviews for a specific business
router.get('/:businessId', getReviewsForBusiness);

// Get average rating for a specific business
router.get('/:businessId/rating', getBusinessRating);

module.exports = router;
