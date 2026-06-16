import { useEffect, useState } from "react";
import API from "../services/api";

function EventBookings(){

  const [bookings,setBookings] = useState([]);
  const [loading,setLoading] = useState(true);

  const BASE_URL = "http://localhost:5000";

  // =====================
  // FETCH BOOKINGS
  // =====================
  const fetchBookings = async()=>{
    try{

      const res = await API.get("/bookings/provider");

      const data = res.data?.bookings || res.data || [];

      // 🔥 only event bookings
      const eventBookings = data.filter(
        b => b.serviceType === "event"
      );

      setBookings(eventBookings);

    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchBookings();
  },[]);


  if(loading){
    return(
      <div className="flex justify-center items-center h-screen text-xl">
        Loading bookings...
      </div>
    );
  }


  return(

    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">

      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        🎟 Event Bookings
      </h2>

      {bookings.length === 0 ? (

        <p className="text-gray-500">
          No bookings yet
        </p>

      ) : (

        <div className="overflow-x-auto bg-white rounded-xl shadow">

          <table className="w-full text-left">

            <thead className="bg-purple-100 text-gray-700">
              <tr>
                <th className="p-4">Traveler</th>
                <th className="p-4">Tickets</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>

              {bookings.map((b)=>(

                <tr
                  key={b._id}
                  className="border-b hover:bg-gray-50 transition"
                >

                  <td className="p-4 flex items-center gap-3">

                    <img
                      src={
                        b.travelerId?.profileImage
                        ? `${BASE_URL}/${b.travelerId.profileImage}`
                        : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                      }
                      className="w-10 h-10 rounded-full"
                    />

                    <div>
                      <p className="font-semibold">
                        {b.travelerId?.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {b.travelerId?.email}
                      </p>
                    </div>

                  </td>

                  <td className="p-4">
                    {b.numberOfPeople}
                  </td>

                  <td className="p-4 text-purple-600 font-semibold">
                    ₹{b.totalAmount}
                  </td>

                  <td className="p-4">
                    {new Date(b.travelDate).toLocaleDateString()}
                  </td>

                  <td className="p-4">

                    <span className={`px-3 py-1 rounded-full text-sm
                      ${b.bookingStatus === "confirmed" ? "bg-green-100 text-green-600" :
                        b.bookingStatus === "pending" ? "bg-yellow-100 text-yellow-600" :
                        "bg-red-100 text-red-600"}
                    `}>
                      {b.bookingStatus}
                    </span>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>

  );

}

export default EventBookings;