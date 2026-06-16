const express = require("express");

const {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  getMyRestaurant,
  updateRestaurant,
  deleteRestaurant
} = require("../controllers/restaurantController");

const verifyToken = require("../middleware/verifyToken");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../config/multerConfig");

const router = express.Router();


// ==========================
// CREATE RESTAURANT
// ==========================

router.post(
  "/create",
  verifyToken,
  roleMiddleware("restaurant_owner"),
  upload.array("images",5), // service images
  createRestaurant
);


// ==========================
// GET ALL RESTAURANTS (Traveler)
// ==========================

router.get("/", getRestaurants);


// ==========================
// GET MY RESTAURANT (Owner)
// ==========================

router.get(
  "/my-restaurant",
  verifyToken,
  roleMiddleware("restaurant_owner"),
  getMyRestaurant
);


// ==========================
// UPDATE RESTAURANT
// ==========================

router.put(
  "/update",
  verifyToken,
  roleMiddleware("restaurant_owner"),
  upload.array("images",5),
  updateRestaurant
);


// ==========================
// DELETE RESTAURANT
// ==========================

router.delete(
  "/delete",
  verifyToken,
  roleMiddleware("restaurant_owner"),
  deleteRestaurant
);


// ==========================
// GET SINGLE RESTAURANT
// ==========================

router.get("/:id", getRestaurantById);


module.exports = router;