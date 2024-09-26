const express = require('express');
const router = express.Router();
const {addReview, addReply, getAllReviews, deleteReview, editReview} = require('../controllers/reviewController');
const upload = require('../middleware/multer'); // Ensure you have multer configured
const {protect} = require('../middlewares/reviewMiddleware')

// Add review with image upload
router.post('/:id/reviews', protect , upload.array('images', 5), addReview);

// Reply to a review with image upload
router.post('/:businessId/reviews/:reviewId/reply', protect, upload.array('images', 5), addReply);

// Get All Reviews 
router.get('/:id/reviews', getAllReviews); // Get all reviews for a business

// Delete a review
router.delete('/:businessId/reviews/:reviewId', protect, deleteReview); 

// Edit a review
router.put('/:businessId/reviews/:reviewId', protect, editReview); 

module.exports = router;
