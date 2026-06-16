const express = require("express");

const {
  createFood,
  getMyFoods,
  getRestaurantFoods,
  updateFood,
  deleteFood
} = require("../controllers/foodController");

const verifyToken = require("../middleware/verifyToken");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../config/multerConfig");

const router = express.Router();
router.get("/test",(req,res)=>{
  res.send("Food route working");
});

// ==========================
// ADD FOOD
// ==========================

router.post(
  "/create",
  verifyToken,
  roleMiddleware("restaurant_owner"),
  upload.array("food",5),
  createFood
);


// ==========================
// GET OWNER FOODS
// ==========================

router.get(
  "/my-foods",
  verifyToken,
  roleMiddleware("restaurant_owner"),
  getMyFoods
);


// ==========================
// GET FOODS OF RESTAURANT (Traveler)
// ==========================

router.get(
  "/restaurant/:restaurantId",
  getRestaurantFoods
);


// ==========================
// UPDATE FOOD
// ==========================

router.put(
  "/update/:id",
  verifyToken,
  roleMiddleware("restaurant_owner"),
  upload.array("food",5),
  updateFood
);


// ==========================
// DELETE FOOD
// ==========================

router.delete(
  "/delete/:id",
  verifyToken,
  roleMiddleware("restaurant_owner"),
  deleteFood
);


module.exports = router;