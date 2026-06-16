const Vehicle = require("../models/Vehicle");
const path = require("path");


// ==========================
// CREATE VEHICLE
// ==========================

const createVehicle = async (req, res) => {

  try {

    const {
      vehicleName,
      type,
      pricePerDay,
      location,
      availability
    } = req.body;

    // Save images correctly
    const images = req.files
      ? req.files.map(file =>
          `uploads/vehicles/cars/${path.basename(file.path)}`
        )
      : [];

    const vehicle = new Vehicle({
      vehicleName,
      ownerId: req.user.id,
      type,
      pricePerDay,
      location,
      availability,
      images
    });

    const savedVehicle = await vehicle.save();

    res.status(201).json({
      message: "Vehicle added successfully",
      vehicle: savedVehicle
    });

  } catch (error) {

    res.status(500).json({
      message: "Error creating vehicle",
      error: error.message
    });

  }

};



// ==========================
// GET ALL VEHICLES
// ==========================

const getVehicles = async (req, res) => {

  try {

    const vehicles = await Vehicle.find()
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    res.json(vehicles);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching vehicles",
      error: error.message
    });

  }

};



// ==========================
// GET VEHICLE BY ID
// ==========================

const getVehicleById = async (req, res) => {

  try {

    const vehicle = await Vehicle.findById(req.params.id)
      .populate("ownerId", "name email");

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    res.json(vehicle);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching vehicle",
      error: error.message
    });

  }

};



// ==========================
// GET MY VEHICLES
// ==========================

const getMyVehicles = async (req, res) => {

  try {

    const vehicles = await Vehicle.find({
      ownerId: req.user.id
    }).sort({ createdAt: -1 });

    res.json(vehicles);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching your vehicles",
      error: error.message
    });

  }

};



// ==========================
// UPDATE VEHICLE
// ==========================

const updateVehicle = async (req, res) => {

  try {

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    if (vehicle.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    vehicle.vehicleName = req.body.vehicleName || vehicle.vehicleName;
    vehicle.type = req.body.type || vehicle.type;
    vehicle.pricePerDay = req.body.pricePerDay || vehicle.pricePerDay;
    vehicle.location = req.body.location || vehicle.location;
    vehicle.availability = req.body.availability ?? vehicle.availability;

    // Update images if provided
    if (req.files && req.files.length > 0) {

      vehicle.images = req.files.map(file =>
        `uploads/vehicles/cars/${path.basename(file.path)}`
      );

    }

    const updatedVehicle = await vehicle.save();

    res.json({
      message: "Vehicle updated successfully",
      vehicle: updatedVehicle
    });

  } catch (error) {

    res.status(500).json({
      message: "Error updating vehicle",
      error: error.message
    });

  }

};



// ==========================
// DELETE VEHICLE
// ==========================

const deleteVehicle = async (req, res) => {

  try {

    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found"
      });
    }

    if (vehicle.ownerId.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Unauthorized"
      });
    }

    await vehicle.deleteOne();

    res.json({
      message: "Vehicle deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Error deleting vehicle",
      error: error.message
    });

  }

};



module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  getMyVehicles,
  updateVehicle,
  deleteVehicle
};