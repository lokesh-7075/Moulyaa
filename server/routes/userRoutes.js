const express = require("express");

const {
    getUserProfile,
    updateUserProfile,
    deleteUserAccount,
    getUserById,
    getUsers
} = require("../controllers/userController");

const verifyToken = require("../middleware/verifyToken");
const upload = require("../config/multerConfig");

const router = express.Router();

// GET PROFILE
router.get("/profile", verifyToken, getUserProfile);

// ✅ UPDATE PROFILE (MAIN FIX ROUTE)
router.put(
    "/profile",
    verifyToken,
    upload.single("profileImage"),
    updateUserProfile
);

// DELETE ACCOUNT
router.delete("/delete-account", verifyToken, deleteUserAccount);

// PUBLIC
router.get("/:id", getUserById);
router.get("/", getUsers);

module.exports = router;