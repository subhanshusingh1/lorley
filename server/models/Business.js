const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isClaimed: { type: Boolean, default: false },
}, { timestamps: true });

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
