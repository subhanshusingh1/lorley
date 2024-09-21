const express = require('express');
const router = express.Router();
const { getBusinessAnalytics } = require('../controllers/analyticsController');

// Route to get analytics for a specific business
router.get('/:businessId', getBusinessAnalytics);

module.exports = router;
