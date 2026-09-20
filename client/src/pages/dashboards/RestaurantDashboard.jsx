import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";
import "./RestaurantDashboard.css";

function RestaurantDashboard(){

  const navigate = useNavigate();

  const [foods,setFoods] = useState([]);
  const [bookings,setBookings] = useState({});
  const [loading,setLoading] = useState(true);
  const [open,setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const BASE_URL = "http://localhost:5000";

  // ✅ IMAGE FIX (NO DUPLICATES)
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
  const fetchFoods = async()=>{
    try{

      const restaurantRes = await API.get("/restaurants/my-restaurant");

      if(!restaurantRes.data){
        navigate("/create-restaurant");
        return;
      }

      const res = await API.get("/foods/my-foods");
      setFoods(Array.isArray(res.data) ? res.data : []);

    }catch(err){

      if(err.response?.status === 404){
        navigate("/create-restaurant");
        return;
      }

      console.warn("Restaurant foods fetch notice:", err.message);
      setFoods([]);

    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchFoods(); },[]);

  // ================= BOOKINGS =================
  const loadBookings = async(foodId)=>{
    try{

      const res = await API.get(`/bookings/food/${foodId}`);

      const raw = res.data?.bookings || res.data;
      const data = Array.isArray(raw) ? raw : [];

      const enriched = data.map(b=>({
        ...b,
        myShare: Math.floor((b.totalAmount || 0) * 0.75)
      }));

      setBookings(prev=>({
        ...prev,
        [foodId]: enriched
      }));

    }catch(err){
      console.error(err);
    }
  };

  // Load bookings whenever foods list changes
  useEffect(()=>{
    if(foods.length > 0){
      foods.forEach(f => {
        loadBookings(f._id);
      });
    }
  },[foods]);

  // ================= ACTIONS =================
  const deleteFood = async(id)=>{
    await API.delete(`/foods/delete/${id}`);
    fetchFoods();
  };

  const toggleAvailability = async(food)=>{
    await API.put(`/foods/update/${food._id}`,{
      availability: !food.availability
    });
    fetchFoods();
  };

  const logout = ()=>{
    localStorage.clear();
    navigate("/login");
  };

  if(loading){
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Loading...
      </div>
    );
  }

  // Calculations
  const allOrders = Object.values(bookings).flat();
  const totalOrders = allOrders.length;
  const totalRevenue = allOrders.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
  const totalEarnings = allOrders.reduce((sum, b) => sum + (b.myShare || 0), 0);

  return(

    <div className="restaurant-dashboard-container">

      {/* ================= HEADER ================= */}
      <div className="restaurant-header">

        <div className="logo-section">
          <h1 className="restaurant-title">
            Moulyas Restaurant 🍽
          </h1>
          <p className="restaurant-subtitle">Manage your food menu, track customer orders & monitor restaurant earnings</p>
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

      {/* ================= ANALYTICS ================= */}
      {foods.length > 0 && (
        <div className="stats-grid">
          {[
            {title:"Total Orders",value:totalOrders,desc:"Food reservations booked",colors:{start:"#f97316",end:"#f59e0b"},icon:"🍔"},
            {title:"Total Sales",value:`₹${totalRevenue}`,desc:"Gross restaurant earnings",colors:{start:"#f43f5e",end:"#ec4899"},icon:"💸"},
            {title:"Your Share (75%)",value:`₹${totalEarnings}`,desc:"Net profit after service fee",colors:{start:"#10b981",end:"#0d9488"},icon:"📈"}
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

      {/* ================= ACTIONS & FOOD ITEMS ================= */}
      <div className="menu-section-header">
        <h2 className="menu-section-title">🍲 Restaurant Menu</h2>
        
        <div className="action-buttons-group">
          <button
            onClick={()=>navigate("/restaurant-orders")}
            className="view-orders-btn"
          >
            📋 View Orders
          </button>
          <button
            onClick={()=>navigate("/add-food")}
            className="add-food-btn"
          >
            + Add Food Item
          </button>
        </div>
      </div>

      {foods.length === 0 ? (
        <div className="no-food-card">
          <span className="no-food-icon">🍲</span>
          <h2 className="no-food-title">No Food Listed</h2>
          <p className="no-food-desc">Get started by listing your restaurant's delicious dishes!</p>
          <button
            onClick={() => navigate("/add-food")}
            className="create-food-btn"
          >
            Add Your First Food Item
          </button>
        </div>
      ) : (
        <div className="menu-grid">
          {foods.map(food=>{
            const foodBookings = bookings[food._id] || [];

            return(
              <div key={food._id} className="menu-card">
                {/* IMAGE */}
                <div className="menu-card-img-wrapper">
                  <img
                    src={getImage(food.foodImages?.[0])}
                    onError={(e)=>{
                      e.target.src = "https://via.placeholder.com/300";
                    }}
                    className="menu-card-img"
                  />
                  <span className="menu-card-price">
                    ₹{food.price}
                  </span>
                </div>

                {/* INFO */}
                <h3 className="menu-card-name">
                  {food.foodName}
                </h3>

                <div className="menu-card-meta">
                  <p className="menu-card-category">
                    {food.category}
                  </p>
                  <span className={`menu-card-status ${
                    food.availability ? "status-instock" : "status-soldout"
                  }`}>
                    {food.availability ? "In Stock" : "Sold Out"}
                  </span>
                </div>

                {/* ACTIONS */}
                <div className="menu-card-actions">
                  <button
                    onClick={()=>toggleAvailability(food)}
                    className="toggle-availability-btn"
                  >
                    Toggle Stock
                  </button>

                  <button
                    onClick={()=>deleteFood(food._id)}
                    className="delete-food-btn"
                  >
                    Delete Item
                  </button>
                </div>

                {/* BOOKINGS LIST */}
                {foodBookings.length > 0 && (
                  <div className="recent-orders-section">
                    <p className="recent-orders-title">Recent Food Orders</p>
                    <div className="recent-orders-list">
                      {foodBookings.map(b=>(
                        <div key={b._id} className="recent-order-item">
                          <div className="recent-order-header">
                            <span className="recent-order-name">{b.travelerId?.name}</span>
                            <span className="recent-order-share">₹{b.myShare}</span>
                          </div>
                          <div className="recent-order-meta">
                            <span>Status: {b.bookingStatus}</span>
                            <span>Payment: {b.paymentStatus}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )
          })}
        </div>
      )}

    </div>

  )

}

export default RestaurantDashboard;