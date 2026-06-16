const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
{
  travelerId: {
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
    enum: [
      "hotel",
      "vehicle",
      "restaurant",
      "tour_guide",
      "event"
    ],
    required: true
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },

  comment: {
    type: String,
    trim: true
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);