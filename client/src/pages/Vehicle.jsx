import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Vehicles() {

  const [vehicles, setVehicles] = useState([]);
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

  useEffect(() => {

    const fetchVehicles = async () => {
      try {
        const res = await API.get("/vehicles");
        setVehicles(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVehicles();

  }, []);

  return (

    <div className="w-full bg-gradient-to-br from-rose-50 via-white to-orange-50">

      {/* ✅ SPACING FIX (IMPORTANT 🔥) */}
      <div className="h-[18vh]"></div>

      <div className="px-6 md:px-12 pb-10">

        {/* ================= HEADER ================= */}
        <div className="mb-10 text-center">

          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
            🚗 Explore Vehicles
          </h1>

          <p className="text-gray-500 mt-3 text-lg">
            Travel in comfort, style & elegance
          </p>

        </div>


        {/* ================= GRID ================= */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">

          {vehicles.map(vehicle => (

            <div
              key={vehicle._id}
              onClick={() => navigate(`/vehicle/${vehicle._id}`)}
              className="group cursor-pointer backdrop-blur-xl bg-white/60 border border-white/40 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
            >

              {/* IMAGE */}
              <div className="relative overflow-hidden rounded-t-2xl">

                <img
                  src={getImageUrl(vehicle.images?.[0])}
                  className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-70"></div>

                {/* Price badge */}
                <div className="absolute bottom-2 right-2 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-orange-600 shadow">
                  ₹{vehicle.pricePerDay}/day
                </div>

              </div>


              {/* CONTENT */}
              <div className="p-4">

                <h2 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition">
                  {vehicle.vehicleName}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  📍 {vehicle.location}
                </p>

                <div className="flex justify-between items-center mt-3">

                  <span className="text-sm text-gray-600">
                    👥 {vehicle.seats} seats
                  </span>

                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                    Available
                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>


        {/* ================= EMPTY STATE ================= */}
        {vehicles.length === 0 && (
          <div className="text-center text-gray-500 mt-20 text-lg">
            No vehicles available 🚫
          </div>
        )}

      </div>

    </div>

  );
}

export default Vehicles;