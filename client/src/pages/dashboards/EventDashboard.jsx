import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./EventDashboard.css";

function EventDashboard(){

  const navigate = useNavigate();

  const [events,setEvents] = useState([]);
  const [bookings,setBookings] = useState([]);
  const [earnings,setEarnings] = useState(0);
  const [loading,setLoading] = useState(true);
  const [open,setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const BASE_URL = "http://localhost:5000";

  // ✅ IMAGE FIX FUNCTION (NO DUPLICATES)
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

  // =====================
  // FETCH DATA
  // =====================
  const fetchData = async()=>{
    try{
      const [eventRes,bookingRes,earningRes] = await Promise.all([
        API.get("/events/my-events"),
        API.get("/bookings/provider"),
        API.get("/payments/provider-earnings")
      ]);

      setEvents(Array.isArray(eventRes.data) ? eventRes.data : []);
      const rawB = bookingRes.data?.bookings || bookingRes.data;
      setBookings(Array.isArray(rawB) ? rawB : []);
      setEarnings(earningRes.data?.totalEarnings || 0);

    }catch(err){
      console.warn("Event dashboard fetch notice:", err.message);
      setEvents([]);
      setBookings([]);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchData();
  },[]);


  // =====================
  // STATS
  // =====================
  const safeEvents = Array.isArray(events) ? events : [];
  const upcomingEvents = safeEvents.filter(
    e => e && e.eventDate && new Date(e.eventDate) > new Date()
  );

  const totalBookings = Array.isArray(bookings) ? bookings.length : 0;

  const logout = ()=>{
    localStorage.clear();
    navigate("/login");
  };

  if(loading){
    return(
      <div className="flex justify-center items-center h-screen text-xl">
        Loading dashboard...
      </div>
    )
  }

  const myShare = Math.floor(earnings * 0.75);

  return (
    <div className="event-dashboard-container">

      {/* ================= HEADER ================= */}
      <div className="event-header">

        <div className="logo-section">
          <h1 className="event-title">
            Moulyas Events 🎪
          </h1>
          <p className="event-subtitle">Create events, manage reservations, track ticket sales & review revenue</p>
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
      {events.length > 0 && (
        <div className="stats-grid">
          {[
            {title:"Total Events",value:events.length,desc:"Created listings",colors:{start:"#7c3aed",end:"#4f46e5"},icon:"🎪"},
            {title:"Upcoming Events",value:upcomingEvents.length,desc:"Active schedules",colors:{start:"#10b981",end:"#0d9488"},icon:"📅"},
            {title:"Total Bookings",value:totalBookings,desc:"Sold tickets count",colors:{start:"#2563eb",end:"#06b6d4"},icon:"🎟"},
            {title:"Net Share (75%)",value:`₹${myShare}`,desc:"Profit after system fee",colors:{start:"#ec4899",end:"#db2777"},icon:"📈"}
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

      {/* ================= ACTIONS ================= */}
      <div className="actions-bar">
        <h2 className="actions-title">🎉 My Created Events</h2>
        
        <div className="action-buttons">
          <button
            onClick={()=>navigate("/manage-events")}
            className="btn-secondary"
          >
            ⚙ Manage Listings
          </button>
          <button
            onClick={()=>navigate("/event-bookings")}
            className="btn-secondary"
          >
            📋 Bookings list
          </button>
          <button
            onClick={()=>navigate("/create-event")}
            className="btn-primary"
          >
            + Create Event
          </button>
        </div>
      </div>

      {/* ================= EVENTS GRID ================= */}
      {events.length === 0 ? (
        <div className="no-events-card">
          <span className="no-events-icon">🎉</span>
          <h2 className="no-events-title">No Events Listed</h2>
          <p className="no-events-desc">Get started by creating your first event to start accepting ticket bookings!</p>
          <button
            onClick={() => navigate("/create-event")}
            className="create-first-event-btn"
          >
            Create Your First Event
          </button>
        </div>
      ) : (
        <div className="events-grid">
          {events.map(event=>{
            const eventBookings = bookings.filter(
              b => b.serviceId?.toString() === event._id?.toString()
            ).length;

            return(
              <div key={event._id} className="event-card">
                <div className="event-card-img-wrapper">
                  <img
                    src={
                      event.images?.length
                      ? getImage(event.images[0])
                      : "https://via.placeholder.com/400"
                    }
                    onError={(e)=>{
                      e.target.src = "https://via.placeholder.com/400";
                    }}
                    className="event-card-img"
                  />
                  <span className="event-card-price">
                    ₹{event.price}
                  </span>
                </div>

                <div className="event-card-content">
                  <h4 className="event-card-title">
                    {event.title}
                  </h4>

                  <p className="event-card-loc">
                    📍 {event.location}
                  </p>

                  <p className="event-card-date">
                    📅 {
                      event.eventDate
                      ? new Date(event.eventDate).toLocaleDateString("en-IN", {
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric"
                        })
                      : "No Date"
                    }
                  </p>

                  <div className="event-card-footer">
                    <span className="event-card-bookings">
                      🎟 Bookings: {eventBookings}
                    </span>
                    <button
                      onClick={()=>navigate(`/edit-event/${event._id}`)}
                      className="edit-event-btn"
                    >
                      Edit
                    </button>
                  </div>
                </div>

              </div>
            )
          })}
        </div>
      )}

    </div>
  );
}

export default EventDashboard;