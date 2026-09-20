import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./ListingPages.css";
import { getServiceImage } from "../services/imageHelper";
import { DEFAULT_HOTELS } from "../data/defaultCatalog";

function Hotels() {
  const [hotels, setHotels] = useState(DEFAULT_HOTELS);
  const navigate = useNavigate();

  // =========================
  // FETCH HOTELS
  // =========================
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await API.get("/hotels");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setHotels(res.data);
        } else if (res.data && Array.isArray(res.data.hotels) && res.data.hotels.length > 0) {
          setHotels(res.data.hotels);
        } else {
          setHotels(DEFAULT_HOTELS);
        }
      } catch (err) {
        console.warn("Hotels live fetch notice (using catalog):", err.message);
        setHotels(DEFAULT_HOTELS);
      }
    };

    fetchHotels();
  }, []);

  const safeHotels = Array.isArray(hotels) ? hotels : DEFAULT_HOTELS;

  return (
    <div className="listing-container">
      <div className="listing-spacing"></div>

      {/* HEADER */}
      <div className="listing-header">
        <h1 className="listing-title">
          🏨 Explore Hotels
        </h1>
        <p className="listing-subtitle">
          Find your perfect luxury & heritage stay across India ✨
        </p>
      </div>

      {/* HOTEL GRID */}
      <div className="listing-grid">
        {safeHotels.map((hotel) => (
          <div
            key={hotel._id || hotel.id}
            onClick={() => navigate(`/hotel/${hotel._id || hotel.id}`)}
            className="listing-card"
          >
            {/* IMAGE */}
            <div className="card-img-wrapper">
              <img
                src={getServiceImage(hotel.images, "hotel")}
                alt={hotel.hotelName}
                className="card-img"
              />
              {hotel.price && (
                <span className="card-price-tag">
                  ₹{hotel.price}/night
                </span>
              )}
            </div>

            {/* CONTENT */}
            <div className="card-content">
              <h2 className="card-title">
                {hotel.hotelName}
              </h2>
              <p className="card-meta">
                📍 {hotel.location}
              </p>
              {hotel.rating && (
                <p className="text-amber-500 font-semibold text-sm mt-1">
                  ⭐ {hotel.rating} / 5.0
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Hotels;