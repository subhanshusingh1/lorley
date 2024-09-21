const express = require('express');
const { getUsers, deleteUser } = require('../controllers/adminController');
const { protect } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get('/users', protect, getUsers);
router.delete('/users/:id', protect, deleteUser);

module.exports = router;
