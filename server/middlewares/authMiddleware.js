// import modules
const asyncHandler = require('express-async-handler');
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

exports.protect = asyncHandler(async (req, res, next) => {
    const token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded._id).select("-password");
            next();
        } catch (error) {
            console.error('Token verification error:', error); // Log the error
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
