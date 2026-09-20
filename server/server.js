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

app.use(express.json({ limit: "50mb" }));

app.use(express.urlencoded({ extended: true, limit: "50mb" }));


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
const aiRoutes = require("./routes/aiRoutes");
const bundleRoutes = require("./routes/bundleRoutes");


console.log("Food Routes file loaded")


// ======================
// API ROUTES
// ======================
app.use("/api/ai", aiRoutes);
app.use("/api/bundles", bundleRoutes);
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
// CLOUDWATCH LOGGING
// ======================
const cloudwatchLogger = require("./middleware/cloudwatchLogger");
app.use(cloudwatchLogger);

// ======================
// HEALTH & AWS STATUS
// ======================

app.get("/", (req, res) => {
  res.send("🌍 Moulyas Tourism API running on AWS...");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "HEALTHY",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/api/aws/status", async (req, res) => {
  const awsRegion = process.env.AWS_REGION || "us-east-1";
  const hasBedrock = !!process.env.AWS_ACCESS_KEY_ID || !!process.env.AWS_ROLE_ARN || !!process.env.AWS_CONTAINER_CREDENTIALS_RELATIVE_URI;
  const s3Bucket = process.env.AWS_S3_BUCKET_NAME || "moulyasree-tourism-bucket";
  const cdnDomain = process.env.AWS_CLOUDFRONT_DOMAIN || "Direct / CloudFront";

  res.json({
    service: "Moulyasree Tourism Cloud API",
    status: "ONLINE",
    awsArchitecture: {
      region: awsRegion,
      bedrockModelId: process.env.BEDROCK_MODEL_ID || "anthropic.claude-3-haiku-20240307-v1:0",
      bedrockActive: hasBedrock,
      s3BucketName: s3Bucket,
      cloudFrontCDN: cdnDomain,
      dynamoCatalog: "DynamoDB (Moulyasree_Hotels, Moulyasree_Vehicles, Moulyasree_Restaurants, Moulyasree_Guides)",
      databaseType: "Amazon DocumentDB / MongoDB"
    },
    uptime: `${Math.floor(process.uptime())}s`
  });
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