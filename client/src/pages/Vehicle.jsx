import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./ListingPages.css";
import { getServiceImage } from "../services/imageHelper";
import { DEFAULT_VEHICLES } from "../data/defaultCatalog";

function Vehicles() {
  const [vehicles, setVehicles] = useState(DEFAULT_VEHICLES);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await API.get("/vehicles");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setVehicles(res.data);
        } else if (res.data && Array.isArray(res.data.vehicles) && res.data.vehicles.length > 0) {
          setVehicles(res.data.vehicles);
        } else {
          setVehicles(DEFAULT_VEHICLES);
        }
      } catch (err) {
        console.warn("Vehicles live fetch notice (using catalog):", err.message);
        setVehicles(DEFAULT_VEHICLES);
      }
    };

    fetchVehicles();
  }, []);

  const safeVehicles = Array.isArray(vehicles) ? vehicles : DEFAULT_VEHICLES;

  return (
    <div className="listing-container">
      <div className="listing-spacing"></div>

      {/* HEADER */}
      <div className="listing-header text-center">
        <h1 className="listing-title">
          🚗 Explore Vehicles & Fleet
        </h1>
        <p className="listing-subtitle">
          Travel in comfort, style & elegance across India
        </p>
      </div>

      {/* GRID */}
      <div className="listing-grid">
        {safeVehicles.map(vehicle => (
          <div
            key={vehicle._id || vehicle.id}
            onClick={() => navigate(`/vehicle/${vehicle._id || vehicle.id}`)}
            className="listing-card"
          >
            {/* IMAGE */}
            <div className="card-img-wrapper">
              <img
                src={getServiceImage(vehicle.images, vehicle.type || "vehicle")}
                alt={vehicle.vehicleName}
                className="card-img"
              />
              <span className="card-price-tag">
                ₹{vehicle.pricePerDay}/day
              </span>
            </div>

            {/* CONTENT */}
            <div className="card-content">
              <h2 className="card-title">
                {vehicle.vehicleName}
              </h2>

              <p className="card-meta">
                📍 {vehicle.location}
              </p>

              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-600 font-medium">
                  👥 {vehicle.seats || 5} seats
                </span>
                <span className="badge status-confirmed">
                  Verified Active
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Vehicles;