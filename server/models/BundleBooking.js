const mongoose = require("mongoose");

const bundleItemSchema = new mongoose.Schema({
  serviceType: {
    type: String,
    enum: ["hotel", "vehicle", "tour_guide", "restaurant", "event"],
    required: true
  },
  serviceId: {
    type: String,
    default: ""
  },
  serviceName: {
    type: String,
    required: true
  },
  providerEmail: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    required: true
  },
  durationUnits: {
    type: Number,
    default: 1 // days / nights / seats
  },
  itemTotal: {
    type: Number,
    required: true
  },
  details: {
    type: String,
    default: ""
  },
  status: {
    type: String,
    enum: ["confirmed", "pending", "cancelled"],
    default: "confirmed"
  }
});

const bundleBookingSchema = new mongoose.Schema({
  travelerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  travelerName: {
    type: String,
    default: "Guest Traveler"
  },
  travelerEmail: {
    type: String,
    default: ""
  },
  travelerPhone: {
    type: String,
    default: ""
  },
  bundleTitle: {
    type: String,
    required: true
  },
  destination: {
    type: String,
    required: true
  },
  travelDates: {
    startDate: Date,
    endDate: Date,
    totalDays: {
      type: Number,
      default: 3
    }
  },
  travelersCount: {
    type: Number,
    default: 2
  },
  services: [bundleItemSchema],
  subtotal: {
    type: Number,
    required: true
  },
  bundleDiscountPercentage: {
    type: Number,
    default: 10 // 10% AI Multi-Booking Discount
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  gstTaxes: {
    type: Number,
    default: 0
  },
  finalTotalAmount: {
    type: Number,
    required: true
  },
  aiEngineUsed: {
    type: String,
    default: "Intelligent Neural AI"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "paid"
  },
  bookingStatus: {
    type: String,
    enum: ["confirmed", "in_progress", "completed", "cancelled"],
    default: "confirmed"
  },
  transactionReference: {
    type: String,
    default: () => "MLY-BND-" + Math.floor(100000 + Math.random() * 900000)
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("BundleBooking", bundleBookingSchema);
