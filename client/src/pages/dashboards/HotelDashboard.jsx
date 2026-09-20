import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./HotelDashboard.css";

function HotelDashboard(){

  const navigate = useNavigate();

  const [hotel,setHotel] = useState(null);
  const [rooms,setRooms] = useState([]);
  const [bookings,setBookings] = useState([]);
  const [open,setOpen] = useState(false);
  const [loading,setLoading] = useState(true);

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

  // ================= FETCH =================
  const fetchData = async()=>{
    try{

      const hotelRes = await API.get("/hotels/my-hotel");

      if(!hotelRes.data){
        setHotel(null);
        setLoading(false);
        return;
      }

      setHotel(hotelRes.data);

      const roomRes = await API.get(`/rooms/hotel/${hotelRes.data._id}`);
      setRooms(Array.isArray(roomRes.data) ? roomRes.data : []);

      const bookingRes = await API.get("/bookings/provider");
      const rawB = bookingRes.data?.bookings || bookingRes.data;
      const hotelBookings = (Array.isArray(rawB) ? rawB : []).filter(
        b => b && b.serviceType === "hotel"
      );

      setBookings(hotelBookings);

    }catch(err){
      console.warn("Hotel dashboard fetch notice:", err.message);
      setRooms([]);
      setBookings([]);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchData();
  },[]);

  // ================= CALCULATIONS =================
  const totalBookings = bookings.length;

  const totalRevenue = bookings.reduce(
    (sum,b)=> sum + (b.totalAmount || 0),0
  );

  const myShare = Math.floor(totalRevenue * 0.75);

  // ================= ACTIONS =================
  const deleteRoom = async(id)=>{
    await API.delete(`/rooms/delete/${id}`);
    fetchData();
  };

  const logout = ()=>{
    localStorage.clear();
    navigate("/login");
  };

  if(loading){
    return(
      <div className="h-screen flex items-center justify-center text-xl">
        Loading dashboard...
      </div>
    )
  }

  return(

    <div className="hotel-dashboard-container">

      {/* ================= HEADER ================= */}
      <div className="hotel-header">

        <div className="hotel-logo-wrapper">
          <h1 className="hotel-title">
            Moulyas Hotels ✨
          </h1>
          <p className="hotel-subtitle">Manage rooms, tracking bookings & revenue share</p>
        </div>

        {/* PROFILE */}
        <div className="profile-container">

          <img
            src={getImage(user?.profileImage)}
            className="profile-avatar"
            onClick={()=>setOpen(!open)}
          />

          {/* DROPDOWN */}
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


      {/* ================= NO HOTEL ================= */}
      {!hotel && (
        <div className="no-hotel-card">
          <span className="no-hotel-icon">🏨</span>
          <h2 className="no-hotel-title">
            Register Your Hotel
          </h2>
          <p className="no-hotel-desc">
            Get started by registering your hotel first to start listing rooms and accepting bookings!
          </p>

          <button
            onClick={()=>navigate("/add-hotel")}
            className="create-hotel-btn"
          >
            Create Hotel
          </button>

        </div>
      )}


      {/* ================= HOTEL ================= */}
      {hotel && (

        <>
          {/* HOTEL CARD */}
          <div className="hotel-profile-card">

            {hotel.images?.[0] && (
              <img
                src={getImage(hotel.images[0])}
                className="hotel-profile-img"
              />
            )}

            <div className="hotel-profile-info">
              <span className="hotel-profile-tag">Hotel Profile</span>
              <h2 className="hotel-profile-name">
                {hotel.hotelName}
              </h2>

              <p className="hotel-profile-loc">
                📍 {hotel.location}
              </p>
              
              <p className="hotel-profile-desc">
                Welcome to your dashboard. This page provides full control over room inventory, real-time availability toggles, and financial metrics.
              </p>
            </div>

          </div>


          {/* ================= STATS ================= */}
          <div className="stats-grid">

            {[
              {title:"Total Bookings",value:totalBookings,desc:"Number of reserved rooms",colors:{start:"#3b82f6",end:"#4f46e5"},shadow:"shadow-blue-200",icon:"📅"},
              {title:"Total Revenue",value:`₹${totalRevenue}`,desc:"Accumulated customer payments",colors:{start:"#10b981",end:"#059669"},shadow:"shadow-emerald-200",icon:"💰"},
              {title:"Your Share (75%)",value:`₹${myShare}`,desc:"Your profit (net platform fee)",colors:{start:"#ec4899",end:"#db2777"},shadow:"shadow-pink-200",icon:"📈"}
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


          {/* ADD ROOM */}
          <div className="rooms-section-header">
            <h2 className="rooms-section-title">🛏 Available Rooms</h2>
            
            <button
              onClick={()=>navigate("/add-room")}
              className="add-room-btn"
            >
              + Add Room
            </button>
          </div>


          {/* ROOMS */}
          <div className="rooms-grid">

            {rooms.length === 0 ? (
              <div className="no-rooms-card">
                <p>No rooms added yet. Click "+ Add Room" to list your hotel rooms.</p>
              </div>
            ) : (
              rooms.map(room=>(

                <div key={room._id} className="room-card">

                  <div className="room-card-img-wrapper">
                    <img
                      src={getImage(room.roomImages?.[0])}
                      className="room-card-img"
                    />
                    <span className="room-card-price">
                      ₹{room.price}/day
                    </span>
                  </div>

                  <h3 className="room-card-title">
                    {room.title}
                  </h3>

                  <p className="room-card-desc">
                    {room.description || "Fully furnished luxurious room equipped with modern amenities."}
                  </p>

                  <button
                    onClick={()=>deleteRoom(room._id)}
                    className="delete-room-btn"
                  >
                    Delete Room
                  </button>

                </div>

              ))
            )}

          </div>


          {/* BOOKINGS */}
          <div className="bookings-section">

            <div className="bookings-header">
              <h2 className="bookings-title">
                📅 Realtime Bookings
              </h2>
              <p className="bookings-subtitle">Live feed of reservations, client information, and transaction status.</p>
            </div>

            {bookings.length === 0 ? (
              <div className="no-bookings">
                <span className="no-bookings-icon">😴</span>
                <p className="no-bookings-text">No bookings received yet. Share your hotel on social platforms!</p>
              </div>
            ) : (
              <div className="bookings-grid">

                {bookings.map(b=>(

                  <div key={b._id} className="booking-card">
                    <div className="booking-card-header">
                      <p className="booking-card-name">
                        {b.travelerId?.name}
                      </p>
                      <span className={`booking-card-status ${
                        b.paymentStatus === "paid"
                          ? "status-paid"
                          : "status-pending"
                      }`}>
                        {b.paymentStatus}
                      </span>
                    </div>

                    <p className="booking-card-date">
                      📅 {new Date(b.travelDate).toDateString()}
                    </p>

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

        </>
      )}

    </div>

  );

}

export default HotelDashboard;