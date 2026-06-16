const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({

  hotelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
    required: true
  },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  title: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  capacity: Number,

  bedType: String,

  roomImages: [String],

  available: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);