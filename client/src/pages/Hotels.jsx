import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Hotels() {

  const [hotels, setHotels] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:5000";

  // =========================
  // IMAGE FIX
  // =========================
  const getImageUrl = (path) => {
    if (!path) {
      return "https://images.unsplash.com/photo-1566073771259-6a8506099945";
    }

    const cleanPath = path
      .replace(/^\/+/, "")
      .replace(/^uploads\//, "");

    return `${BASE_URL}/uploads/${cleanPath}`;
  };

  // =========================
  // FETCH HOTELS
  // =========================
  useEffect(() => {

    const fetchHotels = async () => {
      try {
        const res = await API.get("/hotels");
        setHotels(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHotels();

  }, []);

  return (

    <div className="w-full bg-gradient-to-b from-gray-50 to-white">

      {/* ✅ SPACING FIX (IMPORTANT 🔥) */}
      <div className="h-[18vh]"></div>

      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-6 mb-10">

        <h1 className="text-3xl md:text-4xl font-bold">
          🏨 Explore Hotels
        </h1>

        <p className="text-gray-500 mt-2">
          Find your perfect stay across India ✨
        </p>

      </div>


      {/* HOTEL GRID */}
      <div className="max-w-6xl mx-auto px-6 pb-10 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

        {hotels.map((hotel) => (

          <div
            key={hotel._id}
            onClick={() => navigate(`/hotel/${hotel._id}`)}
            className="group cursor-pointer rounded-2xl overflow-hidden bg-white/70 backdrop-blur-lg shadow-md hover:shadow-2xl transition duration-300"
          >

            {/* IMAGE */}
            <div className="overflow-hidden">

              <img
                src={
                  hotel.images?.length
                    ? getImageUrl(hotel.images[0])
                    : getImageUrl()
                }
                className="h-52 w-full object-cover group-hover:scale-110 transition duration-500"
              />

            </div>

            {/* CONTENT */}
            <div className="p-4">

              <h2 className="font-semibold text-lg group-hover:text-orange-600 transition">
                {hotel.hotelName}
              </h2>

              <p className="text-gray-500 text-sm mt-1">
                📍 {hotel.location}
              </p>

              <div className="mt-3 flex justify-between items-center">

                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">
                  Verified
                </span>

                <span className="text-sm font-semibold text-gray-700">
                  View →
                </span>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Hotels;