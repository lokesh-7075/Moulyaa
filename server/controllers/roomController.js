const Room = require("../models/Room");

// ======================
// CREATE ROOM
// ======================
const createRoom = async (req, res) => {
  try {

    const { hotelId, title, price, capacity, bedType } = req.body;

    // ✅ VALIDATION
    if (!hotelId || !title || !price) {
      return res.status(400).json({
        message: "hotelId, title, price required"
      });
    }

    // ✅ FIX IMAGE PATH
    const roomImages = req.files?.length
      ? req.files.map(file =>
          `uploads/hotels/rooms/${file.filename}`
        )
      : [];

    const room = new Room({
      hotelId,
      ownerId: req.user.id,
      title,
      price,
      capacity,
      bedType,
      roomImages
    });

    await room.save();

    res.status(201).json({
      message: "Room created successfully",
      room
    });

  } catch (err) {

    console.error("CREATE ROOM ERROR:", err);

    res.status(500).json({
      message: err.message
    });

  }
};


// ======================
// GET ROOMS BY HOTEL
// ======================
const getRoomsByHotel = async (req, res) => {
  try {

    const rooms = await Room.find({
      hotelId: req.params.hotelId
    });

    res.json(rooms);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ======================
// DELETE ROOM
// ======================
const deleteRoom = async (req, res) => {
  try {

    await Room.findByIdAndDelete(req.params.id);

    res.json({ message: "Room deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
  createRoom,
  getRoomsByHotel,
  deleteRoom
};