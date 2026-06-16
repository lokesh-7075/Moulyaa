const Event = require("../models/Event");


// ==========================
// HELPER: FORMAT IMAGE PATH
// ==========================

const formatImagePath = (filePath) => {

  const cleanPath = filePath.replace(/\\/g, "/");

  const parts = cleanPath.split("uploads/");

  if (parts.length > 1) {
    return "uploads/" + parts[1];
  }

  return cleanPath;

};



// ==========================
// CREATE EVENT
// ==========================

const createEvent = async (req, res) => {

  try {

    const {
      eventName,
      location,
      eventDate,
      price,
      totalTickets,
      description,
      category
    } = req.body;

    if (!eventName || !location || !eventDate || !price || !totalTickets) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    const images = req.files
      ? req.files.map(file => formatImagePath(file.path))
      : [];

    const event = new Event({
      eventName,
      organizerId: req.user.id,
      location,
      eventDate,
      price: Number(price),
      totalTickets: Number(totalTickets),
      availableTickets: Number(totalTickets),
      description,
      category,
      images
    });

    const savedEvent = await event.save();

    res.status(201).json({
      message: "Event created successfully",
      event: savedEvent
    });

  }
  catch (error) {

    console.error("Create Event Error:", error);

    res.status(500).json({
      message: "Error creating event",
      error: error.message
    });

  }

};



// ==========================
// GET ALL EVENTS
// ==========================

const getEvents = async (req, res) => {

  try {

    const events = await Event.find()
      .populate("organizerId", "name email")
      .sort({ createdAt: -1 });

    res.json(events);

  }
  catch (error) {

    res.status(500).json({
      message: "Error fetching events",
      error: error.message
    });

  }

};



// ==========================
// GET SINGLE EVENT
// ==========================

const getEventById = async (req, res) => {

  try {

    const event = await Event.findById(req.params.id)
      .populate("organizerId", "name email");

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    res.json(event);

  }
  catch (error) {

    res.status(500).json({
      message: "Error fetching event",
      error: error.message
    });

  }

};



// ==========================
// GET MY EVENTS
// ==========================

const getMyEvents = async (req, res) => {

  try {

    const events = await Event.find({
      organizerId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(events);

  }
  catch (error) {

    res.status(500).json({
      message: "Error fetching events",
      error: error.message
    });

  }

};



// ==========================
// UPDATE EVENT
// ==========================

const updateEvent = async (req, res) => {

  try {

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    if (event.organizerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    event.eventName = req.body.eventName || event.eventName;
    event.location = req.body.location || event.location;
    event.eventDate = req.body.eventDate || event.eventDate;
    event.price = req.body.price ? Number(req.body.price) : event.price;
    event.totalTickets = req.body.totalTickets
      ? Number(req.body.totalTickets)
      : event.totalTickets;

    event.description = req.body.description || event.description;
    event.category = req.body.category || event.category;

    if (req.body.totalTickets) {
      event.availableTickets = Number(req.body.totalTickets);
    }

    if (req.files && req.files.length > 0) {
      event.images = req.files.map(file => formatImagePath(file.path));
    }

    const updatedEvent = await event.save();

    res.json({
      message: "Event updated successfully",
      event: updatedEvent
    });

  }
  catch (error) {

    res.status(500).json({
      message: "Error updating event",
      error: error.message
    });

  }

};



// ==========================
// DELETE EVENT
// ==========================

const deleteEvent = async (req, res) => {

  try {

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found"
      });
    }

    if (event.organizerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    await event.deleteOne();

    res.json({
      message: "Event deleted successfully"
    });

  }
  catch (error) {

    res.status(500).json({
      message: "Error deleting event",
      error: error.message
    });

  }

};


module.exports = {
  createEvent,
  getEvents,
  getEventById,
  getMyEvents,
  updateEvent,
  deleteEvent
};