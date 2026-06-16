import { useEffect, useState } from "react";
import API from "../services/api";

function Bookings(){

  const [bookings,setBookings] = useState([]);
  const [loading,setLoading] = useState(true);

  // ================= NUMBER → WORDS =================
  const numberToWords = (num)=>{

    if(!num) return "Zero";

    const a = [
      "", "One", "Two", "Three", "Four", "Five",
      "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen",
      "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];

    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

    const convert = (n)=>{
      if(n < 20) return a[n];
      if(n < 100) return b[Math.floor(n/10)] + " " + a[n%10];
      if(n < 1000) return a[Math.floor(n/100)] + " Hundred " + convert(n%100);
      if(n < 100000) return convert(Math.floor(n/1000)) + " Thousand " + convert(n%1000);
      if(n < 10000000) return convert(Math.floor(n/100000)) + " Lakh " + convert(n%100000);
      return convert(Math.floor(n/10000000)) + " Crore " + convert(n%10000000);
    };

    return convert(num);
  };

  // ================= FETCH =================
  const fetchBookings = async ()=>{

    try{

      const res = await API.get("/bookings/all"); // ✅ FIXED

      setBookings(res.data || []);

    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);
    }

  };

  useEffect(()=>{
    fetchBookings();
  },[]);

  // ================= CANCEL =================
  const cancelBooking = async(id)=>{

    if(!window.confirm("Cancel this booking?")) return;

    try{

      await API.put(`/bookings/cancel/${id}`); // ✅ FIXED

      fetchBookings();

    }catch(err){
      console.error(err);
    }

  };

  // ================= STATS =================
  const totalRevenue = bookings.reduce(
    (sum,b)=> sum + (b.totalAmount || 0),0
  );

  const platformShare = bookings.reduce(
    (sum,b)=> sum + (b.platformShare || Math.floor((b.totalAmount||0)*0.25)),0
  );

  return(

    <div className="min-h-screen p-8 bg-gradient-to-br from-orange-50 via-white to-pink-50">

      {/* HEADER */}
      <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
        📦 Bookings & Payments Dashboard
      </h1>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow">
          <p className="text-gray-500">Total Bookings</p>
          <h2 className="text-3xl font-bold">{bookings.length}</h2>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow">
          <p className="text-gray-500">Total Revenue</p>
          <h2 className="text-3xl font-bold text-green-600">
            ₹{totalRevenue}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {numberToWords(totalRevenue)}
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow">
          <p className="text-gray-500">Platform Earnings</p>
          <h2 className="text-3xl font-bold text-orange-600">
            ₹{platformShare}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {numberToWords(platformShare)}
          </p>
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white/60 backdrop-blur-xl rounded-2xl shadow overflow-hidden">

        <table className="w-full">

          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3 text-left">Traveler</th>
              <th className="p-3 text-left">Service</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Platform Share</th>
              <th className="p-3 text-left">Date & Time</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Action</th>
            </tr>
          </thead>

          <tbody>

            {loading && (
              <tr>
                <td colSpan="7" className="text-center p-6">
                  Loading...
                </td>
              </tr>
            )}

            {!loading && bookings.map(b=>(

              <tr key={b._id} className="border-t hover:bg-gray-50">

                <td className="p-3">
                  {b.travelerId?.name || "User"}
                </td>

                <td className="p-3 capitalize">
                  {b.serviceType}
                </td>

                <td className="p-3 font-semibold">
                  ₹{b.totalAmount}
                  <p className="text-xs text-gray-500">
                    {numberToWords(b.totalAmount)}
                  </p>
                </td>

                <td className="p-3 text-orange-600 font-semibold">
                  ₹{b.platformShare || Math.floor((b.totalAmount||0)*0.25)}
                </td>

                <td className="p-3 text-sm text-gray-600">
                  {new Date(b.createdAt).toLocaleString()}
                </td>

                <td className="p-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    b.bookingStatus === "cancelled" // ✅ FIXED
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-700"
                  }`}>
                    {b.bookingStatus} {/* ✅ FIXED */}
                  </span>
                </td>

                <td className="p-3">

                  <button
                    onClick={()=>cancelBooking(b._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Cancel
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  );

}

export default Bookings;