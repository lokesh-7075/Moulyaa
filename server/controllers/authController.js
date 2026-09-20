const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// =======================
// REGISTER USER
// =======================

const registerUser = async (req, res) => {
  try {

    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone || !role) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let profileImage = "";
    let serviceImages = [];


    // ======================
    // PROFILE IMAGE ✅ FIXED
    // ======================

    if (req.files?.profileImage) {

      profileImage = req.files.profileImage[0].path
        .replace(/\\/g, "/")
        .split("uploads/")[1];   // 🔥 KEY FIX

    }


    // ======================
    // SERVICE IMAGES (UNCHANGED SAFE)
    // ======================

    if (req.files?.serviceImages) {

      serviceImages = req.files.serviceImages.map(file => {

        return file.path
          .replace(/\\/g, "/")
          .split("uploads/")[1];   // 🔥 SAME FIX

      });

    }


    // ======================
    // PROVIDER ROLES
    // ======================

    const providerRoles = [
      "hotel_owner",
      "vehicle_owner",
      "restaurant_owner",
      "tour_guide",
      "event_organizer"
    ];

    if (providerRoles.includes(role)) {
      if (serviceImages.length > 5) {
        return res.status(400).json({
          message: "Maximum 5 service images allowed"
        });
      }
    }


    // ======================
    // APPROVAL LOGIC
    // ======================

    let status = "pending";
    let membership = false;

    if (role === "traveler") {
      status = "approved";
      membership = true;
    }

    if (role === "admin") {

      const existingAdmin = await User.findOne({
        role: "admin",
        status: "approved"
      });

      if (!existingAdmin) {
        status = "approved";
        membership = true;
      }

    }


    // ======================
    // CREATE USER
    // ======================

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      profileImage,
      serviceImages,
      status,
      membership
    });

    const savedUser = await newUser.save();

    const userData = savedUser.toObject();
    delete userData.password;

    res.status(201).json({
      message: "Registration successful",
      user: userData
    });

  } catch (error) {

    res.status(500).json({
      message: "Registration failed",
      error: error.message
    });

  }
};



// =======================
// LOGIN USER (UNCHANGED)
// =======================

const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid email or password"
      });
    }

    if (user.status !== "approved") {
      return res.status(403).json({
        message: "Account pending admin approval"
      });
    }

    if (user.isBlocked) {
      return res.status(403).json({
        message: "Your account has been blocked by admin"
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userData = user.toObject();
    delete userData.password;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userData
    });

  } catch (error) {

    res.status(500).json({
      message: "Login failed",
      error: error.message
    });

  }
};



// =======================
// GET PROFILE (UNCHANGED)
// =======================

const getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(user);

  } catch (error) {

    res.status(500).json({
      message: "Error fetching profile",
      error: error.message
    });

  }
};



// =======================
// UPDATE PROFILE ✅ FIXED
// =======================

const updateProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;

    if (req.file) {

      user.profileImage = req.file.path
        .replace(/\\/g, "/")
        .split("uploads/")[1];   // 🔥 FIX

    }

    const updatedUser = await user.save();

    const userData = updatedUser.toObject();
    delete userData.password;

    res.json({
      message: "Profile updated",
      user: userData
    });

  } catch (error) {

    res.status(500).json({
      message: "Profile update failed",
      error: error.message
    });

  }
};



// =======================
// DELETE ACCOUNT (UNCHANGED)
// =======================

const deleteAccount = async (req, res) => {
  try {

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    await user.deleteOne();

    res.json({
      message: "Account deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Account deletion failed",
      error: error.message
    });

  }
};



// =======================
// EXPORT
// =======================

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  deleteAccount
};