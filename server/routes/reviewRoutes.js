const express = require('express');
const { 
  createReview, 
  getReviewsForBusiness, 
  getBusinessRating,
  likeReview,
  replyToReview
} = require('../controllers/reviewController');
const protect = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware'); // For handling image uploads

const router = express.Router();

// Create a new review with optional image (protected route)
router.post('/', protect, upload.single('image'), createReview);

// Get reviews for a specific business
router.get('/:businessId', getReviewsForBusiness);

// Get average rating for a specific business
router.get('/:businessId/rating', getBusinessRating);

// Like a review (protected route)
router.post('/:id/like', protect, likeReview);

// Reply to a review by the business owner (protected route)
router.post('/:id/reply', protect, replyToReview);

module.exports = router;
