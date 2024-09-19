const express = require('express');
const { getUsers, getBusinesses, deleteUser } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

// Admin-only routes
router.get('/users', protect, admin, getUsers);
router.get('/businesses', protect, admin, getBusinesses);
router.delete('/users/:userId', protect, admin, deleteUser);

module.exports = router;
