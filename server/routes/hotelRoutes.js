const express = require("express");
const router = express.Router();

const {
  createHotel,
  getHotels,
  getMyHotel,
  getHotelById,
  updateHotel,
  deleteHotel
} = require("../controllers/hotelController");

const verifyToken = require("../middleware/verifyToken");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../config/multerConfig");


// ======================
// CREATE HOTEL
// ======================
router.post(
  "/create",
  verifyToken,
  roleMiddleware("hotel_owner"),
  upload.array("images", 5),
  createHotel
);

// ======================
// GET ALL HOTELS
// ======================
router.get("/", getHotels);

// ======================
// GET MY HOTEL
// ======================
router.get("/my-hotel", verifyToken, getMyHotel);

// ======================
// GET SINGLE HOTEL
// ======================
router.get("/:id", getHotelById);

// ======================
// UPDATE HOTEL
// ======================
router.put(
  "/update/:id",
  verifyToken,
  roleMiddleware("hotel_owner"),
  upload.array("images", 5),
  updateHotel
);

// ======================
// DELETE HOTEL
// ======================
router.delete(
  "/delete/:id",
  verifyToken,
  roleMiddleware("hotel_owner"),
  deleteHotel
);

module.exports = router;