const asyncHandler = require('express-async-handler');
const Business = require('../models/Business');
const jwt = require('jsonwebtoken');

// Middleware to protect business routes
exports.protectBusiness = asyncHandler(async (req, res, next) => {
    // Get the access token from cookies
    const accessToken = req.cookies.accessToken;

    // Check if the access token exists
    if (!accessToken) {
        console.log('No access token found for business');
        return res.status(401).json({
            success: false,
            message: 'Not Authorized, Access Token not found',
        });
    }

    try {
        // Verify the access token
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        // Attach business to the request object after finding it by ID
        req.business = await Business.findById(decoded._id).select('-password'); // Exclude password

        // Check if the business exists
        if (!req.business) {
            return res.status(404).json({
                success: false,
                message: 'Business not found',
            });
        }

        // Proceed to the next middleware/controller
        next();
    } catch (error) {
        console.error('Token verification error for business:', error);

        // Handle specific token expiration case
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Access Token expired, please login again or use refresh token',
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Not Authorized, Invalid Access Token',
        });
    }
});
