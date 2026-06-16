const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  providerDashboard
} = require("../controllers/providerController");


// ======================================
// ALL PROVIDER DASHBOARDS
// ======================================

router.get(
  "/dashboard",
  verifyToken,
  roleMiddleware(
    "hotel_owner",
    "vehicle_owner",
    "restaurant_owner",
    "tour_guide",
    "event_organizer"
  ),
  providerDashboard
);


module.exports = router;