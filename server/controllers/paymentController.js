const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const calculateRevenue = require("../utils/revenueCalculator");


// =======================
// CREATE PAYMENT INTENT (STEP 1)
// =======================
const createPaymentIntent = async (req, res) => {
  try {

    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({
        message: "Amount required"
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // ₹ → paise
      currency: "inr",
      automatic_payment_methods: { enabled: true }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });

  } catch (error) {
    res.status(500).json({
      message: "Failed to create payment intent",
      error: error.message
    });
  }
};



// =======================
// CONFIRM PAYMENT (STEP 2 AFTER CARD SUCCESS)
// =======================
const confirmPayment = async (req, res) => {

  try {

    const { bookingId, amount, paymentIntentId } = req.body;

    if (!bookingId || !amount || !paymentIntentId) {
      return res.status(400).json({
        message: "Missing payment data"
      });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    // ✅ SECURITY CHECK
    if (booking.totalAmount !== amount) {
      return res.status(400).json({
        message: "Amount mismatch"
      });
    }

    // 🔐 VERIFY PAYMENT WITH STRIPE
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== "succeeded") {
      return res.status(400).json({
        message: "Payment not completed"
      });
    }

    // 💰 CALCULATE REVENUE
    const revenue = calculateRevenue(amount);

    const payment = new Payment({
      bookingId,
      travelerId: req.user.id,
      providerId: booking.providerId,
      amount,
      providerShare: revenue.providerShare,
      platformShare: revenue.platformShare,
      paymentMethod: "card",
      paymentStatus: "success",
      transactionId: paymentIntent.id,
      paidAt: new Date()
    });

    const savedPayment = await payment.save();

    // ✅ UPDATE BOOKING
    await Booking.findByIdAndUpdate(bookingId, {
      paymentStatus: "paid",
      bookingStatus: "confirmed"
    });

    res.status(201).json({
      message: "Payment successful",
      payment: savedPayment
    });

  } catch (error) {

    res.status(500).json({
      message: "Payment failed",
      error: error.message
    });

  }

};



// =======================
// PROVIDER EARNINGS
// =======================
const getProviderEarnings = async (req, res) => {

  try {

    const payments = await Payment.find({
      providerId: req.user.id
    });

    let total = 0;

    payments.forEach(p => {
      total += p.providerShare;
    });

    res.json({
      totalEarnings: total,
      payments
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching earnings",
      error: error.message
    });

  }

};



// =======================
// GET USER PAYMENTS
// =======================
const getUserPayments = async (req, res) => {
  try {

    const payments = await Payment.find({
      travelerId: req.user.id
    });

    res.json(payments);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching payments",
      error: error.message
    });
  }
};



// =======================
// GET ALL PAYMENTS (ADMIN)
// =======================
const getAllPayments = async (req, res) => {
  try {

    const payments = await Payment.find();

    res.json(payments);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching payments",
      error: error.message
    });
  }
};



// =======================
// ADMIN BALANCE SUMMARY
// =======================
const getBalanceSummary = async (req, res) => {
  try {

    const payments = await Payment.find();

    let totalPayments = 0;
    let providerEarnings = 0;
    let platformRevenue = 0;

    payments.forEach(p => {
      totalPayments += p.amount || 0;
      providerEarnings += p.providerShare || 0;
      platformRevenue += p.platformShare || 0;
    });

    res.json({
      totalPayments,
      providerEarnings,
      platformRevenue
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching balance",
      error: error.message
    });
  }
};


module.exports = {
  createPaymentIntent,  // 🔥 NEW
  confirmPayment,       // 🔥 NEW
  getUserPayments,
  getProviderEarnings,
  getAllPayments,
  getBalanceSummary
};