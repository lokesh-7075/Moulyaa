const express = require("express");
const router = express.Router();

const {
  createEvent,
  getEvents,
  getEventById,
  getMyEvents,
  updateEvent,
  deleteEvent
} = require("../controllers/eventController");

const verifyToken = require("../middleware/verifyToken");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../config/multerConfig");


// CREATE EVENT
router.post(
  "/create",
  verifyToken,
  roleMiddleware("event_organizer"),
  upload.array("images", 5),
  createEvent
);


// GET ALL EVENTS
router.get("/", getEvents);


// GET MY EVENTS
router.get(
  "/my-events",
  verifyToken,
  roleMiddleware("event_organizer"),
  getMyEvents
);


// GET SINGLE EVENT
router.get("/:id", getEventById);


// UPDATE EVENT
router.put(
  "/update/:id",
  verifyToken,
  roleMiddleware("event_organizer"),
  upload.array("images", 5),
  updateEvent
);


// DELETE EVENT
router.delete(
  "/delete/:id",
  verifyToken,
  roleMiddleware("event_organizer"),
  deleteEvent
);


module.exports = router;