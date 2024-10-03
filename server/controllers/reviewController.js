const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Business = require('../models/Business');
const { cloudinary } = require('../config/cloudinary');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const fs = require('fs');
const upload =  require('../config/multerConfig'); // Create multer instance with Cloudinary storage

// @desc Upload photos for a review and submit the review
// @route POST /api/v1/reviews/:businessId
exports.uploadReviewPhotos = upload.array('images'), asyncHandler(async (req, res) => {
  const { businessId } = req.params; // Get the business ID from the request parameters
  const userId = req.user._id; // Assuming req.user is populated by middleware (for authentication)
  const { rating, comment } = req.body; // The rating and comment come from the request body

  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ message: 'No files uploaded.' });
  }

  try {
    const photoUrls = [];

    // Loop through the files to get their secure URLs
    for (const file of req.files) {
      photoUrls.push(file.path); // Cloudinary automatically handles the upload
    }

    // Create a new review with the uploaded photos
    const review = await Review.create({
      business: businessId,
      user: userId,
      rating,
      comment,
      images: photoUrls, // Store Cloudinary URLs in the images field
    });

    res.status(200).json({
      message: 'Review submitted and photos uploaded successfully.',
      review,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading review photos', error: error.message });
  }
});



// Submit Review
exports.submitReview = asyncHandler(async (req, res) => {
    const { rating, comment, images } = req.body;
    const businessId = req.params.businessId; // Assuming you pass businessId in the URL
    const userId = req.user._id; // Assuming user info is added to req.user by an authentication middleware

    // Validate the review data
    if (!rating || !comment) {
        return res.status(400).json({ message: 'Rating and comment are required.' });
    }

    try {
        // Create a new review object
        const review = new Review({
            business: businessId,
            user: userId,
            rating,
            comment,
            images, // Images array should already be the URLs returned from Cloudinary
        });

        // Save the review to the database
        const savedReview = await review.save();

        // Optionally, you can also update the business with the new review
        await Business.findByIdAndUpdate(businessId, {
            $push: { reviews: savedReview._id } // Assuming reviews is an array in the Business model
        });

        // Return the saved review as the response
        res.status(201).json({
            message: 'Review submitted successfully.',
            review: savedReview,
        });
    } catch (error) {
        res.status(500).json({ message: 'Error submitting review', error: error.message });
    }
});

