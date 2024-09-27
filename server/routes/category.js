const express = require('express');
const { addCategory, fetchAllCategories } = require('../controllers/categoryController'); 

const router = express.Router();

// Register a new category
router.post('/', addCategory);
// Fetch all Categories
router.get('/', fetchAllCategories); // Fetch all categories


module.exports = router;
