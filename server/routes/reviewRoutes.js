const express = require('express');
const router = express.Router();
const {submitReview, uploadReviewPhotos} = require('../controllers/reviewController');
const upload = require('../config/multerConfig'); // Ensure you have multer configured
const {protectReview} = require('../middlewares/reviewMiddleware')

// POST route to submit a review
router.post('/business/:businessId/reviews', protectReview, submitReview);

// Route to submit a review with photos
router.post('/upload-photos/:businessId', protectReview, upload.array('images', 10), uploadReviewPhotos); // Max 10 images


module.exports = router;
