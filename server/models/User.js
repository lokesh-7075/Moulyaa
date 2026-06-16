const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String
    },

    profileImage: {
        type: String,
        default: ""
    },

    role: {
        type: String,
        enum: [
            "traveler",
            "hotel_owner",
            "vehicle_owner",
            "restaurant_owner",
            "tour_guide",
            "event_organizer",
            "employee",
            "admin"
        ],
        default: "traveler"
    },

    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },

    membership: {
        type: Boolean,
        default: false
    },

    isBlocked: {
        type: Boolean,
        default: false
    }

},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);