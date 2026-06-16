import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

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

    let clean = path.replace(/\\/g,"/").replace(/^\/+/,"");

    if(!clean.startsWith("uploads/")){
      clean = "uploads/" + clean;
    }

    return `${BASE_URL}/${clean}`;
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
      setRooms(roomRes.data || []);

      const bookingRes = await API.get("/bookings/provider");

      const hotelBookings = (bookingRes.data || []).filter(
        b => b.serviceType === "hotel"
      );

      setBookings(hotelBookings);

    }catch(err){
      console.error(err);
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

    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-orange-50 p-6">

      {/* ================= HEADER (Z FIX HERE 🔥) ================= */}
      <div className="relative z-50 flex justify-between items-center mb-6 bg-white/60 backdrop-blur-xl p-4 rounded-2xl shadow-xl">

        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-orange-500 text-transparent bg-clip-text">
          Moulyas ✨
        </h1>

        {/* PROFILE */}
        <div className="relative">

          <img
            src={getImage(user?.profileImage)}
            className="w-12 h-12 rounded-full cursor-pointer border hover:scale-110 transition"
            onClick={()=>setOpen(!open)}
          />

          {/* ✅ FIXED DROPDOWN */}
          {open && (
            <div className="
              absolute right-0 mt-3 w-64 
              bg-white rounded-2xl shadow-2xl p-4
              z-[999] border border-gray-100
            ">

              <div className="flex gap-3 mb-3">
                <img
                  src={getImage(user?.profileImage)}
                  className="w-12 h-12 rounded-full"
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


      {/* ================= NO HOTEL ================= */}
      {!hotel && (
        <div className="text-center mt-20">

          <h2 className="text-xl mb-4 text-gray-700">
            Create your hotel first
          </h2>

          <button
            onClick={()=>navigate("/add-hotel")}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-full shadow hover:scale-105 transition"
          >
            Create Hotel
          </button>

        </div>
      )}


      {/* ================= HOTEL ================= */}
      {hotel && (

        <>
          {/* HOTEL CARD */}
          <div className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow-xl mb-6">

            <h2 className="text-2xl font-bold">
              {hotel.hotelName}
            </h2>

            <p className="text-gray-500">
              📍 {hotel.location}
            </p>

            {hotel.images?.[0] && (
              <img
                src={getImage(hotel.images[0])}
                className="w-full h-60 object-cover rounded-xl mt-4"
              />
            )}

          </div>


          {/* ================= STATS ================= */}
          <div className="grid md:grid-cols-3 gap-6 mb-10">

            {[
              {title:"Bookings",value:totalBookings,color:"from-blue-400 to-blue-600"},
              {title:"Revenue",value:`₹${totalRevenue}`,color:"from-green-400 to-green-600"},
              {title:"Your Share",value:`₹${myShare}`,color:"from-pink-400 to-pink-600"}
            ].map((card,i)=>(
              <div key={i}
                className={`bg-gradient-to-r ${card.color} text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition`}
              >
                <p>{card.title}</p>
                <h2 className="text-3xl font-bold">{card.value}</h2>
              </div>
            ))}

          </div>


          {/* ADD ROOM */}
          <button
            onClick={()=>navigate("/add-room")}
            className="mb-6 px-6 py-2 rounded-full 
            bg-gradient-to-r from-green-500 to-emerald-500 
            text-white shadow hover:scale-105 transition"
          >
            + Add Room
          </button>


          {/* ROOMS */}
          <div className="grid md:grid-cols-3 gap-6">

            {rooms.map(room=>(

              <div key={room._id}
                className="bg-white/70 backdrop-blur-xl p-4 rounded-2xl shadow hover:shadow-2xl transition hover:-translate-y-1"
              >

                <img
                  src={getImage(room.roomImages?.[0])}
                  className="h-40 w-full object-cover rounded-xl"
                />

                <h3 className="font-bold mt-3">
                  {room.title}
                </h3>

                <p className="text-orange-600 font-semibold">
                  ₹{room.price}
                </p>

                <button
                  onClick={()=>deleteRoom(room._id)}
                  className="mt-3 w-full py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>

              </div>

            ))}

          </div>


          {/* BOOKINGS */}
          <div className="mt-10">

            <h2 className="text-2xl font-bold mb-6">
              📅 Bookings
            </h2>

            <div className="grid md:grid-cols-3 gap-6">

              {bookings.map(b=>(

                <div key={b._id}
                  className="bg-white/70 backdrop-blur-xl p-5 rounded-2xl shadow hover:shadow-2xl transition"
                >

                  <p className="font-bold">
                    {b.travelerId?.name}
                  </p>

                  <p className="text-gray-500 text-sm">
                    {new Date(b.travelDate).toDateString()}
                  </p>

                  <p className="text-orange-600 font-bold mt-2">
                    ₹{b.totalAmount}
                  </p>

                  <p className="text-green-600 text-sm">
                    Your Share: ₹{Math.floor(b.totalAmount * 0.75)}
                  </p>

                  <p className={`text-xs ${
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

        </>
      )}

    </div>

  );

}

export default HotelDashboard;