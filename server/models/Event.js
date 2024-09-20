const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  eventName: { type: String, required: true },
  description: { type: String, required: true },
  eventDate: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;
