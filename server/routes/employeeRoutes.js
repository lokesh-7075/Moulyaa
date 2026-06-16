const express = require("express");

const employeeController = require("../controllers/employeeController");

const verifyToken = require("../middleware/verifyToken");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================
// GET BOOKINGS
// ==========================

router.get(
  "/bookings",
  verifyToken,
  roleMiddleware("employee", "admin"),
  employeeController.getEmployeeBookings
);


// ==========================
// CONFIRM BOOKING
// ==========================

router.put(
  "/confirm-booking/:id",
  verifyToken,
  roleMiddleware("employee", "admin"),
  employeeController.confirmBooking
);


// ==========================
// REJECT BOOKING
// ==========================

router.put(
  "/reject-booking/:id",
  verifyToken,
  roleMiddleware("employee", "admin"),
  employeeController.rejectBooking
);


// ==========================
// ASSIGN GUIDE
// ==========================

router.put(
  "/assign-guide/:id",
  verifyToken,
  roleMiddleware("employee", "admin"),
  employeeController.assignGuide
);


// ==========================
// GET GUIDES
// ==========================

router.get(
  "/guides",
  verifyToken,
  roleMiddleware("employee", "admin"),
  employeeController.getGuides
);


module.exports = router;