const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
{
    vehicleName: {
        type: String,
        required: true
    },

    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    type: {
        type: String,
        enum: ["car", "bike", "bus", "van", "jeep"],
        required: true
    },

    pricePerDay: {
        type: Number,
        required: true
    },

    location: {
        type: String,
        required: true
    },

    availability: {
        type: Boolean,
        default: true
    },

    description: {
        type: String
    },

    images: [
        {
            type: String
        }
    ],

    rating: {
        type: Number,
        default: 0
    }

},
{
    timestamps: true
}
);

module.exports = mongoose.model("Vehicle", vehicleSchema);