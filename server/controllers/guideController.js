const Guide = require("../models/Guide");
const Booking = require("../models/Booking");


// ======================
// CREATE GUIDE PROFILE
// ======================
const createGuide = async (req, res) => {
  try {

    const {
      guideName,
      languages,
      experience,
      pricePerDay,
      location,
      description
    } = req.body;

    if (!guideName || !pricePerDay || !location) {
      return res.status(400).json({
        message: "Guide name, pricePerDay & location required"
      });
    }

    // ✅ FIXED IMAGE PATH (SAFE FIX 🔥)
    const images = req.files?.length
      ? req.files.map(file => {
          const fullPath = file.path.replace(/\\/g, "/");
          return fullPath.includes("uploads/")
            ? fullPath.split("uploads/")[1]
            : fullPath;
        })
      : [];

    // ✅ LANGUAGE PARSE
    let parsedLanguages = [];

    if (languages) {
      try {
        parsedLanguages =
          typeof languages === "string"
            ? JSON.parse(languages)
            : languages;
      } catch {
        parsedLanguages = [];
      }
    }

    const guide = new Guide({
      guideName,
      ownerId: req.user.id,
      languages: parsedLanguages,
      experience: Number(experience) || 0,
      pricePerDay: Number(pricePerDay),
      location,
      description,
      images
    });

    const savedGuide = await guide.save();

    res.status(201).json({
      message: "Guide profile created successfully",
      guide: savedGuide
    });

  } catch (error) {
    console.error("CREATE GUIDE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// ======================
// GET ALL GUIDES
// ======================
const getGuides = async (req, res) => {
  try {

    const guides = await Guide.find()
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 });

    res.json(guides);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ======================
// GET GUIDE BY ID
// ======================
const getGuideById = async (req, res) => {
  try {

    const guide = await Guide.findById(req.params.id)
      .populate("ownerId", "name email");

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    res.json(guide);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ======================
// GET MY GUIDE PROFILE
// ======================
const getMyGuideProfile = async (req, res) => {
  try {

    const guide = await Guide.findOne({
      ownerId: req.user.id
    });

    res.json(guide || null);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ======================
// GET GUIDE BOOKINGS
// ======================
const getGuideBookings = async (req, res) => {
  try {

    const guide = await Guide.findOne({
      ownerId: req.user.id
    });

    if (!guide) {
      return res.status(404).json({
        message: "Guide profile not found"
      });
    }

    const bookings = await Booking.find({
      serviceId: guide._id,
      serviceType: "tour_guide"
    })
      .populate("travelerId", "name email profileImage")
      .sort({ createdAt: -1 });

    res.json(bookings);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ======================
// UPDATE GUIDE
// ======================
const updateGuide = async (req, res) => {
  try {

    const guide = await Guide.findById(req.params.id);

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    if (guide.ownerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // ✅ BASIC FIELDS
    guide.guideName = req.body.guideName || guide.guideName;
    guide.location = req.body.location || guide.location;
    guide.description = req.body.description || guide.description;
    guide.availability = req.body.availability ?? guide.availability;

    guide.experience = req.body.experience
      ? Number(req.body.experience)
      : guide.experience;

    guide.pricePerDay = req.body.pricePerDay
      ? Number(req.body.pricePerDay)
      : guide.pricePerDay;

    // ✅ LANGUAGE FIX
    if (req.body.languages) {
      try {
        guide.languages =
          typeof req.body.languages === "string"
            ? JSON.parse(req.body.languages)
            : req.body.languages;
      } catch {
        guide.languages = [];
      }
    }

    // 🔥 FINAL IMAGE FIX (SAFE 🔥)
    if (req.files?.length > 0) {
      guide.images = req.files.map(file => {
        const fullPath = file.path.replace(/\\/g, "/");
        return fullPath.includes("uploads/")
          ? fullPath.split("uploads/")[1]
          : fullPath;
      });
    }

    const updatedGuide = await guide.save();

    res.json({
      message: "Guide updated successfully",
      guide: updatedGuide
    });

  } catch (error) {
    console.error("UPDATE GUIDE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};


// ======================
// DELETE GUIDE
// ======================
const deleteGuide = async (req, res) => {
  try {

    const guide = await Guide.findById(req.params.id);

    if (!guide) {
      return res.status(404).json({ message: "Guide not found" });
    }

    if (guide.ownerId.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await guide.deleteOne();

    res.json({ message: "Guide deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = {
  createGuide,
  getGuides,
  getGuideById,
  getMyGuideProfile,
  getGuideBookings,
  updateGuide,
  deleteGuide
};