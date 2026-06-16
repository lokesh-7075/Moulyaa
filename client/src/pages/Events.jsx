import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Events() {

  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:5000";

  // 🔥 SAFE IMAGE FIX
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/400";

    const cleanPath = path
      ?.replace(/^\/+/, "")
      ?.replace(/^uploads\//, "");

    return `${BASE_URL}/uploads/${cleanPath}`;
  };

  // ✅ SAFE DATE FORMAT FUNCTION
  const formatDate = (date) => {
    if (!date) return "No Date";

    const d = new Date(date);

    if (isNaN(d)) return "Invalid Date";

    return d.toLocaleDateString("en-IN");
  };

  useEffect(() => {

    const fetchEvents = async () => {
      try {
        const res = await API.get("/events");
        setEvents(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvents();

  }, []);

  return (

    <div className="w-full bg-gradient-to-br from-purple-50 via-white to-pink-50">

      {/* NAVBAR SPACE */}
      <div className="h-[18vh]"></div>

      <div className="px-6 md:px-12 pb-10">

        {/* HEADER */}
        <div className="text-center mb-10">

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800">
            🎉 Explore Events
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Discover unforgettable moments & magical experiences
          </p>

        </div>


        {/* GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {events.map(event => (

            <div
              key={event._id}
              onClick={() => navigate(`/event/${event._id}`)}
              className="group cursor-pointer backdrop-blur-xl bg-white/60 border border-white/40 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >

              {/* IMAGE */}
              <div className="relative overflow-hidden rounded-t-2xl">

                <img
                  src={getImageUrl(event.images?.[0])}
                  className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-pink-600 shadow">
                  ₹{event.price}
                </div>

              </div>


              {/* CONTENT */}
              <div className="p-4">

                <h2 className="text-lg font-bold text-gray-800 group-hover:text-pink-600 transition">
                  {event.title}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  📍 {event.location}
                </p>

                <div className="flex justify-between items-center mt-3">

                  {/* ✅ FIXED DATE */}
                  <span className="text-sm text-gray-600">
                    📅 {formatDate(event.eventDate)}
                  </span>

                  <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full">
                    Live
                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>


        {/* EMPTY STATE */}
        {events.length === 0 && (
          <div className="text-center text-gray-500 mt-20 text-lg">
            No events available 🎭
          </div>
        )}

      </div>

    </div>

  );

}

export default Events;