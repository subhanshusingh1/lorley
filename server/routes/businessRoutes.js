const express = require('express');
const { createOrUpdateBusiness, getBusinesses, getCategories } = require('../controllers/businessController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const validateBusinessInput = require('../middleware/validateBusinessInput'); // Assuming you create this middleware
const rateLimit = require('express-rate-limit'); // You'll need to install this package

const router = express.Router();

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Route to create or update a business
router.post('/:id?', protect, upload.single('logo'), validateBusinessInput, createOrUpdateBusiness);

// Route to fetch businesses (with optional category filtering)
router.get('/', apiLimiter, getBusinesses);

// Route to fetch all available categories
router.get('/categories', apiLimiter, getCategories);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = router;
