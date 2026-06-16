const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
{
    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    phone: {
        type: String
    },

    role: {
        type: String,
        enum: ["manager", "support", "guide_manager"],
        default: "support"
    },

    department: {
        type: String
    },

    profileImage: {
        type: String
    },

    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    },

    assignedBookings: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Booking"
        }
    ]

},
{
    timestamps: true
}
);

module.exports = mongoose.model("Employee", employeeSchema);