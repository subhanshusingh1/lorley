const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String },
  phoneNumber: { type: String },
  description: { type: String, required: true },
  address: { type: String, required: true },
  category: { type: String, required: true },  // New field for category
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isClaimed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
