import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Guides(){

  const [guides,setGuides] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:5000";

  // ✅ SAFE IMAGE FIX
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/200";

    const cleanPath = path
      .replace(/^\/+/, "")
      .replace(/^uploads\//, "");

    return `${BASE_URL}/uploads/${cleanPath}`;
  };

  useEffect(()=>{

    const fetchGuides = async()=>{

      try{
        const res = await API.get("/guides");
        setGuides(res.data);
      }
      catch(err){
        console.error(err);
      }

    };

    fetchGuides();

  },[]);


  return(

    <div className="w-full bg-gradient-to-b from-gray-50 to-white">

      {/* ✅ SPACING FIX (IMPORTANT 🔥) */}
      <div className="h-[18vh]"></div>

      {/* HEADER */}
      <div className="max-w-6xl mx-auto px-6 mb-10">

        <h1 className="text-3xl md:text-4xl font-bold">
          🧭 Explore Tour Guides
        </h1>

        <p className="text-gray-500 mt-2">
          Find expert guides for your journey ✨
        </p>

      </div>

      {/* GRID */}
      <div className="max-w-6xl mx-auto px-6 pb-10 grid sm:grid-cols-2 md:grid-cols-3 gap-6">

        {guides.map(guide=>(

          <div
            key={guide._id}
            className="
              bg-white/70 backdrop-blur-lg
              rounded-2xl shadow-md
              hover:shadow-2xl transition duration-300
              overflow-hidden group cursor-pointer
            "
          >

            {/* IMAGE */}
            <div className="overflow-hidden">
              <img
                src={getImageUrl(guide.images?.[0])}
                className="h-44 w-full object-cover group-hover:scale-110 transition duration-500"
              />
            </div>

            {/* CONTENT */}
            <div className="p-4">

              <h2 className="text-lg font-bold group-hover:text-orange-600 transition">
                {guide.guideName}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                📍 {guide.location}
              </p>

              <p className="text-sm">
                Experience: {guide.experience} years
              </p>

              <p className="text-sm">
                Languages: {guide.languages?.join(", ")}
              </p>

              <p className="text-orange-600 font-bold mt-2">
                ₹{guide.pricePerDay}/day
              </p>

              <button
                onClick={()=>navigate(`/guide/${guide._id}`)}
                className="
                  mt-3 w-full py-2 rounded-xl
                  bg-orange-500 text-white
                  hover:bg-orange-600 transition
                "
              >
                View Details
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}

export default Guides;