const Business = require('../models/Business');

// Create a new business
const createBusiness = async (req, res) => {
  const { name, address, phoneNumber, description } = req.body;
  const business = await Business.create({
    name,
    address,
    phoneNumber,
    description,
    owner: req.user._id,
  });

  res.status(201).json(business);
};

// Update a business
const updateBusiness = async (req, res) => {
  const business = await Business.findById(req.params.id);

  if (business.owner.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  Object.assign(business, req.body);
  await business.save();

  res.json(business);
};

// Delete a business
const deleteBusiness = async (req, res) => {
  const business = await Business.findById(req.params.id);

  if (business.owner.toString() !== req.user._id.toString()) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  await business.remove();
  res.json({ message: 'Business deleted' });
};

// Get all businesses
const getAllBusinesses = async (req, res) => {
  const businesses = await Business.find();
  res.json(businesses);
};

module.exports = {
  createBusiness,
  updateBusiness,
  deleteBusiness,
  getAllBusinesses,
};