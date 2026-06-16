const User = require("../models/User");
const Booking = require("../models/Booking");
const Payment = require("../models/Payment");


// ==========================
// HELPER: FORMAT IMAGE PATH
// ==========================
const formatImagePath = (filePath) => {

  if (!filePath) return "";

  const normalized = filePath.replace(/\\/g, "/");
  const index = normalized.indexOf("uploads/");

  return index !== -1 ? normalized.substring(index) : normalized;
};


// ==========================
// HELPER: FORMAT USER OBJECT
// ==========================
const formatUser = (user) => {

  const formatted = { ...user };

  formatted.profileImage = formatImagePath(formatted.profileImage);

  if (formatted.serviceImages && formatted.serviceImages.length > 0) {
    formatted.serviceImages = formatted.serviceImages.map(img =>
      formatImagePath(img)
    );
  }

  return formatted;
};


// ==========================
// PROVIDER ROLES
// ==========================
const providerRoles = [
  "hotel_owner",
  "vehicle_owner",
  "restaurant_owner",
  "tour_guide",
  "event_organizer"
];


// ==========================
// GET PENDING PROVIDERS
// ==========================
const getPendingUsers = async (req, res) => {

  try {

    const users = await User.find({
      status: "pending",
      role: { $in: providerRoles }
    })
      .select("name email role profileImage serviceImages status")
      .sort({ createdAt: -1 })
      .lean();

    res.json(users.map(formatUser));

  } catch (error) {

    res.status(500).json({
      message: "Error fetching pending users",
      error: error.message
    });

  }

};


// ==========================
// APPROVE USER
// ==========================
const approveUser = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = "approved";
    user.membership = true;

    await user.save();

    res.json({ message: "User approved successfully" });

  } catch (error) {

    res.status(500).json({
      message: "Error approving user",
      error: error.message
    });

  }

};


// ==========================
// REJECT USER
// ==========================
const rejectUser = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.status = "rejected";

    await user.save();

    res.json({ message: "User rejected successfully" });

  } catch (error) {

    res.status(500).json({
      message: "Error rejecting user",
      error: error.message
    });

  }

};


// ==========================
// DELETE USER
// ==========================
const deleteUser = async (req, res) => {

  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });

  } catch (error) {

    res.status(500).json({
      message: "Error deleting user",
      error: error.message
    });

  }

};


// ==========================
// GET ALL USERS
// ==========================
const getAllUsers = async (req, res) => {

  try {

    const users = await User.find()
      .select("name email role profileImage serviceImages status")
      .sort({ createdAt: -1 })
      .lean();

    res.json(users.map(formatUser));

  } catch (error) {

    res.status(500).json({
      message: "Error fetching users",
      error: error.message
    });

  }

};


// ==========================
// 🔥 FINAL FIXED BALANCES
// ==========================
const getAllBalances = async (req, res) => {

  try {

    // ✅ only successful payments
    const payments = await Payment.find({ paymentStatus: "success" })
      .populate("providerId", "name role");

    let platformRevenue = 0;
    let providerRevenue = 0;

    const roleWise = {};
    const providersMap = {};

    payments.forEach(p => {

      const platform = p.platformShare || 0;
      const provider = p.providerShare || 0;

      platformRevenue += platform;
      providerRevenue += provider;

      const providerData = p.providerId;

      if (!providerData) return;

      const role = providerData.role;
      const id = providerData._id.toString();

      // ================= ROLE-WISE =================
      if (!roleWise[role]) {
        roleWise[role] = 0;
      }

      roleWise[role] += provider;

      // ================= PROVIDER-WISE =================
      if (!providersMap[id]) {
        providersMap[id] = {
          _id: id,
          name: providerData.name,
          role: role,
          balance: 0
        };
      }

      providersMap[id].balance += provider;

    });

    const providers = Object.values(providersMap);

    res.json({
      providerBalance: providerRevenue,
      platformRevenue,
      providerRevenue,
      totalTransactions: payments.length,
      roleWise,
      providers
    });

  }
  catch (error) {

    res.status(500).json({
      message: "Error fetching balances",
      error: error.message
    });

  }

};


// ==========================
// DASHBOARD STATS
// ==========================
const getDashboardStats = async (req, res) => {

  try {

    const totalUsers = await User.countDocuments({ role: "traveler" });

    const totalProviders = await User.countDocuments({
      role: { $in: providerRoles }
    });

    const totalBookings = await Booking.countDocuments();

    const payments = await Payment.find({ paymentStatus: "success" }).lean();

    const totalRevenue = payments.reduce(
      (sum, p) => sum + (p.platformShare || 0),
      0
    );

    res.json({
      totalUsers,
      totalProviders,
      totalBookings,
      totalRevenue
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: error.message
    });

  }

};


// ==========================
// GET APPROVED PROVIDERS
// ==========================
const getApprovedUsers = async (req, res) => {

  try {

    const users = await User.find({
      status: "approved",
      role: { $in: providerRoles }
    })
      .select("name email role profileImage serviceImages status")
      .sort({ createdAt: -1 })
      .lean();

    res.json(users.map(formatUser));

  } catch (error) {

    res.status(500).json({
      message: "Error fetching approved users",
      error: error.message
    });

  }

};


// ==========================
// EXPORTS
// ==========================
module.exports = {
  getPendingUsers,
  approveUser,
  rejectUser,
  deleteUser,
  getAllUsers,
  getDashboardStats,
  getApprovedUsers,
  getAllBalances
};