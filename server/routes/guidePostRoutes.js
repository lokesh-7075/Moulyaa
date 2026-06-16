const express = require("express");
const router = express.Router();

const {
  createPost,
  getGuidePosts
} = require("../controllers/guidePostController");

const verifyToken = require("../middleware/verifyToken");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../config/multerConfig");


// CREATE POST
router.post(
  "/create",
  verifyToken,
  roleMiddleware("tour_guide"),
  upload.array("visitImages", 5),
  createPost
);

// GET POSTS
router.get("/:guideId", getGuidePosts);

module.exports = router;