const express = require("express");
const router = express.Router();

const {
  createRoom,
  getRoomsByHotel,
  deleteRoom
} = require("../controllers/roomController");

const verifyToken = require("../middleware/verifyToken");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../config/multerConfig");


// ======================
// CREATE ROOM
// ======================
router.post(
  "/create",
  verifyToken,
  roleMiddleware("hotel_owner"), // only hotel owners
  upload.array("roomImages", 5), // 🔥 IMPORTANT (matches multer)
  createRoom
);


// ======================
// GET ROOMS BY HOTEL
// ======================
router.get(
  "/hotel/:hotelId",
  getRoomsByHotel
);


// ======================
// DELETE ROOM
// ======================
router.delete(
  "/delete/:id",
  verifyToken,
  roleMiddleware("hotel_owner"),
  deleteRoom
);


module.exports = router;