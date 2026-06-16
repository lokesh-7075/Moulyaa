const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({

  eventName: {
    type: String,
    required: true
  },

  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  location: {
    type: String,
    required: true
  },

  eventDate: {
    type: Date,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  totalTickets: {
    type: Number,
    required: true
  },

  availableTickets: {
    type: Number,
    required: true
  },

  description: {
    type: String
  },

  images: [
    {
      type: String
    }
  ],

  category: {
    type: String,
    enum: ["festival", "adventure", "music", "culture", "tour"]
  },

  status: {
    type: String,
    enum: ["active", "cancelled", "completed"],
    default: "active"
  }

}, { timestamps: true });

module.exports = mongoose.model("Event", eventSchema);