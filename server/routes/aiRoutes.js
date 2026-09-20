const express = require("express");
const router = express.Router();
const {
  planRAGTripItinerary,
  snapAndExplore,
  chatConcierge,
  summarizeReviews,
  getAvailableModels,
  seedDynamoDB
} = require("../controllers/aiController");

// 🌟 1. Pan-India RAG AI Trip Itinerary & Package Bundler (DynamoDB + Bedrock & Ollama)
router.post("/plan-trip", planRAGTripItinerary);

// 📸 2. Multimodal Snap & Explore (Landmarks & Menus)
router.post("/snap-explore", snapAndExplore);

// 💬 3. 24/7 AI Travel Concierge Chatbot (Multi-Model)
router.post("/chat", chatConcierge);

// ⭐ 4. AI Trust & Review Sentiment Summary
router.get("/reviews-summary/:serviceType/:serviceId", summarizeReviews);

// 📡 5. AI Model Catalog & Status
router.get("/models", getAvailableModels);

// ⚡ 6. Seed Pan-India DynamoDB Storage
router.post("/seed-dynamodb", seedDynamoDB);

module.exports = router;
