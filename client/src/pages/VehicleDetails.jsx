import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function VehicleDetails(){

  const { id } = useParams();
  const navigate = useNavigate();

  const [vehicle,setVehicle] = useState(null);
  const [days,setDays] = useState(1);
  const [error,setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const BASE_URL = "http://localhost:5000";

  // IMAGE FIX
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/400";

    const clean = path.replace(/^\/+/, "");
    return `${BASE_URL}/${clean}`;
  };

  // FETCH VEHICLE
  useEffect(()=>{
    const fetchVehicle = async()=>{
      try{
        const res = await API.get(`/vehicles/${id}`);
        setVehicle(res.data);
      }catch(err){
        console.error(err);
      }
    };

    fetchVehicle();
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
      setError("Only travelers can book vehicles");
      return;
    }

    if(days < 1){
      setError("Invalid number of days");
      return;
    }

    try{

      const total = vehicle.pricePerDay * days;

      const providerId =
        vehicle.ownerId ||
        vehicle.providerId;

      if(!providerId){
        setError("Provider missing");
        return;
      }

      // CREATE BOOKING
      const res = await API.post("/bookings/create",{
        serviceId: vehicle._id,
        providerId,
        serviceType: "vehicle",
        numberOfPeople: 1,
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

  if(!vehicle){
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  const total = vehicle.pricePerDay * days;

  return(

    <div className="w-full bg-gradient-to-br from-orange-50 via-white to-rose-50 min-h-screen">

      <div className="h-[18vh]"></div>

      <div className="px-6 md:px-12 pb-10">

        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* IMAGE */}
          <div className="rounded-2xl overflow-hidden shadow-xl group">
            <img
              src={getImageUrl(vehicle.images?.[0])}
              className="w-full h-80 object-cover group-hover:scale-105 transition duration-500"
            />
          </div>

          {/* DETAILS */}
          <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl shadow-xl p-6">

            <h1 className="text-3xl font-bold text-gray-800">
              {vehicle.vehicleName}
            </h1>

            <p className="text-gray-500 mt-2">
              📍 {vehicle.location}
            </p>

            <div className="mt-3 space-y-1 text-gray-700">
              <p>👥 Seats: {vehicle.seats}</p>
              <p>⛽ Fuel: {vehicle.fuelType}</p>
            </div>

            <p className="text-orange-600 text-2xl font-bold mt-4">
              ₹{vehicle.pricePerDay}/day
            </p>

            <p className="mt-4 text-gray-700">
              {vehicle.description}
            </p>

            {/* DAYS INPUT */}
            <div className="mt-4">
              <label className="text-sm text-gray-600">
                Number of Days
              </label>

              <input
                type="number"
                min="1"
                value={days}
                onChange={(e)=>setDays(Number(e.target.value))}
                className="w-full mt-1 px-4 py-2 border rounded-xl focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* TOTAL */}
            <p className="mt-4 text-lg font-semibold text-gray-800">
              Total: ₹{total}
            </p>

            {/* ERROR */}
            {error && (
              <p className="text-red-500 text-sm mt-2">
                {error}
              </p>
            )}

            {/* BUTTON */}
            <button
              onClick={handleBooking}
              className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Continue to Payment 🚗
            </button>

          </div>

        </div>

      </div>

    </div>

  );

}

export default VehicleDetails;