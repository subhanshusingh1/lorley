const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Business = require('../models/Business');

// Middleware to protect routes (for both users and businesses)
exports.protect = asyncHandler(async (req, res, next) => {
    let token;

    // Check if the JWT is in the cookies or Authorization headers
    if (req.cookies.jwt) {
        token = req.cookies.jwt;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Check if it's a user or business
            let user = await User.findById(decoded._id).select('-password');
            let business = await Business.findById(decoded._id).select('-password');

            if (user) {
                // Attach user to request object
                req.user = user;
                next(); // Continue to the next middleware/controller
            } else if (business) {
                // Attach business to request object
                req.business = business;
                next(); // Continue to the next middleware/controller
            } else {
                res.status(401).json({
                    success: false,
                    message: 'Not Authorized, User or Business not found',
                });
            }
        } catch (error) {
            console.error('Token verification error:', error); // Log the error for debugging
            res.status(401).json({
                success: false,
                message: 'Not Authorized, Invalid Token',
            });
        }
    } else {
        res.status(401).json({
            success: false,
            message: 'Not Authorized, Token not found',
        });
    }
});
