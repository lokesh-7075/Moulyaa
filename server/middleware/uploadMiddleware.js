const upload = require("../config/multerConfig");

const uploadRegisterImages = (req, res, next) => {

  const uploader = upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "serviceImages", maxCount: 5 }
  ]);

  uploader(req, res, function (err) {

    // ======================
    // MULTER ERROR
    // ======================
    if (err) {
      return res.status(400).json({
        message: "File upload error",
        error: err.message
      });
    }

    const role = req.body.role;

    // ======================
    // ROLE VALIDATION
    // ======================
    if (!role) {
      return res.status(400).json({
        message: "Role is required"
      });
    }

    // ======================
    // PROFILE IMAGE (REQUIRED FOR ALL)
    // ======================
    if (!req.files || !req.files.profileImage || req.files.profileImage.length === 0) {
      return res.status(400).json({
        message: "Profile image is required"
      });
    }

    // ======================
    // PROVIDER ROLES
    // ======================
    const providerRoles = [
      "hotel_owner",
      "vehicle_owner",
      "restaurant_owner",
      "tour_guide",
      "event_organizer"
    ];

    // ======================
    // SERVICE IMAGE VALIDATION
    // ======================
    if (providerRoles.includes(role)) {
      const serviceImages = req.files.serviceImages || [];
      if (serviceImages.length > 5) {
        return res.status(400).json({
          message: "Maximum 5 service images allowed"
        });
      }
    }

    // ======================
    // CLEAN FILE PATHS (VERY IMPORTANT FOR WINDOWS)
    // ======================
    if (req.files.profileImage) {
      req.files.profileImage[0].path =
        req.files.profileImage[0].path.replace(/\\/g, "/");
    }

    if (req.files.serviceImages) {
      req.files.serviceImages = req.files.serviceImages.map(file => {
        file.path = file.path.replace(/\\/g, "/");
        return file;
      });
    }

    next();

  });

};

module.exports = uploadRegisterImages;