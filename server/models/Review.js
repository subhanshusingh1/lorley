const mongoose = require('mongoose');

const reviewSchema = mongoose.Schema({
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true,
        index : true // indexing the field
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index : true // indexing the field
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        minlength: 5, // Minimum length for comment
        maxlength: 500 // Maximum length for comment
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Review', reviewSchema);
