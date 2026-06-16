const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },

  travelerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  providerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  currency: {
    type: String,
    default: "INR"
  },

  providerShare: {
    type: Number,
    required: true   // ✅ now required (always calculated)
  },

  platformShare: {
    type: Number,
    required: true   // ✅ now required
  },

  paymentMethod: {
    type: String,
    enum: ["card", "upi", "netbanking", "wallet", "cash"],
    default: "upi"
  },

  paymentGateway: {
    type: String,
    enum: ["razorpay", "stripe", "paypal", "manual"],
    default: "manual"
  },

  transactionId: {
    type: String,
    required: true   // ✅ important for tracking
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "success", "failed", "refunded"],
    default: "pending"
  },

  paidAt: {
    type: Date,
    default: Date.now
  }

}, { timestamps: true });


// ✅ Performance Indexes
paymentSchema.index({ travelerId: 1 });
paymentSchema.index({ providerId: 1 });
paymentSchema.index({ bookingId: 1 });

module.exports = mongoose.model("Payment", paymentSchema);