import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function EventDetails(){

  const { id } = useParams();
  const navigate = useNavigate();

  const [event,setEvent] = useState(null);
  const [quantity,setQuantity] = useState(1);
  const [error,setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const BASE_URL = "http://localhost:5000";

  // =========================
  // IMAGE FIX
  // =========================
  const getImageUrl = (path) => {
    if (!path) return "https://via.placeholder.com/400";

    const cleanPath = path
      ?.replace(/^\/+/, "")
      ?.replace(/^uploads\//, "");

    return `${BASE_URL}/uploads/${cleanPath}`;
  };

  // ✅ SAFE DATE FORMAT
  const formatDate = (date) => {
    if (!date) return "No Date";

    const d = new Date(date);

    if (isNaN(d)) return "Invalid Date";

    return d.toLocaleDateString("en-IN");
  };

  // =========================
  // FETCH EVENT
  // =========================
  useEffect(()=>{

    const fetchEvent = async()=>{
      try{
        const res = await API.get(`/events/${id}`);
        setEvent(res.data);
      }catch(err){
        console.error(err);
        setError("Failed to load event");
      }
    };

    fetchEvent();

  },[id]);


  // =========================
  // HANDLE BOOKING
  // =========================
  const handleBooking = async () => {

    setError("");

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "traveler") {
      setError("Only travelers can book events");
      return;
    }

    if (quantity < 1) {
      setError("Invalid ticket quantity");
      return;
    }

    if (quantity > event.availableTickets) {
      setError("Not enough tickets available");
      return;
    }

    try {

      const totalPrice = quantity * event.price;

      const providerId =
        event.organizerId ||
        event.ownerId ||
        event.providerId;

      if (!providerId) {
        setError("Provider info missing");
        return;
      }

      const res = await API.post("/bookings/create", {
        serviceId: event._id,
        providerId,
        serviceType: "event",
        travelDate: event.eventDate, // ✅ FIXED
        numberOfPeople: quantity,
        totalAmount: totalPrice
      });

      const bookingId = res.data.booking._id;

      navigate(`/payment/${bookingId}`);

    } catch (error) {
      console.error(error);
      setError("Booking failed. Try again.");
    }

  };


  // =========================
  // LOADING
  // =========================
  if(!event){
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 text-lg">
        Loading event...
      </div>
    );
  }


  const totalPrice = quantity * event.price;


  return(

    <div className="w-full bg-gradient-to-br from-purple-50 via-white to-pink-50 min-h-screen">

      <div className="h-[18vh]"></div>

      <div className="px-6 md:px-12 pb-10">

        <div className="grid md:grid-cols-2 gap-10 items-start">

          {/* IMAGE */}
          <div className="rounded-2xl overflow-hidden shadow-xl">
            <img
              src={getImageUrl(event.images?.[0])}
              className="w-full h-80 object-cover hover:scale-105 transition duration-500"
            />
          </div>

          {/* DETAILS */}
          <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-2xl shadow-xl p-6">

            <h1 className="text-3xl font-bold text-gray-800">
              {event.title}
            </h1>

            <p className="text-gray-500 mt-2">
              📍 {event.location}
            </p>

            {/* ✅ FIXED DATE */}
            <p className="text-sm text-gray-600 mt-1">
              📅 {formatDate(event.eventDate)}
            </p>

            <p className="text-sm text-gray-600">
              ⏰ {event.time}
            </p>

            <p className="mt-4 text-gray-700 leading-relaxed">
              {event.description}
            </p>

            <p className="text-pink-600 text-2xl font-bold mt-4">
              ₹{event.price} / ticket
            </p>

            <p className="text-sm text-gray-500 mt-1">
              Available Tickets: {event.availableTickets}
            </p>

            {/* QUANTITY */}
            <div className="mt-4">
              <label className="text-sm text-gray-600">
                Tickets
              </label>

              <input
                type="number"
                value={quantity}
                min="1"
                max={event.availableTickets}
                onChange={(e)=>setQuantity(Number(e.target.value))}
                className="w-full mt-1 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            <p className="mt-3 text-lg font-semibold text-gray-800">
              Total: ₹{totalPrice}
            </p>

            {error && (
              <p className="text-red-500 text-sm mt-2">
                {error}
              </p>
            )}

            <button
              onClick={handleBooking}
              className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Continue to Payment 🎟️
            </button>

          </div>

        </div>

      </div>

    </div>

  )

}

export default EventDetails;