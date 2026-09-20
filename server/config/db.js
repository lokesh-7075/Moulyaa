const mongoose = require("mongoose");

const connectDB = async () => {
  try {

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 2500
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);

  } catch (error) {

    console.error("⚠️ MongoDB Connection Warning:", error.message);
    console.warn("Server will continue running. Please ensure MongoDB is started locally or MONGO_URI in .env points to MongoDB Atlas.");

  }
};

module.exports = connectDB;