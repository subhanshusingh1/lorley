const express = require('express');
const { createBusiness, getAllBusinesses, updateBusiness, deleteBusiness } = require('../controllers/businessController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

// Protected route
router.route('/')
  .post(protect, createBusiness)
  .get(getAllBusinesses);

router.route('/:id')
  .put(protect, updateBusiness)
  .delete(protect, deleteBusiness);

module.exports = router;
