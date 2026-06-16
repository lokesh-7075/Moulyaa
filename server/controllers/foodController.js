const Food = require("../models/Food");
const Restaurant = require("../models/Restaurant");
const path = require("path");


// ==========================
// ADD FOOD
// ==========================

const createFood = async (req,res)=>{

  try{

    const restaurant = await Restaurant.findOne({
      ownerId:req.user.id
    });

    if(!restaurant){
      return res.status(404).json({
        message:"Restaurant not found"
      });
    }

    const {
      foodName,
      category,
      price,
      description
    } = req.body;

    const foodImages = req.files
      ? req.files.map(file =>
          `uploads/restaurants/food/${path.basename(file.path)}`
        )
      : [];

    const food = new Food({
      restaurantId:restaurant._id,
      foodName,
      category,
      price,
      description,
      foodImages
    });

    const savedFood = await food.save();

    res.status(201).json({
      message:"Food added successfully",
      food:savedFood
    });

  }
  catch(error){

    res.status(500).json({
      message:"Error adding food",
      error:error.message
    });

  }

};



// ==========================
// GET OWNER FOODS
// ==========================

const getMyFoods = async (req,res)=>{

  try{

    const restaurant = await Restaurant.findOne({
      ownerId:req.user.id
    });

    // if restaurant not created yet
    if(!restaurant){
      return res.json([]);
    }

    const foods = await Food.find({
      restaurantId:restaurant._id
    }).sort({createdAt:-1});

    res.json(foods);

  }
  catch(error){

    res.status(500).json({
      message:"Error fetching foods",
      error:error.message
    });

  }

};



// ==========================
// GET FOODS BY RESTAURANT (Traveler)
// ==========================

const getRestaurantFoods = async (req,res)=>{

  try{

    const foods = await Food.find({
      restaurantId:req.params.restaurantId
    }).sort({createdAt:-1});

    res.json(foods);

  }
  catch(error){

    res.status(500).json({
      message:"Error fetching restaurant foods",
      error:error.message
    });

  }

};



// ==========================
// UPDATE FOOD
// ==========================

const updateFood = async (req,res)=>{

  try{

    const food = await Food.findById(req.params.id);

    if(!food){
      return res.status(404).json({
        message:"Food not found"
      });
    }

    food.foodName = req.body.foodName || food.foodName;
    food.category = req.body.category || food.category;
    food.price = req.body.price || food.price;
    food.description = req.body.description || food.description;
    food.availability = req.body.availability ?? food.availability;

    if(req.files && req.files.length > 0){

      food.foodImages = req.files.map(file =>
        `uploads/restaurants/food/${path.basename(file.path)}`
      );

    }

    const updatedFood = await food.save();

    res.json({
      message:"Food updated successfully",
      food:updatedFood
    });

  }
  catch(error){

    res.status(500).json({
      message:"Error updating food",
      error:error.message
    });

  }

};



// ==========================
// DELETE FOOD
// ==========================

const deleteFood = async (req,res)=>{

  try{

    const food = await Food.findById(req.params.id);

    if(!food){
      return res.status(404).json({
        message:"Food not found"
      });
    }

    await food.deleteOne();

    res.json({
      message:"Food deleted successfully"
    });

  }
  catch(error){

    res.status(500).json({
      message:"Error deleting food",
      error:error.message
    });

  }

};


module.exports = {
  createFood,
  getMyFoods,
  getRestaurantFoods,
  updateFood,
  deleteFood
};