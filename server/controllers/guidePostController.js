const GuidePost = require("../models/GuidePost");
const Guide = require("../models/Guide");


// ======================
// CREATE POST
// ======================
const createPost = async (req, res) => {
  try {

    const { title, description } = req.body;

    const guide = await Guide.findOne({
      ownerId: req.user.id
    });

    if (!guide) {
      return res.status(404).json({
        message: "Guide profile not found"
      });
    }

    const images = req.files?.length
      ? req.files.map(file => {
          const fullPath = file.path.replace(/\\/g, "/");
          return fullPath.split("uploads/")[1];
        })
      : [];

    const post = new GuidePost({
      guideId: guide._id,
      title,
      description,
      images
    });

    const savedPost = await post.save();

    res.status(201).json({
      message: "Post created",
      post: savedPost
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// ======================
// GET POSTS BY GUIDE
// ======================
const getGuidePosts = async (req, res) => {
  try {

    const posts = await GuidePost.find({
      guideId: req.params.guideId
    }).sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getGuidePosts
};