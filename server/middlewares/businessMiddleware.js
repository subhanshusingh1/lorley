// Import modules
const asyncHandler = require('express-async-handler');
const Business = require('../models/Business');
const jwt = require('jsonwebtoken');

// Middleware to protect business routes
exports.protectBusiness = asyncHandler(async (req, res, next) => {
    const token = req.cookies.jwt;  // JWT from cookies

    if (token) {
        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the business associated with the decoded token
            const business = await Business.findById(decoded._id).select('-password');
            
            if (!business) {
                return res.status(401).json({
                    success: false,
                    message: 'Not Authorized, Business not found'
                });
            }

            // Attach business to request object
            req.business = business;
            next(); // Continue to the next middleware/controller
        } catch (error) {
            console.error('Token verification error:', error); // Log the error for debugging
            res.status(401).json({
                success: false,
                message: 'Not Authorized, Invalid Token'
            });
        }
    } else {
        res.status(401).json({
            success: false,
            message: 'Not Authorized, Token not found'
        });
    }
});
