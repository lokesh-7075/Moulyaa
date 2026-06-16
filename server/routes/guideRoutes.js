const express = require("express");
const router = express.Router();

const {
  createGuide,
  getGuides,
  getGuideById,
  getMyGuideProfile,
  getGuideBookings,
  updateGuide,
  deleteGuide
} = require("../controllers/guideController");

const verifyToken = require("../middleware/verifyToken");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../config/multerConfig");


// CREATE GUIDE
router.post(
  "/create",
  verifyToken,
  roleMiddleware("tour_guide"),
  upload.array("serviceImages",5),
  createGuide
);


// GET MY GUIDE PROFILE
router.get(
  "/my-profile",
  verifyToken,
  roleMiddleware("tour_guide"),
  getMyGuideProfile
);


// GET GUIDE BOOKINGS
router.get(
  "/my-bookings",
  verifyToken,
  roleMiddleware("tour_guide"),
  getGuideBookings
);


// GET ALL GUIDES
router.get("/", getGuides);


// GET SINGLE GUIDE
router.get("/:id", getGuideById);


// UPDATE GUIDE
router.put(
  "/update/:id",
  verifyToken,
  roleMiddleware("tour_guide"),
  upload.array("serviceImages",5),
  updateGuide
);


// DELETE GUIDE
router.delete(
  "/delete/:id",
  verifyToken,
  roleMiddleware("tour_guide"),
  deleteGuide
);

module.exports = router;