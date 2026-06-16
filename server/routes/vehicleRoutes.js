const express = require("express");

const {
    createVehicle,
    getVehicles,
    getVehicleById,
    getMyVehicles,
    updateVehicle,
    deleteVehicle
} = require("../controllers/vehicleController");

const verifyToken = require("../middleware/verifyToken");
const roleMiddleware = require("../middleware/roleMiddleware");
const upload = require("../config/multerConfig");

const router = express.Router();


router.post(
    "/create",
    verifyToken,
    roleMiddleware("vehicle_owner"),
    upload.array("images",5),
    createVehicle
);

router.get("/", getVehicles);

router.get("/my-vehicles",
    verifyToken,
    roleMiddleware("vehicle_owner"),
    getMyVehicles
);

router.get("/:id", getVehicleById);

router.put(
    "/update/:id",
    verifyToken,
    roleMiddleware("vehicle_owner"),
    upload.array("images",5),
    updateVehicle
);

router.delete(
    "/delete/:id",
    verifyToken,
    roleMiddleware("vehicle_owner"),
    deleteVehicle
);


module.exports = router;