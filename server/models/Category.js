const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        trim: true, // Automatically trim whitespace from the string
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        max: 500
    },
}, {
    timestamps: true,
});

// Category model
module.exports = mongoose.model('Category', categorySchema);
