const asyncHandler = require('express-async-handler');
const News = require('../models/News');
const Business = require('../models/Business');

// Create a news post
exports.createNews = asyncHandler(async (req, res) => {
    const { headline, content } = req.body;

    // Validate input
    if (!headline || !content) {
        return res.status(400).json({ message: 'Headline and content are required' });
    }

    const business = await Business.findById(req.user.businessId);
    if (!business) {
        return res.status(404).json({ message: 'Business not found' });
    }

    const news = new News({
        business: req.user.businessId,
        headline,
        content,
    });

    await news.save();
    res.status(201).json({
        success: true,
        data: news,
        message: 'News Created Successfully'
    });
});

// Get all news posts for a business
exports.getNews = asyncHandler(async (req, res) => {
    const news = await News.find({ business: req.params.businessId });

    if (!news.length) {
        return res.status(404).json({ message: 'No news found for this business' });
    }

    res.json({ success: true, data: news });
});

// Delete a news post
exports.deleteNews = asyncHandler(async (req, res) => {
    const news = await News.findById(req.params.newsId);

    if (!news) {
        return res.status(404).json({ message: 'News not found' });
    }

    if (news.business.toString() !== req.user.businessId) {
        return res.status(401).json({ message: 'Not authorized to delete this news' });
    }

    await news.remove();
    res.json({ success: true, message: 'News removed' });
});
