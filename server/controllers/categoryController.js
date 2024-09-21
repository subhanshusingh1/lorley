const Category = require('../models/Category');
const asyncHandler = require('express-async-handler');

// Get all categories
exports.getCategories = asyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.json({
        success: true,
        data: categories,
    });
});
