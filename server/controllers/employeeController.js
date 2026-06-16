const Booking = require("../models/Booking");
const User = require("../models/User");


// ==========================
// GET ALL BOOKINGS (EMPLOYEE)
// ==========================

const getEmployeeBookings = async (req, res) => {

    try {

        const bookings = await Booking.find()
            .populate("travelerId", "name email")
            .sort({ createdAt: -1 });

        res.json(bookings);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching bookings",
            error: error.message
        });

    }

};



// ==========================
// CONFIRM BOOKING
// ==========================

const confirmBooking = async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        booking.bookingStatus = "confirmed";

        await booking.save();

        res.json({
            message: "Booking confirmed successfully",
            booking
        });

    } catch (error) {

        res.status(500).json({
            message: "Error confirming booking",
            error: error.message
        });

    }

};



// ==========================
// REJECT BOOKING
// ==========================

const rejectBooking = async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        booking.bookingStatus = "cancelled";

        await booking.save();

        res.json({
            message: "Booking rejected",
            booking
        });

    } catch (error) {

        res.status(500).json({
            message: "Error rejecting booking",
            error: error.message
        });

    }

};



// ==========================
// ASSIGN TOUR GUIDE
// ==========================

const assignGuide = async (req, res) => {

    try {

        const { guideId } = req.body;

        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const guide = await User.findById(guideId);

        if (!guide || guide.role !== "tour_guide") {
            return res.status(400).json({
                message: "Invalid guide"
            });
        }

        booking.guideId = guideId;

        await booking.save();

        res.json({
            message: "Guide assigned successfully",
            booking
        });

    } catch (error) {

        res.status(500).json({
            message: "Error assigning guide",
            error: error.message
        });

    }

};



// ==========================
// GET AVAILABLE GUIDES
// ==========================

const getGuides = async (req, res) => {

    try {

        const guides = await User.find({
            role: "tour_guide",
            status: "approved"
        }).select("name email");

        res.json(guides);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching guides",
            error: error.message
        });

    }

};



module.exports = {
    getEmployeeBookings,
    confirmBooking,
    rejectBooking,
    assignGuide,
    getGuides
};