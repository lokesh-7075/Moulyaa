const mongoose = require("mongoose");

const guidePostSchema = new mongoose.Schema({
  guideId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guide",
    required: true
  },

  title: {
    type: String
  },

  description: {
    type: String
  },

  images: [
    {
      type: String
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model("GuidePost", guidePostSchema);