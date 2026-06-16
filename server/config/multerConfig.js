const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({

  destination: function (req, file, cb) {

    let folder = "uploads/misc";

    // PROFILE
    if (file.fieldname === "profileImage") {
      folder = "uploads/profiles";
    }

    // GUIDE VISITS
    else if (file.fieldname === "visitImages") {
      folder = "uploads/guides/visits";
    }

    // SERVICE IMAGES (REGISTER)
    else if (file.fieldname === "serviceImages") {

      const role = req.body.role;

      if (role === "hotel_owner")
        folder = "uploads/hotels/service";

      else if (role === "vehicle_owner")
        folder = "uploads/vehicles/service";

      else if (role === "restaurant_owner")
        folder = "uploads/restaurants/service";

      else if (role === "tour_guide")
        folder = "uploads/guides/service";

      else if (role === "event_organizer")
        folder = "uploads/events/service";
    }

    // GUIDE
    else if (file.fieldname === "images" && req.baseUrl.includes("guides")) {
      folder = "uploads/guides/service";
    }

    // GUIDE POSTS
    else if (file.fieldname === "images" && req.baseUrl.includes("guide-posts")) {
      folder = "uploads/guides/visits";
    }

    // HOTEL
    else if (file.fieldname === "images" && req.baseUrl.includes("hotels")) {
      folder = "uploads/hotels/service";
    }

    // VEHICLE
    else if (file.fieldname === "images" && req.baseUrl.includes("vehicles")) {
      folder = "uploads/vehicles/cars";
    }

    // EVENT
    else if (file.fieldname === "images" && req.baseUrl.includes("events")) {
      folder = "uploads/events/service";
    }

    // ROOM
    else if (file.fieldname === "roomImages") {
      folder = "uploads/hotels/rooms";
    }

    // FOOD
    else if (file.fieldname === "food") {
      folder = "uploads/restaurants/food";
    }

    // ✅ FIX: ALWAYS resolve from project root
    const uploadPath = path.resolve(folder);

    // create folder if not exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },

  filename: function (req, file, cb) {

    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, uniqueName + path.extname(file.originalname));
  }

});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = upload;