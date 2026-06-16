const express = require("express");
const router = express.Router();

const {
  createPaymentIntent,
  confirmPayment,
  getUserPayments,
  getProviderEarnings,
  getAllPayments,
  getBalanceSummary
} = require("../controllers/paymentController");

const verifyToken = require("../middleware/verifyToken");
const roleMiddleware = require("../middleware/roleMiddleware");


// =======================
// CREATE PAYMENT INTENT (STEP 1)
// =======================
router.post(
  "/create-intent",
  verifyToken,
  createPaymentIntent
);


// =======================
// CONFIRM PAYMENT (STEP 2)
// =======================
router.post(
  "/confirm",
  verifyToken,
  confirmPayment
);


// =======================
// USER PAYMENTS
// =======================
router.get(
  "/my-payments",
  verifyToken,
  getUserPayments
);


// =======================
// PROVIDER EARNINGS
// =======================
router.get(
  "/provider-earnings",
  verifyToken,
  roleMiddleware(
    "hotel_owner",
    "vehicle_owner",
    "restaurant_owner",
    "guide",
    "event_organizer"
  ),
  getProviderEarnings
);


// =======================
// ADMIN BALANCE SUMMARY
// =======================
router.get(
  "/balance",
  verifyToken,
  roleMiddleware("admin"),
  getBalanceSummary
);


// =======================
// ADMIN VIEW ALL PAYMENTS
// =======================
router.get(
  "/all",
  verifyToken,
  roleMiddleware("admin"),
  getAllPayments
);


module.exports = router;