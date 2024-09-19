const Review = require('../models/Review');
const Business = require('../models/Business');

// Create a new review
const createReview = async (req, res) => {
  const { rating, comment, businessId } = req.body;

  const existingReview = await Review.findOne({
    user: req.user._id,
    business: businessId,
  });

  if (existingReview) {
    return res.status(400).json({ message: 'You have already reviewed this business' });
  }

  const review = await Review.create({
    user: req.user._id,
    business: businessId,
    rating,
    comment,
  });

  res.status(201).json(review);
};

// Get reviews for a specific business
const getReviewsForBusiness = async (req, res) => {
  const reviews = await Review.find({ business: req.params.businessId }).populate('user', 'name');

  if (!reviews) {
    return res.status(404).json({ message: 'No reviews found' });
  }

  res.json(reviews);
};

// Calculate average rating for a business
const getBusinessRating = async (req, res) => {
  const reviews = await Review.find({ business: req.params.businessId });

  if (reviews.length === 0) {
    return res.status(404).json({ message: 'No reviews found for this business' });
  }

  const avgRating =
    reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

  res.json({ averageRating: avgRating });
};

module.exports = { createReview, getReviewsForBusiness, getBusinessRating };
