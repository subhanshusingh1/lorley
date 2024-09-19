const Business = require('../models/Business');

// Create a new business
const createBusiness = async (req, res) => {
  const { name, description, address } = req.body;

  const business = await Business.create({
    name,
    description,
    address,
  });

  res.status(201).json(business);
};

// Get all businesses
const getBusinesses = async (req, res) => {
  const businesses = await Business.find();
  res.json(businesses);
};

module.exports = { createBusiness, getBusinesses };
