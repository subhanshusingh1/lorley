const express = require('express');
const { createNews, getNews, deleteNews } = require('../controllers/newsController');
const {protect} = require('../middlewares/authMiddleware');

const router = express.Router();

// Fetch news related to a specific business
router.route('/business/:businessId').get(getNews);

// Create a new news article (protected route)
router.route('/').post(protect, createNews);

// Delete a specific news article (protected route)
router.route('/:newsId').delete(protect, deleteNews);

module.exports = router;
