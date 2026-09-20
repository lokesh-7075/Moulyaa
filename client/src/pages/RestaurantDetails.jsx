import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

import { getServiceImage } from "../services/imageHelper";

function RestaurantDetails(){

  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurant,setRestaurant] = useState(null);
  const [foods,setFoods] = useState([]);
  const [selectedFood,setSelectedFood] = useState(null);
  const [quantity,setQuantity] = useState(1);
  const [error,setError] = useState("");

  const DEFAULT_FOODS = [
    {
      _id: "food_01",
      foodName: "Shahi Royal Dal Makhani & Garlic Butter Naan",
      price: 450,
      description: "Slow-cooked black lentils for 24 hours with churned butter and royal spices.",
      foodImages: ["https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800&q=80"]
    },
    {
      _id: "food_02",
      foodName: "Nizami Hyderabadi Mutton Dum Biryani",
      price: 580,
      description: "Fragrant basmati rice infused with saffron and tender marinated cuts.",
      foodImages: ["https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=800&q=80"]
    },
    {
      _id: "food_03",
      foodName: "Paneer Tikka Charcoal Sizzler",
      price: 490,
      description: "Cottage cheese cubes marinated in Kashmiri chili and curd roasted in tandoor.",
      foodImages: ["https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=80"]
    }
  ];

  const safeFoods = Array.isArray(foods) && foods.length > 0 ? foods : DEFAULT_FOODS;

  useEffect(()=>{

    const fetchData = async()=>{
      try{
        const res1 = await API.get(`/restaurants/${id}`);
        if (res1.data) setRestaurant(res1.data);
      }catch(err){
        console.warn("Restaurant live fetch notice:", err.message);
      }

      try {
        const res2 = await API.get(`/foods/restaurant/${id}`);
        if (Array.isArray(res2.data) && res2.data.length > 0) {
          setFoods(res2.data);
        } else {
          setFoods(DEFAULT_FOODS);
        }
      } catch (err) {
        setFoods(DEFAULT_FOODS);
      }
    };

    if(id) fetchData();

  },[id]);

  // =========================
  // BOOKING FLOW
  // =========================
  const handleBooking = async()=>{

    setError("");

    if(!user){
      navigate("/login");
      return;
    }

    if(user.role !== "traveler"){
      setError("Only travelers can book");
      return;
    }

    if(!selectedFood){
      setError("Select a food item first");
      return;
    }

    try{

      const total = selectedFood.price * quantity;

      const providerId =
        restaurant.ownerId ||
        restaurant.providerId;

      if(!providerId){
        setError("Provider missing");
        return;
      }

      // CREATE BOOKING
      const res = await API.post("/bookings/create",{
        serviceId: restaurant._id,
        providerId,
        serviceType: "restaurant",
        numberOfPeople: quantity,
        totalAmount: total
      });

      const bookingId = res.data.booking._id;

      // GO TO PAYMENT PAGE
      navigate(`/payment/${bookingId}`);

    }catch(err){
      console.error(err);
      setError("Booking failed");
    }

  };

  if(!restaurant){
    return(
      <div className="h-screen flex justify-center items-center text-lg">
        Loading...
      </div>
    );
  }

  const total = selectedFood ? selectedFood.price * quantity : 0;

  return(

    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">

      <div className="h-[18vh]" />

      <div className="max-w-6xl mx-auto px-6 pb-16">

        {/* HERO */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-12 group">

          <img
            src={getImageUrl(restaurant.images?.[0])}
            className="w-full h-[350px] object-cover group-hover:scale-105 transition duration-700"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">

            <div className="p-6 text-white">
              <h1 className="text-3xl font-bold">
                {restaurant.restaurantName}
              </h1>
              <p>📍 {restaurant.location}</p>
            </div>

          </div>

        </div>

        {/* MENU */}
        <h2 className="text-2xl font-bold mb-6 text-center">
          🍔 Romantic Menu
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {safeFoods.map(item=>{

            const isSelected = selectedFood?._id === item._id;

            return(

              <div
                key={item._id}
                onClick={()=>setSelectedFood(item)}
                className={`rounded-2xl shadow p-4 cursor-pointer transition
                  ${isSelected
                    ? "bg-pink-100 scale-105 shadow-xl"
                    : "bg-white hover:shadow-xl hover:-translate-y-1"
                  }`}
              >

                <img
                  src={getImageUrl(item.foodImages?.[0])}
                  className="h-40 w-full object-cover rounded"
                />

                <h3 className="font-bold mt-2">{item.foodName}</h3>
                <p className="text-sm text-gray-500">{item.category}</p>

                <p className="text-pink-600 font-bold">₹{item.price}</p>

              </div>

            )

          })}

        </div>

        {/* BOOKING BOX */}
        <div className="mt-12 bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-6">

          <h3 className="text-xl font-bold mb-4 text-center">
            💖 Reserve Your Table
          </h3>

          <label>Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e)=>setQuantity(Number(e.target.value))}
            className="w-full border p-2 rounded mt-1 mb-4"
          />

          <p className="text-lg font-semibold text-center mb-4">
            Total: ₹{total}
          </p>

          {error && (
            <p className="text-red-500 text-center">{error}</p>
          )}

          <button
            onClick={handleBooking}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 text-white font-semibold shadow-lg hover:scale-105 transition"
          >
            Continue to Payment 💳
          </button>

        </div>

      </div>

    </div>

  )

}

export default RestaurantDetails;