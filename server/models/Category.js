const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Category name is required'],
        unique: true,
    },
    description: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

// Category model
module.exports = mongoose.model('Category', categorySchema);
