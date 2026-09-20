import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./ListingPages.css";
import { getServiceImage } from "../services/imageHelper";
import { DEFAULT_GUIDES } from "../data/defaultCatalog";

function Guides() {
  const [guides, setGuides] = useState(DEFAULT_GUIDES);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGuides = async () => {
      try {
        const res = await API.get("/guides");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setGuides(res.data);
        } else if (res.data && Array.isArray(res.data.guides) && res.data.guides.length > 0) {
          setGuides(res.data.guides);
        } else {
          setGuides(DEFAULT_GUIDES);
        }
      } catch (err) {
        console.warn("Guides live fetch notice (using catalog):", err.message);
        setGuides(DEFAULT_GUIDES);
      }
    };

    fetchGuides();
  }, []);

  const safeGuides = Array.isArray(guides) ? guides : DEFAULT_GUIDES;

  return (
    <div className="listing-container">
      <div className="listing-spacing"></div>

      {/* HEADER */}
      <div className="listing-header">
        <h1 className="listing-title">
          🧭 Explore Certified Tour Guides
        </h1>
        <p className="listing-subtitle">
          Find authenticated regional experts & heritage scholars ✨
        </p>
      </div>

      {/* GRID */}
      <div className="listing-grid">
        {safeGuides.map(guide => (
          <div
            key={guide._id || guide.id}
            onClick={() => navigate(`/guide/${guide._id || guide.id}`)}
            className="listing-card"
          >
            {/* IMAGE */}
            <div className="card-img-wrapper">
              <img
                src={getServiceImage(guide.images, "guide")}
                alt={guide.guideName}
                className="card-img"
              />
              <span className="card-price-tag">
                ₹{guide.pricePerDay}/day
              </span>
            </div>

            {/* CONTENT */}
            <div className="card-content">
              <h2 className="card-title">
                {guide.guideName}
              </h2>

              <p className="card-meta">
                📍 {guide.location}
              </p>

              {guide.experience && (
                <p className="card-desc">
                  🎖️ Experience: {guide.experience} years
                </p>
              )}

              {guide.languages && (
                <p className="card-desc">
                  🗣️ Languages: {Array.isArray(guide.languages) ? guide.languages.join(", ") : guide.languages}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Guides;