const Review = require('../models/Review');
const Business = require('../models/Business');

// Create a new review
exports.createReview = async (req, res) => {
  const { rating, comment, businessId } = req.body;
  const image = req.file ? req.file.path : null; // Handle image upload

  try {
    const existingReview = await Review.findOne({
      user: req.user.id,
      business: businessId,
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this business' });
    }

    const review = new Review({
      business: businessId,
      user: req.user.id,
      rating,
      comment,
      image
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Get reviews for a specific business
exports.getReviewsForBusiness = async (req, res) => {
  try {
    const reviews = await Review.find({ business: req.params.businessId }).populate('user', 'name');
    
    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found' });
    }

    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Calculate average rating for a business
exports.getBusinessRating = async (req, res) => {
  try {
    const reviews = await Review.find({ business: req.params.businessId });

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for this business' });
    }

    const avgRating =
      reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

    res.json({ averageRating: avgRating });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Like a review
exports.likeReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (!review.likes.includes(req.user.id)) {
      review.likes.push(req.user.id);
      await review.save();
    }

    res.status(200).json({ message: 'Review liked' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Business owner reply to a review
exports.replyToReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });

    if (review.business.toString() !== req.user.business.toString()) {
      return res.status(403).json({ message: 'You do not have permission to reply to this review' });
    }

    review.reply = req.body.reply;
    await review.save();

    res.status(200).json({ message: 'Reply added', review });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = { 
  createReview, 
  getReviewsForBusiness, 
  getBusinessRating,
  likeReview,
  replyToReview
};
