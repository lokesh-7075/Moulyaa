const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({

  restaurantId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Restaurant",
    required:true
  },

  foodName:{
    type:String,
    required:true
  },

  category:{
    type:String
  },

  price:{
    type:Number,
    required:true
  },

  description:{
    type:String
  },

  foodImages:[
    {
      type:String
    }
  ],

  availability:{
    type:Boolean,
    default:true
  }

},{timestamps:true});

module.exports = mongoose.model("Food",foodSchema);