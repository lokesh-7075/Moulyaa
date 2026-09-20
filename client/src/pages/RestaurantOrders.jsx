import { useEffect, useState } from "react";
import API from "../services/api";

function RestaurantOrders(){

  const [orders,setOrders] = useState([]);
  const [loading,setLoading] = useState(true);

  // =====================
  // FETCH ORDERS
  // =====================
  const fetchOrders = async()=>{
    try{

      const res = await API.get("/bookings/provider");

      const raw = res.data?.bookings || res.data;
      const data = Array.isArray(raw) ? raw : [];

      // 🔥 only restaurant bookings
      const restaurantOrders = data
        .filter(b => b && b.serviceType === "restaurant")
        .map(b => ({
          ...b,
          myShare: Math.floor((b.totalAmount || 0) * 0.75)
        }));

      setOrders(restaurantOrders);

    }catch(err){
      console.warn("Restaurant orders fetch notice:", err.message);
      setOrders([]);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchOrders();
  },[]);


  if(loading){
    return(
      <div className="h-screen flex items-center justify-center">
        Loading orders...
      </div>
    );
  }


  return(

    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-8">

      <h2 className="text-3xl font-bold mb-6 text-pink-600">
        🍽 Your Orders
      </h2>

      {orders.length === 0 ? (

        <p className="text-gray-500">
          No orders yet
        </p>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {orders.map(order => (

            <div
              key={order._id}
              className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-5 hover:shadow-2xl hover:-translate-y-1 transition"
            >

              {/* USER */}
              <div className="mb-3">
                <p className="font-semibold text-lg">
                  {order.travelerId?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {order.travelerId?.email}
                </p>
              </div>

              {/* DETAILS */}
              <p className="text-gray-700">
                👥 Quantity: {order.numberOfPeople}
              </p>

              <p className="text-gray-700">
                💰 Total: ₹{order.totalAmount}
              </p>

              <p className="text-green-600 font-semibold">
                💸 Your Share: ₹{order.myShare}
              </p>

              {/* STATUS */}
              <div className="mt-3 flex justify-between">

                <span className={`text-sm px-2 py-1 rounded ${
                  order.paymentStatus === "paid"
                    ? "bg-green-100 text-green-600"
                    : "bg-red-100 text-red-500"
                }`}>
                  {order.paymentStatus}
                </span>

                <span className={`text-sm px-2 py-1 rounded ${
                  order.bookingStatus === "confirmed"
                    ? "bg-blue-100 text-blue-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}>
                  {order.bookingStatus}
                </span>

              </div>

              {/* DATE */}
              <p className="text-xs text-gray-400 mt-3">
                {new Date(order.createdAt).toLocaleString()}
              </p>

            </div>

          ))}

        </div>

      )}

    </div>

  );

}

export default RestaurantOrders;