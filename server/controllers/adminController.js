const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// Get all users
exports.getUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password'); // Exclude passwords from response
    res.status(200).json({ success: true, data: users });
});

// Delete a user
exports.deleteUser = asyncHandler(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
        return res.status(404).json({ success: false, msg: 'User not found' });
    }

    await user.remove();
    res.status(200).json({ success: true, msg: 'User removed' });
});
