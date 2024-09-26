const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Business = require('../models/Business');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// POST /business/:id/reviews
exports.addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const businessId = req.params.id;

  try {
    // Array to store uploaded image URLs
    let imageUrls = [];

    // If images are provided, upload them to Cloudinary
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'reviews',
          width: 800,
          height: 800,
          crop: "limit"
        });

        // Store the uploaded image URL
        imageUrls.push(result.secure_url);

        // Remove the file from local storage
        fs.unlinkSync(file.path);
      }
    }

    // Create and save the new review with uploaded image URLs
    const review = new Review({
      business: businessId,
      user: req.user._id, // Assuming `req.user` contains authenticated user info
      rating,
      comment,
      images: imageUrls, // Attach the image URLs to the review
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review added successfully',
      review,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /business/:businessId/reviews/:reviewId/reply
exports.addReply = asyncHandler(async (req, res) => {
    const { replyText } = req.body;
    const { businessId, reviewId } = req.params;
  
    try {
      // Array to store uploaded reply image URLs
      let replyImageUrls = [];
  
      // If reply images are provided, upload them to Cloudinary
      if (req.files && req.files.length > 0) {
        for (const file of req.files) {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: 'replies',
            width: 800,
            height: 800,
            crop: "limit"
          });
  
          // Store the uploaded reply image URL
          replyImageUrls.push(result.secure_url);
  
          // Remove the file from local storage
          fs.unlinkSync(file.path);
        }
      }
  
      // Find the review to add a reply
      const review = await Review.findById(reviewId);
  
      if (!review) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }
  
      // Check if the business replying is the owner of the review
      const business = await Business.findById(businessId);
      if (!business || business._id.toString() !== review.business.toString()) {
        return res.status(403).json({ success: false, message: 'Unauthorized to reply to this review' });
      }
  
      // Add the reply (text and image URLs) to the review's `replies` array
      review.replies.push({
        replyText,
        replyImages: replyImageUrls,
        repliedAt: new Date(),
      });
  
      await review.save();
  
      res.status(200).json({
        success: true,
        message: 'Reply added successfully',
        review,
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  });


  // GET /business/:id/reviews
exports.getAllReviews = asyncHandler(async (req, res) => {
    const businessId = req.params.id;

    try {
        const reviews = await Review.find({ business: businessId })
            .populate('user', 'name profileImage') // Populate user fields for user details
            .sort({ createdAt: -1 }); // Sort reviews by most recent first

        res.status(200).json({
            success: true,
            reviews,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE /business/:businessId/reviews/:reviewId
exports.deleteReview = asyncHandler(async (req, res) => {
    const { reviewId } = req.params;
    const userId = req.user._id; // Assuming user is authenticated and user info is populated in req.user

    try {
        // Find the review to delete
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found." });
        }

        // Check if the user is the author of the review
        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this review." });
        }

        await review.remove();

        res.status(200).json({
            success: true,
            message: "Review deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PUT /business/:businessId/reviews/:reviewId
exports.editReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const { reviewId } = req.params;
    const userId = req.user._id;

    try {
        // Find the review to edit
        const review = await Review.findById(reviewId);

        if (!review) {
            return res.status(404).json({ success: false, message: "Review not found." });
        }

        // Check if the user is the author of the review
        if (review.user.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "You are not authorized to edit this review." });
        }

        // Update review details
        review.rating = rating !== undefined ? rating : review.rating; // Update rating only if provided
        review.comment = comment !== undefined ? comment : review.comment; // Update comment only if provided

        await review.save();

        res.status(200).json({
            success: true,
            message: "Review updated successfully.",
            review,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

  
