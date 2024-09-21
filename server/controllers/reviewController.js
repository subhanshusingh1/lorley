const Review = require('../models/Review');
const Business = require('../models/Business');
const asyncHandler = require('express-async-handler');

// Creating new Review
exports.createReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    // Validate input
    if (typeof rating !== 'number' || rating < 1 || rating > 5) {
        return res.status(400).json({ message: 'Rating must be a number between 1 and 5' });
    }

    const business = await Business.findById(req.params.businessId);

    if (!business) {
        return res.status(404).json({ message: 'Business not found' });
    }

    const review = new Review({
        user: req.user.id,
        business: req.params.businessId,
        rating,
        comment,
    });

    await review.save();

    res.status(201).json({
        success: true,
        review
    });
});

// Get Review
exports.getReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({ business: req.params.businessId }).populate('user', 'name');

    res.json({
        success: true,
        reviews
    });
});

// Delete Review
exports.deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
        return res.status(404).json({ message: 'Review not found' });
    }

    if (review.user.toString() !== req.user.id) {
        return res.status(401).json({ message: 'Not authorized to delete this review' });
    }

    await review.remove();

    res.json({ 
        success: true,
        message: 'Review deleted successfully' 
    });
});
