const express = require("express");

const {
  createReview,
  getServiceReviews,
  deleteReview
} = require("../controllers/reviewController");

const verifyToken = require("../middleware/verifyToken");

const router = express.Router();


// create review
router.post("/create", verifyToken, createReview);

// get reviews for service
router.get("/service/:id", getServiceReviews);

// delete review
router.delete("/delete/:id", verifyToken, deleteReview);

module.exports = router;