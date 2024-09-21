const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true // Trims whitespace
    },
    description: {
        type: String,
        required: true,
        trim: true // Trims whitespace
    },
    address: {
        type: String,
        required: true,
        trim: true // Trims whitespace
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true // For faster lookup
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    verificationStatus: {
        type: String,
        enum: ['Pending', 'Verified', 'Rejected'],
        default: 'Pending'
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, // Reference to Category model
        ref: 'Category',
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    interactions: {
        type: Number,
        default: 0
    },
    theme: { 
        type: String, 
        default: 'default' 
    },
    additionalDetails: {
        type: String 
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }]
}, {
    timestamps: true,
});

module.exports = mongoose.model('Business', businessSchema);
