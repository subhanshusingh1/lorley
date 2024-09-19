const express = require('express');
const { createBusiness, getBusinesses } = require('../controllers/businessController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createBusiness); // Protected route
router.get('/', getBusinesses);

module.exports = router;
