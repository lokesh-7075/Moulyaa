import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Restaurants() {

  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:5000";

  // ✅ ONLY REAL IMAGE (NO DEFAULT)
  const getImageUrl = (path) => {
    if (!path) return null;

    let clean = path.replace(/\\/g, "/").replace(/^\/+/, "");
    return `${BASE_URL}/${clean}`;
  };

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await API.get("/restaurants");
        setRestaurants(res.data || []);
      } catch (err) {
        console.error("Restaurant fetch error:", err);
      }
    };

    fetchRestaurants();
  }, []);

  return (

    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-orange-50">

      <div className="h-[16vh]" />

      <div className="px-6 md:px-12 pb-16">

        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
            🍽 Restaurants
          </h1>
          <p className="text-gray-500 mt-3">
            Discover flavors, romance & unforgettable dining ✨
          </p>
        </div>

        {/* GRID */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">

          {restaurants.map((r) => {

            const image = getImageUrl(r.images?.[0]);

            return(

              <div
                key={r._id}
                onClick={() => navigate(`/restaurant/${r._id}`)}
                className="group cursor-pointer rounded-3xl bg-white/60 backdrop-blur-xl shadow-lg hover:shadow-2xl transition hover:-translate-y-2 overflow-hidden"
              >

                {/* ✅ SHOW ONLY IF IMAGE EXISTS */}
                {image ? (
                  <img
                    src={image}
                    className="h-48 w-full object-cover group-hover:scale-110 transition duration-500"
                  />
                ) : (
                  <div className="h-48 w-full flex items-center justify-center text-gray-400 text-sm">
                    No Image
                  </div>
                )}

                <div className="p-5">

                  <h2 className="font-bold text-lg group-hover:text-orange-600 transition">
                    {r.restaurantName || "Restaurant"}
                  </h2>

                  <p className="text-gray-500 text-sm">
                    📍 {r.location || "Location"}
                  </p>

                </div>

              </div>

            )

          })}

        </div>

      </div>

    </div>

  );

}

export default Restaurants;