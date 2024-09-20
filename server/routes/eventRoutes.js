const express = require('express');
const { createEvent, getEventsByBusiness, deleteEvent } = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new event for a business
router.post('/:businessId', protect, createEvent);

// Get all events for a business
router.get('/:businessId', getEventsByBusiness);

// Delete an event
router.delete('/:id', protect, deleteEvent);

module.exports = router;
