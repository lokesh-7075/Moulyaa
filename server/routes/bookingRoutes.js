const express = require("express");
const router = express.Router();

const {
  createBooking,
  getUserBookings,
  getProviderBookings,
  getAllBookings,
  getBookingById,
  cancelBooking
} = require("../controllers/bookingController");

const verifyToken = require("../middleware/verifyToken");
const roleMiddleware = require("../middleware/roleMiddleware");

router.post("/create", verifyToken, createBooking);

router.get("/my-bookings", verifyToken, getUserBookings);

router.get(
  "/provider",
  verifyToken,
  roleMiddleware("hotel_owner","vehicle_owner","restaurant_owner","tour_guide","event_organizer"), // ✅ FIXED
  getProviderBookings
);

router.get(
  "/all",
  verifyToken,
  roleMiddleware("admin"),
  getAllBookings
);

router.get("/:id", verifyToken, getBookingById);

router.put("/cancel/:id", verifyToken, cancelBooking);

module.exports = router;