import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function GuideDashboard() {

  const navigate = useNavigate();

  const [guide, setGuide] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const BASE_URL = "http://localhost:5000";

  // ================= IMAGE FIX =================
  const getImage = (path)=>{
    if(!path) return "https://cdn-icons-png.flaticon.com/512/847/847969.png";

    if(path.startsWith("http")) return path;

    let clean = path.replace(/\\/g,"/").replace(/^\/+/,"");

    if(!clean.startsWith("uploads")){
      clean = "uploads/" + clean;
    }

    return `${BASE_URL}/${clean}`;
  };

  // ================= DATE FIX =================
  const formatDate = (date)=>{
    if(!date) return "No Date";

    const d = new Date(date);

    if(isNaN(d)) return "Invalid Date";

    return d.toLocaleDateString("en-IN");
  };

  // ================= FETCH =================
  const fetchGuide = async ()=>{
    try{
      const res = await API.get("/guides/my-profile");

      if(!res.data){
        navigate("/create-guide");
        return null;
      }

      setGuide(res.data);
      return res.data;

    }catch{
      navigate("/create-guide");
      return null;
    }
  };

  const fetchBookings = async ()=>{
    try{
      const res = await API.get("/guides/my-bookings");
      setBookings(res.data || []);
    }catch{
      setBookings([]);
    }
  };

  const fetchPosts = async (guideId)=>{
    try{
      const res = await API.get(`/guide-posts/${guideId}`);
      setPosts(res.data || []);
    }catch{
      setPosts([]);
    }
  };

  useEffect(()=>{
    const load = async ()=>{
      const g = await fetchGuide();
      if(g){
        await fetchBookings();
        await fetchPosts(g._id);
      }
      setLoading(false);
    };
    load();
  },[]);

  // ================= CALCULATIONS =================
  const totalBookings = bookings.length;

  const totalRevenue = bookings.reduce(
    (sum,b)=> sum + (b.totalAmount || 0),0
  );

  const myShare = Math.floor(totalRevenue * 0.75);

  // ================= ACTIONS =================
  const toggleAvailability = async ()=>{
    await API.put(`/guides/update/${guide._id}`,{
      availability: !guide.availability
    });
    setGuide({...guide, availability: !guide.availability});
  };

  const logout = ()=>{
    localStorage.clear();
    navigate("/login");
  };

  if(loading){
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  return(

    <div className="min-h-screen bg-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow">

        <h1 className="text-3xl font-extrabold text-pink-600">
          Moulyas ✨
        </h1>

        <div className="relative">

          <img
            src={getImage(user?.profileImage)}
            onError={(e)=>{
              e.target.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
            }}
            className="w-12 h-12 rounded-full cursor-pointer border hover:scale-110 transition object-cover"
            onClick={()=>setOpen(!open)}
          />

          {open && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow p-4">

              <div className="flex gap-3 mb-3">
                <img
                  src={getImage(user?.profileImage)}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="w-full text-red-500 hover:bg-red-50 p-2 rounded-lg"
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        {[
          {title:"Bookings",value:totalBookings},
          {title:"Revenue",value:`₹${totalRevenue}`},
          {title:"Your Share",value:`₹${myShare}`}
        ].map((card,i)=>(
          <div key={i}
            className="bg-white border p-6 rounded-xl shadow hover:shadow-lg transition"
          >
            <p className="text-gray-500">{card.title}</p>
            <h2 className="text-3xl font-bold text-gray-800">{card.value}</h2>
          </div>
        ))}

      </div>

      {/* GUIDE PROFILE */}
      {guide && (
        <div className="bg-white p-6 rounded-xl shadow flex gap-6 mb-10">

          <img
            src={getImage(guide.images?.[0])}
            className="w-40 h-40 object-cover rounded-xl"
          />

          <div>
            <h3 className="text-2xl font-bold">{guide.guideName}</h3>
            <p className="text-gray-500">📍 {guide.location}</p>
            <p>💬 {guide.languages?.join(", ")}</p>
            <p>🧠 {guide.experience} yrs</p>

            <p className="text-orange-600 font-bold mt-2">
              ₹{guide.pricePerDay}/day
            </p>

            <div className="flex gap-3 mt-3">

              <button
                onClick={() => navigate(`/edit-guide/${guide._id}`)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Edit Guide
              </button>

              <button
                onClick={toggleAvailability}
                className={`px-4 py-2 rounded ${
                  guide.availability
                    ? "bg-green-500 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {guide.availability ? "Available" : "Unavailable"}
              </button>

            </div>

          </div>

        </div>
      )}

      {/* BOOKINGS */}
      <div className="mb-10">

        <h2 className="text-2xl font-bold mb-5">📅 Bookings</h2>

        <div className="grid md:grid-cols-3 gap-6">

          {bookings.map(b=>(

            <div key={b._id}
              className="bg-white border p-5 rounded-xl shadow hover:shadow-lg transition"
            >
              <p className="font-bold">{b.travelerId?.name}</p>

              {/* ✅ FIXED DATE */}
              <p className="text-gray-500 text-sm">
                {formatDate(b.travelDate)}
              </p>

              <p>👥 {b.numberOfPeople}</p>

              <p className="text-orange-600 font-bold">
                ₹{b.totalAmount}
              </p>

              <p className="text-green-600 text-sm">
                Your Share: ₹{Math.floor(b.totalAmount * 0.75)}
              </p>

              <p className={`text-xs mt-1 ${
                b.paymentStatus === "paid"
                  ? "text-green-600"
                  : "text-red-500"
              }`}>
                {b.paymentStatus}
              </p>

            </div>

          ))}

        </div>

      </div>

      {/* POSTS */}
      <div className="bg-white p-6 rounded-xl shadow">

        <div className="flex justify-between items-center mb-6">

          <h2 className="text-2xl font-bold text-gray-800">
            📸 My Posts
          </h2>

          <button
            onClick={() => navigate("/create-guide-post")}
            className="bg-pink-500 text-white px-4 py-2 rounded-lg shadow"
          >
            + Add Guide Post
          </button>

        </div>

        <div className="grid md:grid-cols-3 gap-6">

          {posts.length > 0 ? (
            posts.map(p=>(

              <div key={p._id}
                className="border rounded-xl overflow-hidden hover:shadow-lg transition"
              >

                <img
                  src={getImage(p.images?.[0])}
                  className="w-full h-48 object-cover"
                />

                <div className="p-4 bg-white">
                  <h3 className="font-semibold">{p.title}</h3>

                  {/* ✅ FIXED DATE */}
                  <p className="text-sm text-gray-500">
                    {formatDate(p.createdAt)}
                  </p>

                </div>

              </div>

            ))
          ) : (
            <p className="text-gray-500 col-span-3 text-center">
              No posts yet 🚀
            </p>
          )}

        </div>

      </div>

    </div>

  );
}

export default GuideDashboard;