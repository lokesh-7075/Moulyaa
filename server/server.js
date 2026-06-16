const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

const connectDB = require("./config/db");

dotenv.config();

const app = express();


// ======================
// CONNECT DATABASE
// ======================

connectDB();


// ======================
// ENSURE UPLOAD FOLDER EXISTS
// ======================

const uploadsPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}


// ======================
// MIDDLEWARE
// ======================

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


// ======================
// STATIC FILES (UPLOADS)
// ======================

app.use("/uploads", express.static(uploadsPath));


// ======================
// ROUTE IMPORTS
// ======================

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const userRoutes = require("./routes/userRoutes");

const hotelRoutes = require("./routes/hotelRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const restaurantRoutes = require("./routes/restaurantRoutes");
const guideRoutes = require("./routes/guideRoutes");
const eventRoutes = require("./routes/eventRoutes");

const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const foodRoutes = require("./routes/foodRoutes");
const roomRoutes = require("./routes/roomRoutes.js");
const guidePostRoutes = require("./routes/guidePostRoutes");


console.log("Food Routes file loaded")


// ======================
// API ROUTES
// ======================
app.use("/api/guide-posts", guidePostRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/users", userRoutes);
app.use("/api/rooms", roomRoutes)
app.use("/api/hotels", hotelRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/events", eventRoutes);

app.use("/api/bookings", bookingRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/foods", foodRoutes);

// ======================
// HEALTH CHECK
// ======================

app.get("/", (req, res) => {
  res.send("🌍 Moulyas Tourism API running...");
});


// ======================
// 404 ROUTE
// ======================

app.use((req, res) => {
  res.status(404).json({
    message: "Route not found"
  });
});


// ======================
// ERROR HANDLER
// ======================

const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);


// ======================
// SERVER START
// ======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📂 Uploads served at http://localhost:${PORT}/uploads`);
});