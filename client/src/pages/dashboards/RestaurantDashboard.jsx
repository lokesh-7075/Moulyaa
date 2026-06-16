import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

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
    if(!path) return "https://via.placeholder.com/300";

    if(path.startsWith("http")) return path;

    const clean = path.replace(/\\/g,"/").replace(/^\/+/,"");

    if(clean.startsWith("uploads")){
      return `${BASE_URL}/${clean}`;
    }

    return `${BASE_URL}/uploads/${clean}`;
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
      setFoods(res.data || []);

    }catch(err){

      if(err.response?.status === 404){
        navigate("/create-restaurant");
        return;
      }

      console.error(err);

    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchFoods(); },[]);

  // ================= BOOKINGS =================
  const loadBookings = async(foodId)=>{
    try{

      const res = await API.get(`/bookings/food/${foodId}`);

      const data = res.data || [];

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

  return(

    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 bg-white/60 backdrop-blur-xl p-4 rounded-2xl shadow">

        <h1 className="text-3xl font-bold text-pink-600">
          🍽 Restaurant Dashboard
        </h1>

        {/* PROFILE */}
        <div className="relative">

          <img
            src={getImage(user?.profileImage)}
            onError={(e)=>{
              e.target.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
            }}
            onClick={()=>setOpen(!open)}
            className="w-12 h-12 rounded-full cursor-pointer border hover:scale-110 transition object-cover"
          />

          {open && (
            <div className="absolute right-0 mt-3 bg-white p-4 rounded-xl shadow w-60">

              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>

              <button
                onClick={logout}
                className="mt-3 w-full bg-red-500 text-white py-1 rounded hover:bg-red-600"
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

      {/* ADD FOOD */}
      <button
        onClick={()=>navigate("/add-food")}
        className="mb-6 px-6 py-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-xl shadow hover:scale-105 transition"
      >
        + Add Food 💖
      </button>

      {/* GRID */}
      <div className="grid md:grid-cols-3 gap-8">

        {foods.map(food=>{

          const foodBookings = bookings[food._id] || [];

          return(

            <div
              key={food._id}
              className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-4 hover:shadow-2xl hover:-translate-y-1 transition"
            >

              {/* IMAGE */}
              <img
                src={getImage(food.foodImages?.[0])}
                onError={(e)=>{
                  e.target.src = "https://via.placeholder.com/300";
                }}
                className="h-40 w-full object-cover rounded-xl"
              />

              {/* INFO */}
              <h3 className="font-bold mt-3 text-lg">
                {food.foodName}
              </h3>

              <p className="text-sm text-gray-500">
                {food.category}
              </p>

              <p className="text-pink-600 font-bold">
                ₹{food.price}
              </p>

              <p className={`text-sm ${
                food.availability ? "text-green-600" : "text-red-500"
              }`}>
                {food.availability ? "Available" : "Unavailable"}
              </p>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-3">

                <button
                  onClick={()=>toggleAvailability(food)}
                  className="flex-1 bg-yellow-400 text-white py-1 rounded hover:bg-yellow-500"
                >
                  Toggle
                </button>

                <button
                  onClick={()=>deleteFood(food._id)}
                  className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>

              </div>

              {/* VIEW ORDERS */}
              <button
                onClick={()=>navigate("/restaurant-orders")}
                className="mt-3 w-full bg-green-500 text-white py-1 rounded hover:bg-green-600"
              >
                View All Orders 🍽
              </button>

              {/* BOOKINGS LIST */}
              {foodBookings.length > 0 && (

                <div className="mt-4 space-y-2">

                  {foodBookings.map(b=>(

                    <div key={b._id} className="bg-white p-2 rounded shadow text-sm">

                      <p className="font-semibold">
                        {b.travelerId?.name}
                      </p>

                      <p className="text-gray-500">
                        {b.travelerId?.email}
                      </p>

                      <p>₹{b.totalAmount}</p>

                      <p className="text-green-600">
                        Your Share: ₹{b.myShare}
                      </p>

                      <p className={`text-xs ${
                        b.paymentStatus === "paid"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}>
                        Payment: {b.paymentStatus}
                      </p>

                      <p className="text-xs text-blue-500">
                        {b.bookingStatus}
                      </p>

                    </div>

                  ))}

                </div>

              )}

            </div>

          )

        })}

      </div>

    </div>

  )

}

export default RestaurantDashboard;