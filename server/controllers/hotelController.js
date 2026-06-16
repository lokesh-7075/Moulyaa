const Hotel = require("../models/Hotel");

// ======================
// CREATE HOTEL
// ======================
const createHotel = async (req, res) => {
  try {

    const { hotelName, location, description } = req.body;

    if (!hotelName || !location) {
      return res.status(400).json({
        message: "Hotel name & location required"
      });
    }

    // ✅ FIX IMAGE PATH (IMPORTANT)
    const images = req.files?.length
      ? req.files.map(file => `uploads/hotels/service/${file.filename}`)
      : [];

    // ✅ ONLY ONE HOTEL PER OWNER
    const existing = await Hotel.findOne({ ownerId: req.user.id });

    if (existing) {
      return res.status(400).json({
        message: "You already created a hotel"
      });
    }

    const hotel = new Hotel({
      ownerId: req.user.id,
      hotelName,
      location,
      description,
      images
    });

    const saved = await hotel.save();

    res.status(201).json(saved);

  } catch (error) {
    console.error("CREATE HOTEL ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// ======================
// GET MY HOTEL
// ======================
const getMyHotel = async (req, res) => {
  try {

    const hotel = await Hotel.findOne({ ownerId: req.user.id });

    res.json(hotel || null);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ======================
// GET ALL HOTELS
// ======================
const getHotels = async (req, res) => {
  try {

    const hotels = await Hotel.find()
      .sort({ createdAt: -1 });

    res.json(hotels);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ======================
// GET SINGLE HOTEL
// ======================
const getHotelById = async (req, res) => {
  try {

    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({
        message: "Hotel not found"
      });
    }

    res.json(hotel);

  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};


// ======================
// UPDATE HOTEL
// ======================
const updateHotel = async (req, res) => {
  try {

    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    if (hotel.ownerId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    hotel.hotelName = req.body.hotelName || hotel.hotelName;
    hotel.location = req.body.location || hotel.location;
    hotel.description = req.body.description || hotel.description;

    // ✅ FIX IMAGE PATH
    if (req.files?.length > 0) {
      hotel.images = req.files.map(file =>
        `uploads/hotels/service/${file.filename}`
      );
    }

    await hotel.save();

    res.json({
      message: "Hotel updated successfully",
      hotel
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ======================
// DELETE HOTEL
// ======================
const deleteHotel = async (req, res) => {
  try {

    await Hotel.findByIdAndDelete(req.params.id);

    res.json({ message: "Hotel deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createHotel,
  getMyHotel,
  getHotels,
  getHotelById,
  updateHotel,
  deleteHotel
};