const asyncHandler = require('express-async-handler');
const Category = require('../models/Category'); // Import the Category model

// Register a new category
exports.addCategory = asyncHandler(async (req, res) => {
    const { name} = req.body;

    // Check if the required fields are provided
    if (!name) {
        return res.status(400).json({ message: 'Category name is required.' });
    }

    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
        return res.status(400).json({ message: 'Category already exists.' });
    }

    // Create a new category
    const newCategory = new Category({
        name
     });

    const category = await newCategory.save();
    res.status(201).json({
        message: 'Category created successfully!',
        category
    });
});

// Fetch all categories
exports.fetchAllCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find({}); // Fetch all categories from the Category model
        
        // Check if categories exist
        if (!categories || categories.length === 0) {
            return res.status(404).json({ message: 'No categories found.' });
        }
        
        // Send the list of categories
        res.status(200).json({
            success: true,
            categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories. Please try again later.',
        });
    }
});
