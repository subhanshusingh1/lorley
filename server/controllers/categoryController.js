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


// // Register a new category
// exports.addCategory = asyncHandler(async (req, res) => {
//     const { name } = req.body;

//     // Trim and normalize the category name
//     const normalizedCategoryName = name.trim().toLowerCase();
//     console.log('Trying to add category:', normalizedCategoryName);

//     if (!normalizedCategoryName) {
//         return res.status(400).json({ message: 'Category name is required.' });
//     }

//     // Check if category already exists
//     const existingCategory = await Category.findOne({ name: normalizedCategoryName });
//     console.log('Existing category found:', existingCategory);

//     if (existingCategory) {
//         return res.status(400).json({ message: 'Category already exists.' });
//     }

//     // Create a new category
//     const newCategory = new Category({ name: normalizedCategoryName });

//     try {
//         await newCategory.save();
//         res.status(201).json({
//             message: 'Category created successfully!',
//             name: normalizedCategoryName,
//         });
//     } catch (error) {
//         if (error.code === 11000) { // Duplicate key error
//             return res.status(400).json({ message: 'Category already exists.' });
//         }
//         return res.status(500).json({ message: 'Internal server error', error });
//     }
// });



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
