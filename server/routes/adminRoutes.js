const express = require("express");

const {
  getPendingUsers,
  approveUser,
  rejectUser,
  deleteUser,
  getAllUsers,
  getDashboardStats,
  getApprovedUsers,
  getAllBalances
} = require("../controllers/adminController");

const verifyToken = require("../middleware/verifyToken");
const roleMiddleware = require("../middleware/roleMiddleware");

const router = express.Router();


// ==========================
// ADMIN AUTH PROTECTION
// ==========================

router.use(verifyToken);
router.use(roleMiddleware("admin"));


// ==========================
// DASHBOARD STATS
// ==========================

router.get("/dashboard-stats", getDashboardStats);
router.get("/approved-users", getApprovedUsers);
router.get("/balances",getAllBalances);
// ==========================
// PROVIDER APPROVALS
// ==========================

router.get("/pending-users", getPendingUsers);

router.put("/approve-user/:id", approveUser);

router.put("/reject-user/:id", rejectUser);


// ==========================
// USER MANAGEMENT
// ==========================

router.get("/all-users", getAllUsers);

router.delete("/delete-user/:id", deleteUser);


module.exports = router;