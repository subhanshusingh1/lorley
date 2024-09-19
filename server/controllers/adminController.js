const User = require('../models/User');
const Business = require('../models/Business');

// Get all users
const getUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};

// Get all businesses
const getBusinesses = async (req, res) => {
  const businesses = await Business.find();
  res.json(businesses);
};

// Delete a user
const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (user) {
    await user.remove();
    res.json({ message: 'User removed' });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { getUsers, getBusinesses, deleteUser };
