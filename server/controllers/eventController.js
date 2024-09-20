// server/controllers/eventController.js
const Event = require('../models/Event');

// Create an event for a business
exports.createEvent = async (req, res) => {
  const { eventName, description, eventDate } = req.body;

  try {
    const event = new Event({
      business: req.params.businessId,
      eventName,
      description,
      eventDate
    });

    await event.save();
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Fetch all events for a business
exports.getEventsByBusiness = async (req, res) => {
  try {
    const events = await Event.find({ business: req.params.businessId });
    res.status(200).json(events);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Delete an event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await event.remove();
    res.status(200).json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
