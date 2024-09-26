// Import modules
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.protect = asyncHandler(async (req, res, next) => {
    // Get the access token from cookies
    const accessToken = req.cookies.jwt;

    // If access token is not present in cookies
    if (!accessToken) {
        return res.status(401).json({
            success: false,
            message: 'Not Authorized, Access Token not found',
        });
    }

    try {
        // Verify the access token using the secret key
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);

        // Find the user by the decoded token's user id (_id in MongoDB)
        req.user = await User.findById(decoded._id).select('-password'); // Exclude password

        // If the user does not exist
        if (!req.user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        next(); // Move on to the next middleware or route handler
    } catch (error) {
        console.error('Token verification error:', error); // Log the error details

        // Handle token expiration
        if (error.name === 'TokenExpiredError') {
            // Handle the case for refresh token logic
            return res.status(401).json({
                success: false,
                message: 'Access Token expired, please login again or use refresh token',
            });
        }

        // Catch all other JWT verification errors
        return res.status(401).json({
            success: false,
            message: 'Not Authorized, Invalid Access Token',
        });
    }
});
