const Restaurant = require("../models/Restaurant");


// 🔥 PATH FIX FUNCTION
const formatPath = (filePath) => {
  const clean = filePath.split("uploads")[1];
  return `uploads/${clean.replace(/\\/g, "/").replace(/^\/+/, "")}`;
};


// ==========================
// CREATE RESTAURANT
// ==========================

const createRestaurant = async (req,res)=>{

  try{

    const existing = await Restaurant.findOne({
      ownerId:req.user.id
    });

    if(existing){
      return res.status(400).json({
        message:"You already created a restaurant"
      });
    }

    const {
      restaurantName,
      location,
      description
    } = req.body;

    // ✅ FIXED
    const images = req.files
      ? req.files.map(file => formatPath(file.path))
      : [];

    const restaurant = new Restaurant({
      restaurantName,
      ownerId:req.user.id,
      location,
      description,
      images
    });

    const savedRestaurant = await restaurant.save();

    res.status(201).json({
      message:"Restaurant created successfully",
      restaurant:savedRestaurant
    });

  }
  catch(error){
    res.status(500).json({
      message:"Error creating restaurant",
      error:error.message
    });
  }

};



// ==========================
// GET ALL RESTAURANTS
// ==========================

const getRestaurants = async(req,res)=>{
  try{
    const restaurants = await Restaurant.find()
      .populate("ownerId","name email")
      .sort({createdAt:-1});

    res.json(restaurants);
  }
  catch(error){
    res.status(500).json({
      message:"Error fetching restaurants",
      error:error.message
    });
  }
};



// ==========================
// GET SINGLE RESTAURANT
// ==========================

const getRestaurantById = async(req,res)=>{
  try{

    const restaurant = await Restaurant.findById(req.params.id)
      .populate("ownerId","name email");

    if(!restaurant){
      return res.status(404).json({
        message:"Restaurant not found"
      });
    }

    res.json(restaurant);

  }
  catch(error){
    res.status(500).json({
      message:"Error fetching restaurant",
      error:error.message
    });
  }
};



// ==========================
// GET MY RESTAURANT
// ==========================

const getMyRestaurant = async(req,res)=>{
  try{

    const restaurant = await Restaurant.findOne({
      ownerId:req.user.id
    });

    if(!restaurant){
      return res.status(404).json({
        message:"Restaurant not found"
      });
    }

    res.json(restaurant);

  }
  catch(error){
    res.status(500).json({
      message:"Error fetching your restaurant",
      error:error.message
    });
  }
};



// ==========================
// UPDATE RESTAURANT
// ==========================

const updateRestaurant = async(req,res)=>{

  try{

    const restaurant = await Restaurant.findOne({
      ownerId:req.user.id
    });

    if(!restaurant){
      return res.status(404).json({
        message:"Restaurant not found"
      });
    }

    restaurant.restaurantName =
      req.body.restaurantName || restaurant.restaurantName;

    restaurant.location =
      req.body.location || restaurant.location;

    restaurant.description =
      req.body.description || restaurant.description;

    // ✅ FIXED
    if(req.files && req.files.length>0){
      restaurant.images = req.files.map(file =>
        formatPath(file.path)
      );
    }

    const updatedRestaurant = await restaurant.save();

    res.json({
      message:"Restaurant updated successfully",
      restaurant:updatedRestaurant
    });

  }
  catch(error){
    res.status(500).json({
      message:"Error updating restaurant",
      error:error.message
    });
  }

};



// ==========================
// DELETE RESTAURANT
// ==========================

const deleteRestaurant = async(req,res)=>{

  try{

    const restaurant = await Restaurant.findOne({
      ownerId:req.user.id
    });

    if(!restaurant){
      return res.status(404).json({
        message:"Restaurant not found"
      });
    }

    await restaurant.deleteOne();

    res.json({
      message:"Restaurant deleted successfully"
    });

  }
  catch(error){
    res.status(500).json({
      message:"Error deleting restaurant",
      error:error.message
    });
  }

};


module.exports = {
  createRestaurant,
  getRestaurants,
  getRestaurantById,
  getMyRestaurant,
  updateRestaurant,
  deleteRestaurant
};