import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./ListingPages.css";
import { getServiceImage } from "../services/imageHelper";
import { DEFAULT_EVENTS } from "../data/defaultCatalog";

function Events() {
  const [events, setEvents] = useState(DEFAULT_EVENTS);
  const navigate = useNavigate();

  const formatDate = (date) => {
    if (!date) return "Upcoming";
    const d = new Date(date);
    if (isNaN(d)) return date;
    return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get("/events");
        if (Array.isArray(res.data) && res.data.length > 0) {
          setEvents(res.data);
        } else if (res.data && Array.isArray(res.data.events) && res.data.events.length > 0) {
          setEvents(res.data.events);
        } else {
          setEvents(DEFAULT_EVENTS);
        }
      } catch (err) {
        console.warn("Events live fetch notice (using catalog):", err.message);
        setEvents(DEFAULT_EVENTS);
      }
    };

    fetchEvents();
  }, []);

  const safeEvents = Array.isArray(events) ? events : DEFAULT_EVENTS;

  return (
    <div className="listing-container">
      {/* NAVBAR SPACE */}
      <div className="listing-spacing"></div>

      {/* HEADER */}
      <div className="listing-header text-center">
        <h1 className="listing-title">
          🎉 Explore Festivals & Events
        </h1>
        <p className="listing-subtitle">
          Discover unforgettable cultural moments, desert fairs & beach carnivals
        </p>
      </div>

      {/* GRID */}
      <div className="listing-grid">
        {safeEvents.map(event => (
          <div
            key={event._id || event.id}
            onClick={() => navigate(`/event/${event._id || event.id}`)}
            className="listing-card"
          >
            {/* IMAGE */}
            <div className="card-img-wrapper">
              <img
                src={getServiceImage(event.images, "event")}
                alt={event.title || event.eventName}
                className="card-img"
              />
              <span className="card-price-tag">
                ₹{event.price}
              </span>
            </div>

            {/* CONTENT */}
            <div className="card-content">
              <h2 className="card-title">
                {event.title || event.eventName}
              </h2>

              <p className="card-meta">
                📍 {event.location}
              </p>

              <div className="flex justify-between items-center mt-3">
                <span className="text-sm text-gray-600 font-medium">
                  📅 {formatDate(event.eventDate)}
                </span>
                <span className="badge status-confirmed">
                  Booking Open
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;