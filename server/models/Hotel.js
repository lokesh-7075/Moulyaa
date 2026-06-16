const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({

  ownerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  hotelName:{
    type:String,
    required:true,
    trim:true
  },

  location:{
    type:String,
    required:true,
    trim:true
  },

  description:{
    type:String,
    default:""
  },

  images:{
    type:[String],
    default:[]
  },

  // optional future fields
  rating:{
    type:Number,
    default:0
  },

  isActive:{
    type:Boolean,
    default:true
  }

},{
  timestamps:true
});

module.exports = mongoose.model("Hotel",hotelSchema);