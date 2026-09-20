const express = require("express");
const router = express.Router();
const {
  recommendAIBundles,
  createBundleBooking,
  getMyBundleBookings,
  getBundleById
} = require("../controllers/bundleController");

// 🌟 1. AI Bundle Recommendations (Bedrock & Ollama RAG over DynamoDB)
router.post("/recommend", recommendAIBundles);

// ⚡ 2. 1-Click Multi-Service Booking Creation & Payment
router.post("/create", createBundleBooking);

// 📜 3. Traveler's Multi-Bookings History
router.get("/my-bundles", getMyBundleBookings);

// 🎫 4. Specific Bundle Booking Voucher & Receipt
router.get("/:id", getBundleById);

module.exports = router;
