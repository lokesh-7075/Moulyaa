import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./ListingPages.css";
import { getServiceImage } from "../services/imageHelper";
import { DEFAULT_RESTAURANTS } from "../data/defaultCatalog";

function Restaurants() {
  const [restaurants, setRestaurants] = useState(DEFAULT_RESTAURANTS);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await API.get("/restaurants");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setRestaurants(res.data);
        } else if (res.data && Array.isArray(res.data.restaurants) && res.data.restaurants.length > 0) {
          setRestaurants(res.data.restaurants);
        } else {
          setRestaurants(DEFAULT_RESTAURANTS);
        }
      } catch (err) {
        console.warn("Restaurants live fetch notice (using catalog):", err.message);
        setRestaurants(DEFAULT_RESTAURANTS);
      }
    };

    fetchRestaurants();
  }, []);

  const safeRestaurants = Array.isArray(restaurants) ? restaurants : DEFAULT_RESTAURANTS;

  return (
    <div className="listing-container">
      <div className="listing-spacing" />

      {/* HEADER */}
      <div className="listing-header text-center">
        <h1 className="listing-title">
          🍽 Explore Authentic Dining & Cuisines
        </h1>
        <p className="listing-subtitle">
          Discover flavors, romance & unforgettable culinary journeys ✨
        </p>
      </div>

      {/* GRID */}
      <div className="listing-grid">
        {safeRestaurants.map((r) => {
          const image = getServiceImage(r.images, "restaurant");

          return (
            <div
              key={r._id || r.id}
              onClick={() => navigate(`/restaurant/${r._id || r.id}`)}
              className="listing-card"
            >
              {/* IMAGE */}
              <div className="card-img-wrapper">
                <img
                  src={image}
                  alt={r.restaurantName}
                  className="card-img"
                />
              </div>

              <div className="card-content">
                <h2 className="card-title">
                  {r.restaurantName || "Heritage Dining"}
                </h2>

                <p className="card-meta">
                  📍 {r.location || "Pan-India"}
                </p>

                {r.cuisine && (
                  <p className="text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full inline-block mt-2 font-medium">
                    🍲 {r.cuisine}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Restaurants;