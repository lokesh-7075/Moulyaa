const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

  travelerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  providerId: {   // ✅ ADDED
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },

  serviceType: {
    type: String,
    enum: ["hotel","vehicle","restaurant","tour_guide","event"],
    required: true
  },

  bookingDate: {
    type: Date,
    default: Date.now
  },

  travelDate: Date,

  numberOfPeople: {
    type: Number,
    default: 1
  },

  totalAmount: {
    type: Number,
    required: true
  },

  paymentStatus: {
    type: String,
    enum: ["pending","paid","failed"],
    default: "pending"
  },

  bookingStatus: {
    type: String,
    enum: ["pending","confirmed","cancelled"],
    default: "pending"
  }

},{timestamps:true});

// ✅ Indexes (performance)
bookingSchema.index({ travelerId: 1 });
bookingSchema.index({ providerId: 1 });
bookingSchema.index({ serviceId: 1 });

module.exports = mongoose.model("Booking", bookingSchema);