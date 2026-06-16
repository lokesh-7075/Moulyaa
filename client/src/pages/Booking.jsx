import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function Booking(){

  const { id, type } = useParams();
  const navigate = useNavigate();

  const [service,setService] = useState(null);
  const [travelDate,setTravelDate] = useState("");
  const [people,setPeople] = useState(1);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const BASE_URL = "http://localhost:5000";

  // =========================
  // FETCH SERVICE
  // =========================
  useEffect(()=>{
    const fetchService = async()=>{
      try{
        const res = await API.get(`/${type}s/${id}`);
        console.log("SERVICE:", res.data);
        setService(res.data);
      }
      catch(error){
        console.error("Fetch error",error);
      }
    };

    fetchService();
  },[id,type]);



  // =========================
  // BOOKING FLOW (FINAL)
  // =========================
  const handleBooking = async () => {

    console.log("BUTTON CLICKED ✅");

    if (!user) {
      navigate("/login");
      return;
    }

    if (user.role !== "traveler") {
      alert("Only travelers can book services");
      return;
    }

    if (!travelDate) {
      alert("Please select travel date");
      return;
    }

    try {

      const priceField =
        service.pricePerNight ||
        service.pricePerDay ||
        service.price ||
        service.ticketPrice;

      if (!priceField) {
        alert("Price not available");
        return;
      }

      const total = priceField * people;

      const bookingRes = await API.post("/bookings/create", {
        serviceId: service._id,
        providerId: service.ownerId || service.providerId,
        serviceType: type === "guide" ? "tour_guide" : type,
        travelDate,
        numberOfPeople: people,
        totalAmount: total,
        status: "pending"
      });

      console.log("FULL RESPONSE:", bookingRes.data);

      // 🔥 FIX: HANDLE ALL RESPONSE TYPES
      const bookingId =
        bookingRes.data?.booking?._id ||
        bookingRes.data?._id ||
        bookingRes.data?.id;

      console.log("EXTRACTED BOOKING ID:", bookingId);

      if (!bookingId) {
        alert("Booking ID not found ❌");
        console.error("Invalid response:", bookingRes.data);
        return;
      }

      const paymentData = {
        bookingId,
        amount: total
      };

      // 🔥 FORCE SAVE
      localStorage.setItem("paymentData", JSON.stringify(paymentData));

      // 🔥 VERIFY SAVE
      const stored = localStorage.getItem("paymentData");
      console.log("STORED VALUE:", stored);

      if (!stored) {
        alert("Storage failed ❌");
        return;
      }

      // 🔥 NAVIGATE (no need for delay now)
      navigate(`/payment/${bookingId}`, {
  state: paymentData
});

    } catch (error) {
      console.error("Booking failed", error);
      alert("Booking failed");
    }
  };



  // =========================
  // LOADING
  // =========================
  if(!service){
    return(
      <div className="flex justify-center items-center h-screen text-xl">
        Loading...
      </div>
    );
  }


  // =========================
  // DATA
  // =========================
  const price =
    service.pricePerNight ||
    service.pricePerDay ||
    service.price ||
    service.ticketPrice;

  const title =
    service.hotelName ||
    service.vehicleName ||
    service.eventName ||
    service.restaurantName ||
    service.guideName;

  const location =
    service.location?.city || service.location;

  const image =
    service.images?.[0]
      ? `${BASE_URL}/${service.images[0]}`
      : "https://via.placeholder.com/500";


  return(

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">

        <img src={image} className="w-full h-80 object-cover" />

        <div className="p-6 grid md:grid-cols-2 gap-6">

          {/* DETAILS */}
          <div>
            <h2 className="text-2xl font-bold mb-2">{title}</h2>
            <p className="text-gray-500 mb-2">📍 {location}</p>
            <p className="text-xl font-semibold text-orange-600">₹{price}</p>
            <p className="mt-3 text-gray-600">
              {service.description || "No description available"}
            </p>
          </div>

          {/* BOOKING BOX */}
          <div className="bg-gray-50 p-5 rounded-xl shadow-inner">

            <h3 className="text-lg font-semibold mb-4">Book Now</h3>

            <input
              type="date"
              className="w-full border p-2 rounded mb-4"
              value={travelDate}
              onChange={(e)=>setTravelDate(e.target.value)}
            />

            <input
              type="number"
              min="1"
              className="w-full border p-2 rounded mb-4"
              value={people}
              onChange={(e)=>setPeople(e.target.value)}
            />

            <h4 className="text-lg font-bold mb-4">
              Total: ₹{price * people}
            </h4>

            <button
              type="button"
              onClick={handleBooking}
              className="w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600"
            >
              Pay & Confirm
            </button>

          </div>

        </div>

      </div>

    </div>

  )
}

export default Booking;