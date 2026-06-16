const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  deleteAccount
} = require("../controllers/authController");

const verifyToken = require("../middleware/verifyToken");
const uploadRegisterImages = require("../middleware/uploadMiddleware");
const upload = require("../config/multerConfig");

router.post("/register", uploadRegisterImages, registerUser);

router.post("/login", loginUser);

router.get("/profile", verifyToken, getProfile);

router.put(
  "/profile",
  verifyToken,
  upload.single("profileImage"),
  updateProfile
);

router.delete("/delete-account", verifyToken, deleteAccount);

module.exports = router;