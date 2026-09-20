import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./VehicleDashboard.css";

function VehicleDashboard(){

  const navigate = useNavigate();

  const [vehicles,setVehicles] = useState([]);
  const [bookings,setBookings] = useState([]);
  const [selectedVehicle,setSelectedVehicle] = useState(null);
  const [allBookings,setAllBookings] = useState([]);
  const [loading,setLoading] = useState(true);
  const [open,setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const BASE_URL = "http://localhost:5000";

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

  // ✅ DATE FIX
  const formatDate = (date)=>{
    if(!date) return "No Date";
    const d = new Date(date);
    if(isNaN(d)) return "Invalid Date";
    return d.toLocaleDateString("en-IN");
  };

  const fetchData = async () => {
    try{
      const [vehicleRes,bookingRes] = await Promise.all([
        API.get("/vehicles/my-vehicles"),
        API.get("/bookings/provider")
      ]);

      setVehicles(Array.isArray(vehicleRes.data) ? vehicleRes.data : []);

      const rawB = bookingRes.data?.bookings || bookingRes.data;
      const vehicleBookings = (Array.isArray(rawB) ? rawB : []).filter(
        b => b && b.serviceType === "vehicle"
      );

      setAllBookings(vehicleBookings);

    }catch(error){
      console.warn("Vehicle dashboard fetch notice:", error.message);
      setVehicles([]);
      setAllBookings([]);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchData(); },[]);

  const viewBookings = (vehicleId)=>{
    const filtered = allBookings.filter(
      b => b.serviceId?.toString() === vehicleId?.toString()
    );
    setBookings(filtered);
    setSelectedVehicle(vehicleId);
  };

  const logout = ()=>{
    localStorage.clear();
    navigate("/login");
  };

  if(loading){
    return (
      <div className="h-screen flex items-center justify-center text-xl">
        Loading dashboard...
      </div>
    );
  }

  // Calculations
  const totalBookings = allBookings.length;
  const totalRevenue = allBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const myShare = Math.floor(totalRevenue * 0.75);

  return(

    <div className="vehicle-dashboard-container">

      {/* ================= HEADER ================= */}
      <div className="vehicle-header">

        <div className="logo-section">
          <h1 className="vehicle-title">
            Moulyas Vehicles 🚗
          </h1>
          <p className="vehicle-subtitle">Manage fleet inventory, check rental availability & track earnings</p>
        </div>

        <div className="action-profile-group">
          <button
            onClick={() => navigate("/add-vehicle")}
            className="add-vehicle-btn"
          >
            + Add Vehicle
          </button>
          
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

      </div>

      {/* ================= STATS ================= */}
      {vehicles.length > 0 && (
        <div className="stats-grid">

          {[
            {title:"Fleet Bookings",value:totalBookings,desc:"Total rental days booked",colors:{start:"#4f46e5",end:"#2563eb"},icon:"🚗"},
            {title:"Total Revenue",value:`₹${totalRevenue}`,desc:"Gross vehicle rental earnings",colors:{start:"#059669",end:"#0d9488"},icon:"💰"},
            {title:"Your Share (75%)",value:`₹${myShare}`,desc:"Net profit after service fee",colors:{start:"#db2777",end:"#c084fc"},icon:"📈"}
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

      {/* ================= VEHICLE CATALOGUE ================= */}
      {vehicles.length === 0 ? (
        <div className="no-fleet-card">
          <span className="no-fleet-icon">🚗</span>
          <h2 className="no-fleet-title">No Vehicles Registered</h2>
          <p className="no-fleet-desc">Get started by registering your fleet to let travelers rent your vehicles.</p>
          <button
            onClick={() => navigate("/add-vehicle")}
            className="create-fleet-btn"
          >
            Add Your First Vehicle
          </button>
        </div>
      ) : (
        <div>
          <h2 className="fleet-section-title">🚘 My Registered Fleet</h2>
          
          <div className="fleet-grid">
            {vehicles.map(vehicle=>{
              const vehicleBookings = allBookings.filter(
                b => b.serviceId?.toString() === vehicle._id?.toString()
              );

              return(
                <div key={vehicle._id} className="vehicle-card">
                  <div className="vehicle-card-img-wrapper">
                    <img
                      src={getImage(vehicle.images?.[0])}
                      className="vehicle-card-img"
                    />
                    <span className="vehicle-card-price">
                      ₹{vehicle.pricePerDay}/day
                    </span>
                  </div>

                  <h3 className="vehicle-card-name">{vehicle.vehicleName}</h3>
                  
                  <div className="vehicle-card-meta">
                    <span>📍 {vehicle.location}</span>
                    <span className="vehicle-card-type">{vehicle.type}</span>
                  </div>

                  <button
                    onClick={()=>viewBookings(vehicle._id)}
                    className={`view-bookings-btn ${
                      selectedVehicle === vehicle._id 
                        ? "view-bookings-btn-active" 
                        : "view-bookings-btn-inactive"
                    }`}
                  >
                    {vehicleBookings.length} Bookings
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ================= SELECTED VEHICLE BOOKINGS ================= */}
      {selectedVehicle && (
        <div className="bookings-section">
          <div className="bookings-header">
            <h2 className="bookings-title">
              📅 Vehicle Rental Bookings
            </h2>
            <p className="bookings-subtitle">Details of bookings and rental schedule for the selected vehicle.</p>
          </div>

          {bookings.length === 0 ? (
            <div className="no-bookings">
              <span className="no-bookings-icon">😴</span>
              <p className="no-bookings-text">No bookings received for this vehicle yet.</p>
            </div>
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

                  <p className="booking-card-date">📅 Rental Date: {formatDate(b.travelDate)}</p>
                  
                  <div className="booking-card-footer">
                    <div>
                      <p className="booking-card-meta-label">Gross Total</p>
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
      )}

    </div>
  )
}

export default VehicleDashboard;