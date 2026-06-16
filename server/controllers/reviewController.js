const Review = require("../models/Review");


// ==========================
// CREATE REVIEW
// ==========================

const createReview = async (req, res) => {

  try {

    const { serviceId, serviceType, rating, comment } = req.body;

    if (!serviceId || !serviceType || !rating) {
      return res.status(400).json({
        message: "Service, type and rating required"
      });
    }

    // prevent duplicate review
    const existingReview = await Review.findOne({
      travelerId: req.user.id,
      serviceId
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You already reviewed this service"
      });
    }

    const review = new Review({
      travelerId: req.user.id,
      serviceId,
      serviceType,
      rating,
      comment
    });

    const savedReview = await review.save();

    res.status(201).json({
      message: "Review added successfully",
      review: savedReview
    });

  } catch (error) {

    res.status(500).json({
      message: "Error creating review",
      error: error.message
    });

  }

};



// ==========================
// GET REVIEWS FOR SERVICE
// ==========================

const getServiceReviews = async (req, res) => {

  try {

    const reviews = await Review.find({
      serviceId: req.params.id
    })
    .populate("travelerId","name profileImage")
    .sort({ createdAt: -1 });

    // calculate average rating
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum,r)=>sum+r.rating,0)/reviews.length
        : 0;

    res.json({
      totalReviews: reviews.length,
      averageRating: avgRating.toFixed(1),
      reviews
    });

  } catch (error) {

    res.status(500).json({
      message: "Error fetching reviews",
      error: error.message
    });

  }

};



// ==========================
// DELETE REVIEW
// ==========================

const deleteReview = async (req, res) => {

  try {

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    // only traveler or admin can delete
    if (
      review.travelerId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not authorized to delete this review"
      });
    }

    await review.deleteOne();

    res.json({
      message: "Review deleted successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: "Error deleting review",
      error: error.message
    });

  }

};


module.exports = {
  createReview,
  getServiceReviews,
  deleteReview
};