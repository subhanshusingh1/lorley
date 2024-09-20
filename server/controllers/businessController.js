const Business = require('../models/Business');

// Create or Update Business
exports.createOrUpdateBusiness = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const logo = req.file ? req.file.path : null; // Handle file upload (logo)
    
    let business;
    if (req.params.id) {
      // Update existing business
      business = await Business.findById(req.params.id);
      if (!business) return res.status(404).json({ message: 'Business not found' });

      business.name = name;
      business.description = description;
      business.category = category;
      if (logo) business.logo = logo;

      await business.save();
      return res.status(200).json(business);
    } else {
      // Create new business
      business = new Business({
        name,
        description,
        category,
        logo,
        owner: req.user.id
      });
      await business.save();
      return res.status(201).json(business);
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Fetch all businesses with optional category filtering
exports.getBusinesses = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    
    const businesses = await Business.find(filter);
    return res.status(200).json(businesses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Fetch all available categories (unique)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Business.distinct('category');
    return res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
