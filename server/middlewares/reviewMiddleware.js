// Import modules
const asyncHandler = require('express-async-handler');
const User = require('../models/User'); // Assuming you have a User model
const jwt = require('jsonwebtoken');

// Middleware to protect review routes
exports.protectReview = asyncHandler(async (req, res, next) => {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1]; // JWT from cookies or Authorization header

    if (token) {
        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Find the user associated with the decoded token
            const user = await User.findById(decoded._id).select('-password');
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Not Authorized, User not found',
                });
            }

            // Attach the user to the request object
            req.user = user;
            next(); // Continue to the next middleware/controller
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
