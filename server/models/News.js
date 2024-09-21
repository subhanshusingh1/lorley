const mongoose = require('mongoose');
const { createIndexes } = require('./Notification');

const newsSchema = mongoose.Schema({
    business: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Business',
        required: true,
        index: true // Index for faster lookup
    },
    headline: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('News', newsSchema);
