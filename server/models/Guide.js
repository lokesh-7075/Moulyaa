const mongoose = require("mongoose");

const guideSchema = new mongoose.Schema(
{
    guideName: {
        type: String,
        required: true
    },

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    languages: {
        type: [String],   // example: ["English", "Hindi", "French"]
        required: true
    },

    experience: {
        type: Number, // years
        default: 0
    },

    pricePerDay: {
        type: Number,
        required: true
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
    ],

    availability: {
        type: Boolean,
        default: true
    },

    rating: {
        type: Number,
        default: 0
    }

},
{
    timestamps: true
}
);

module.exports = mongoose.model("Guide", guideSchema);