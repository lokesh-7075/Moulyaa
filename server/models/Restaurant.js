const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
{
  restaurantName: {
    type: String,
    required: true
  },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true   // one restaurant per owner
  },

  location: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  images: [
    {
      type: String
    }
  ]

},
{
  timestamps: true
}
);

module.exports = mongoose.model("Restaurant", restaurantSchema);