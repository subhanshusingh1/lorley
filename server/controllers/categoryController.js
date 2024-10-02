const asyncHandler = require('express-async-handler');
const Category = require('../models/Category'); // Import the Category model

// Register a new category
exports.addCategory = asyncHandler(async (req, res) => {
    const { name , description} = req.body;

    // Check if the required field is provided
    if (!name || !description) {
        return res.status(400).json({ message: 'name and description is required.' });
    }

    // Check if the category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
        return res.status(400).json({ message: 'Category already exists.' });
    }

    // Create a new category
    const newCategory = new Category({
        name,
        description
    });

    await newCategory.save();
    res.status(201).json({
        message: 'Category created successfully!',
        newCategory// Optionally return the created category
    });
});


// Fetch all categories
exports.fetchAllCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await Category.find({}); // Fetch categories
        if (!categories || categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No categories found.',
            });
        }
        res.status(200).json({
            success: true,
            categories, // This should be an array of categories
        });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({
            success: false,
            message: 'Failed to fetch categories. Please try again later.',
        });
    }
});


