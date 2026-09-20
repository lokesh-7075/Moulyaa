import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

import { getServiceImage } from "../services/imageHelper";

function GuideDetails() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [guide, setGuide] = useState(null);
  const [posts, setPosts] = useState([]);

  const [days,setDays] = useState(1);
  const [error,setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  // =========================
  // IMAGE FIX
  // =========================
  const getImageUrl = (path, cat = "guide") => {
    return getServiceImage(path, cat);
  };

  // =========================
  // FETCH DATA
  // =========================
  useEffect(() => {

    const fetchData = async () => {
      try {

        const guideRes = await API.get(`/guides/${id}`);
        if (guideRes.data) setGuide(guideRes.data);

        const postRes = await API.get(`/guide-posts/${id}`);
        if (Array.isArray(postRes.data)) {
          setPosts(postRes.data);
        } else {
          setPosts([]);
        }

      } catch (err) {
        console.warn("Guide details fetch notice:", err.message);
      }
    };

    if (id) fetchData();

  }, [id]);


  // =========================
  // BOOKING FLOW
  // =========================
  const handleBooking = async () => {

    setError("");

    if(!user){
      navigate("/login");
      return;
    }

    if(user.role !== "traveler"){
      setError("Only travelers can book guides");
      return;
    }

    if(days < 1){
      setError("Invalid days");
      return;
    }

    try{

      const total = guide.pricePerDay * days;

      const providerId =
        guide.ownerId ||
        guide.providerId;

      if(!providerId){
        setError("Provider missing");
        return;
      }

      // CREATE BOOKING
      const res = await API.post("/bookings/create",{
        serviceId: guide._id,
        providerId,
        serviceType: "tour_guide",
        numberOfPeople: 1,
        totalAmount: total
      });

      const bookingId = res.data.booking._id;

      // GO TO PAYMENT
      navigate(`/payment/${bookingId}`);

    }catch(err){
      console.error(err);
      setError("Booking failed");
    }

  };


  if (!guide) {
    return (
      <div className="h-screen flex justify-center items-center text-lg text-gray-500">
        Loading...
      </div>
    );
  }

  const total = guide.pricePerDay * days;

  return (

    <div className="w-full bg-gradient-to-br from-orange-50 via-white to-rose-50 min-h-screen">

      <div className="h-[18vh]"></div>

      {/* HERO */}
      <div className="relative h-[420px] w-full">

        <img
          src={getImageUrl(guide.images?.[0])}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="max-w-6xl mx-auto px-6 text-white">

            <h1 className="text-4xl font-bold">
              {guide.guideName}
            </h1>

            <p className="mt-2 text-lg">
              📍 {guide.location}
            </p>

          </div>
        </div>

      </div>

      {/* CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">

        {/* INFO */}
        <div className="backdrop-blur-xl bg-white/70 border rounded-2xl shadow-xl p-6 grid md:grid-cols-2 gap-8">

          {/* LEFT */}
          <div>

            <p className="text-gray-600">
              🧠 Experience: {guide.experience} years
            </p>

            <p className="text-gray-600">
              💬 {guide.languages?.join(", ")}
            </p>

            <p className="text-2xl text-orange-600 font-bold mt-2">
              ₹{guide.pricePerDay}/day
            </p>

            {/* DAYS */}
            <div className="mt-4">
              <label className="text-sm text-gray-600">
                Number of Days
              </label>

              <input
                type="number"
                min="1"
                value={days}
                onChange={(e)=>setDays(Number(e.target.value))}
                className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* TOTAL */}
            <p className="mt-3 font-semibold">
              Total: ₹{total}
            </p>

            {/* ERROR */}
            {error && (
              <p className="text-red-500 text-sm mt-2">
                {error}
              </p>
            )}

            {/* BUTTON */}
            <button
              onClick={handleBooking}
              className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white shadow-lg hover:scale-105 transition"
            >
              Continue to Payment 🧭
            </button>

          </div>

          {/* RIGHT */}
          <div className="text-gray-700">
            {guide.description}
          </div>

        </div>

        {/* POSTS */}
        <div>

          <h2 className="text-2xl font-bold mb-6">
            📸 Tour Experiences
          </h2>

          {(!Array.isArray(posts) || posts.length === 0) && (
            <p className="text-gray-500">No posts yet</p>
          )}

          <div className="grid md:grid-cols-3 gap-6">

            {(Array.isArray(posts) ? posts : []).map((p) => (

              <div
                key={p._id}
                className="group relative bg-white/70 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition"
              >

                <img
                  src={
                    p.images?.length
                      ? getImageUrl(p.images[0])
                      : "https://via.placeholder.com/300"
                  }
                  className="w-full h-56 object-cover group-hover:scale-110 transition"
                />

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">

                  <h3 className="text-white font-bold">
                    {p.title}
                  </h3>

                  <p className="text-sm text-gray-200">
                    {p.description?.slice(0,80)}...
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </div>

  );

}

export default GuideDetails;