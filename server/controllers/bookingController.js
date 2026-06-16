const Booking = require("../models/Booking");

// 🔥 IMPORT ALL SERVICE MODELS
const Hotel = require("../models/Hotel");
const Vehicle = require("../models/Vehicle");
const Restaurant = require("../models/Restaurant");
const Guide = require("../models/Guide");
const Event = require("../models/Event");


// ==========================
// CREATE BOOKING
// ==========================
const createBooking = async (req, res) => {
  try {

    const {
      serviceId,
      serviceType,
      providerId,
      travelDate,
      numberOfPeople,
      totalAmount
    } = req.body;

    if (!serviceId || !serviceType || !providerId || !totalAmount) {
      return res.status(400).json({
        message: "Missing required booking fields"
      });
    }

    const booking = new Booking({
      travelerId: req.user.id,
      providerId,
      serviceId,
      serviceType,
      travelDate,
      numberOfPeople: numberOfPeople || 1,
      totalAmount,
      paymentStatus: "pending",
      bookingStatus: "pending"
    });

    const savedBooking = await booking.save();

    res.status(201).json({
      message: "Booking created. Proceed to payment",
      booking: savedBooking
    });

  } catch (error) {
    res.status(500).json({
      message: "Booking failed",
      error: error.message
    });
  }
};



// ==========================
// 🔥 HELPER: GET SERVICE DATA
// ==========================
const getServiceDetails = async (booking) => {

  let service = null;

  try {

    if (booking.serviceType === "hotel") {
      service = await Hotel.findById(booking.serviceId);
    }
    else if (booking.serviceType === "vehicle") {
      service = await Vehicle.findById(booking.serviceId);
    }
    else if (booking.serviceType === "restaurant") {
      service = await Restaurant.findById(booking.serviceId);
    }
    else if (booking.serviceType === "tour_guide") {
      service = await Guide.findById(booking.serviceId);
    }
    else if (booking.serviceType === "event") {
      service = await Event.findById(booking.serviceId);
    }

    return {
      serviceName:
        service?.hotelName ||
        service?.vehicleName ||
        service?.restaurantName ||
        service?.guideName ||
        service?.eventName ||
        "Service",

      serviceImage: service?.images?.[0] || null
    };

  } catch (err) {
    return {
      serviceName: "Service",
      serviceImage: null
    };
  }
};



// ==========================
// GET USER BOOKINGS (FIXED)
// ==========================
const getUserBookings = async (req, res) => {
  try {

    const bookings = await Booking.find({
      travelerId: req.user.id
    })
      .populate("providerId", "name email")
      .sort({ createdAt: -1 });

    // 🔥 ADD SERVICE DETAILS
    const enriched = await Promise.all(
      bookings.map(async (b) => {

        const serviceData = await getServiceDetails(b);

        return {
          ...b._doc,
          ...serviceData
        };
      })
    );

    res.json(enriched);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching user bookings",
      error: error.message
    });
  }
};



// ==========================
// GET PROVIDER BOOKINGS
// ==========================
const getProviderBookings = async (req, res) => {
  try {

    const bookings = await Booking.find({
      providerId: req.user.id
    })
      .populate("travelerId", "name email")
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(
      bookings.map(async (b) => {

        const serviceData = await getServiceDetails(b);

        return {
          ...b._doc,
          ...serviceData
        };
      })
    );

    res.json(enriched);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching provider bookings",
      error: error.message
    });
  }
};



// ==========================
// GET ALL BOOKINGS (ADMIN)
// ==========================
const getAllBookings = async (req, res) => {
  try {

    const bookings = await Booking.find()
      .populate("travelerId", "name email")
      .populate("providerId", "name email")
      .sort({ createdAt: -1 });

    const enriched = await Promise.all(
      bookings.map(async (b) => {

        const serviceData = await getServiceDetails(b);

        return {
          ...b._doc,
          ...serviceData
        };
      })
    );

    res.json(enriched);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching bookings",
      error: error.message
    });
  }
};



// ==========================
// CANCEL BOOKING
// ==========================
const cancelBooking = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    if (booking.travelerId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    booking.bookingStatus = "cancelled";

    await booking.save();

    res.json({
      message: "Booking cancelled",
      booking
    });

  } catch (error) {
    res.status(500).json({
      message: "Error cancelling booking",
      error: error.message
    });
  }
};



// ==========================
// GET BOOKING BY ID (FIXED)
// ==========================
const getBookingById = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    const serviceData = await getServiceDetails(booking);

    res.json({
      ...booking._doc,
      ...serviceData
    });

  } catch (err) {
    res.status(500).json({
      message: "Error fetching booking"
    });
  }
};



module.exports = {
  createBooking,
  getUserBookings,
  getProviderBookings,
  getAllBookings,
  cancelBooking,
  getBookingById
};