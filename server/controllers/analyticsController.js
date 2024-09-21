const asyncHandler = require('express-async-handler');
const Business = require('../models/Business');

exports.getBusinessAnalytics = asyncHandler(async (req, res) => {
    const { businessId } = req.params;
    const business = await Business.findById(businessId);

    if (!business) {
        return res.status(404).json({ error: 'Business not found' });
    }

    const analytics = {
        totalViews: business.views,
        totalInteractions: business.interactions,
    };

    res.json(analytics);
});
