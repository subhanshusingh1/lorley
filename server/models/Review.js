const mongoose = require('mongoose');
const validator = require('validator');

// Review schema
const reviewSchema = new mongoose.Schema({
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true,
        index: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 500,
    },
    images: [{
        type: String,
        validate: [validator.isURL, 'Invalid URL for image'],
        default: [],
    }],
    replies: [{
        replyText: {
            type: String,
            minlength: 5,
            maxlength: 500,
        },
        replyImages: [{
            type: String,
            validate: [validator.isURL, 'Invalid URL for image'],
            default: [],
        }],
        repliedAt: {
            type: Date,
            default: Date.now,
        }
    }],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Review', reviewSchema);
