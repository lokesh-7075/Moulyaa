import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function HotelDetails(){

  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel,setHotel] = useState(null);
  const [rooms,setRooms] = useState([]);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const BASE_URL = "http://localhost:5000";

  const getImage = (path)=>{
    if(!path) return "https://via.placeholder.com/400";
    return `${BASE_URL}/${path.replace(/^\/+/,"")}`;
  };

  useEffect(()=>{

    const fetchData = async()=>{
      const hotelRes = await API.get(`/hotels/${id}`);
      setHotel(hotelRes.data);

      const roomRes = await API.get(`/rooms/hotel/${id}`);
      setRooms(roomRes.data || []);
    };

    fetchData();

  },[id]);

  // ================= BOOK =================
  const handleBooking = async(room)=>{

    if(!user){
      navigate("/login");
      return;
    }

    const providerId =
      hotel.ownerId || hotel.providerId;

    const total = room.price;

    const res = await API.post("/bookings/create",{
      serviceId: room._id,
      providerId,
      serviceType: "hotel",
      travelDate: new Date(),
      numberOfPeople: 1,
      totalAmount: total
    });

    const bookingId = res.data.booking._id;

    navigate(`/payment/${bookingId}`);
  };

  if(!hotel){
    return <p className="text-center mt-10">Loading...</p>;
  }

  return(

    <div className="w-full bg-gradient-to-br from-pink-50 via-white to-orange-50">

      <div className="h-[18vh]"></div>

      {/* HERO */}
      <div className="relative h-[55vh] max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-xl">

        <img
          src={getImage(hotel.images?.[0])}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"/>

        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-5xl font-bold">
            {hotel.hotelName}
          </h1>
          <p className="mt-2 text-lg">
            📍 {hotel.location}
          </p>
        </div>

      </div>

      {/* ROOMS */}
      <div className="max-w-7xl mx-auto px-6 py-12">

        <h2 className="text-3xl font-bold mb-8">
          🏨 Available Rooms
        </h2>

        <div className="grid md:grid-cols-3 gap-8">

          {rooms.map(room=>(

            <div key={room._id}
              className="group bg-white/60 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl transition hover:-translate-y-2 overflow-hidden"
            >

              <img
                src={getImage(room.roomImages?.[0])}
                className="h-52 w-full object-cover group-hover:scale-110 transition duration-500"
              />

              <div className="p-5">

                <h3 className="text-xl font-bold">
                  {room.title}
                </h3>

                <p className="text-gray-500">
                  👤 {room.capacity} persons
                </p>

                <p className="text-orange-600 font-bold mt-2 text-lg">
                  ₹{room.price}
                </p>

                <button
                  onClick={()=>handleBooking(room)}
                  className="mt-4 w-full py-2 rounded-xl 
                  bg-gradient-to-r from-pink-500 to-orange-500 
                  text-white shadow-lg hover:scale-105 transition"
                >
                  Book & Pay 💖
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}

export default HotelDetails;