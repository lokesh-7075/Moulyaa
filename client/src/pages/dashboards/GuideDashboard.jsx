import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./GuideDashboard.css";

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
    const clean = path.replace(/\\/g,"/");
    const index = clean.indexOf("uploads/");
    if(index !== -1){
      return `${BASE_URL}/${clean.substring(index)}`;
    }
    return `${BASE_URL}/uploads/${clean.replace(/^\/+/,"")}`;
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
      setBookings(Array.isArray(res.data) ? res.data : []);
    }catch{
      setBookings([]);
    }
  };

  const fetchPosts = async (guideId)=>{
    try{
      const res = await API.get(`/guide-posts/${guideId}`);
      setPosts(Array.isArray(res.data) ? res.data : []);
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

    <div className="guide-dashboard-container">

      {/* ================= HEADER ================= */}
      <div className="guide-header">

        <div className="logo-section">
          <h1 className="guide-title">
            Moulyas Tour Guide 🧭
          </h1>
          <p className="guide-subtitle">Manage availability, view traveler bookings & edit posts</p>
        </div>

        {/* PROFILE */}
        <div className="profile-container">

          <img
            src={getImage(user?.profileImage)}
            className="profile-avatar"
            onClick={()=>setOpen(!open)}
          />

          {open && (
            <div className="profile-dropdown">
              <div className="dropdown-user-info">
                <img
                  src={getImage(user?.profileImage)}
                  className="dropdown-user-img"
                />
                <div className="dropdown-user-details">
                  <p className="dropdown-user-name">{user?.name}</p>
                  <p className="dropdown-user-email">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="logout-btn"
              >
                Logout
              </button>
            </div>
          )}

        </div>

      </div>

      {/* ================= STATS ================= */}
      {guide && (
        <div className="stats-grid">

          {[
            {title:"Tour Bookings",value:totalBookings,desc:"Total reservations received",colors:{start:"#4f46e5",end:"#3730a3"},icon:"📅"},
            {title:"Gross Earnings",value:`₹${totalRevenue}`,desc:"Total customer billing amount",colors:{start:"#0d9488",end:"#0f766e"},icon:"💰"},
            {title:"Your Share (75%)",value:`₹${myShare}`,desc:"Net profit after service fee",colors:{start:"#db2777",end:"#b5179e"},icon:"📈"}
          ].map((card,i)=>(
            <div key={i}
              className="stat-card"
              style={{
                "--gradient-start": card.colors.start,
                "--gradient-end": card.colors.end
              }}
            >
              <div className="stat-card-top">
                <div>
                  <p className="stat-card-title">{card.title}</p>
                  <h2 className="stat-card-value">{card.value}</h2>
                </div>
                <span className="stat-card-icon">{card.icon}</span>
              </div>
              <p className="stat-card-desc">{card.desc}</p>
            </div>
          ))}

        </div>
      )}

      {/* ================= PROFILE BILLBOARD ================= */}
      {guide && (
        <div className="profile-billboard">

          <img
            src={getImage(guide.images?.[0])}
            className="profile-billboard-img"
          />

          <div className="profile-billboard-info">
            <span className="profile-billboard-tag">Guide Profile</span>
            <h3 className="profile-billboard-name">{guide.guideName}</h3>
            
            <div className="profile-billboard-meta">
              <p>📍 {guide.location}</p>
              <p>💬 {guide.languages?.join(", ")}</p>
              <p>🧠 {guide.experience} Years Exp.</p>
              <p className="guide-rate">₹{guide.pricePerDay}/Day</p>
            </div>

            <div className="profile-billboard-actions">
              <button
                onClick={() => navigate(`/edit-guide/${guide._id}`)}
                className="edit-profile-btn"
              >
                Edit Profile
              </button>

              <button
                onClick={toggleAvailability}
                className={`availability-toggle-btn ${
                  guide.availability ? "toggle-active" : "toggle-offline"
                }`}
              >
                {guide.availability ? "Active Availability" : "Offline Status"}
              </button>
            </div>

          </div>

        </div>
      )}

      {/* ================= BOOKINGS ================= */}
      <div className="bookings-section">
        <h2 className="bookings-title">📅 Tour Bookings</h2>

        {bookings.length === 0 ? (
          <p className="no-bookings">No client reservations received yet.</p>
        ) : (
          <div className="bookings-grid">
            {bookings.map(b=>(
              <div key={b._id} className="booking-card">
                <div className="booking-card-header">
                  <p className="booking-card-name">{b.travelerId?.name}</p>
                  <span className={`booking-card-status ${
                    b.paymentStatus === "paid"
                      ? "status-paid"
                      : "status-pending"
                  }`}>
                    {b.paymentStatus}
                  </span>
                </div>

                <p className="booking-card-date">📅 Tour Date: {formatDate(b.travelDate)}</p>
                <p className="booking-card-people">👥 Group Size: {b.numberOfPeople} People</p>

                <div className="booking-card-footer">
                  <div>
                    <p className="booking-card-meta-label">Customer Paid</p>
                    <p className="booking-card-meta-val">₹{b.totalAmount}</p>
                  </div>
                  <div>
                    <p className="share-label">Your Share (75%)</p>
                    <p className="share-val">₹{Math.floor(b.totalAmount * 0.75)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= POSTS ================= */}
      <div className="feed-section">

        <div className="feed-header">
          <div className="feed-header-left">
            <h2 className="feed-title">📸 My Interactive Feed</h2>
            <p className="feed-subtitle">Upload posts and tour highlights for travelers to see.</p>
          </div>

          <button
            onClick={() => navigate("/create-guide-post")}
            className="add-feed-btn"
          >
            + Add Feed Post
          </button>
        </div>

        <div className="feed-grid">
          {posts.length > 0 ? (
            posts.map(p=>(
              <div key={p._id} className="feed-card">
                <div className="feed-card-img-wrapper">
                  <img
                    src={getImage(p.images?.[0])}
                    className="feed-card-img"
                  />
                </div>

                <div className="feed-card-content">
                  <h3 className="feed-card-title">{p.title}</h3>
                  <p className="feed-card-date">📅 Posted: {formatDate(p.createdAt)}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="no-feed-posts">
              No feed posts created yet. Keep your profile active!
            </p>
          )}
        </div>

      </div>

    </div>

  );
}

export default GuideDashboard;