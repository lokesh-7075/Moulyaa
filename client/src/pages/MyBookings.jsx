import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function MyBookings() {

  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:5000";

  // ✅ DATE FORMAT
  const formatDate = (date) => {
    if (!date) return "No Date";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "No Date";
    return d.toLocaleDateString("en-IN");
  };

  // =========================
  // FETCH BOOKINGS
  // =========================
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/bookings/my-bookings");
        setBookings(res.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBookings();
  }, []);

  // =========================
  // CANCEL BOOKING
  // =========================
  const handleCancel = async (id) => {
    try {
      await API.put(`/bookings/cancel/${id}`);

      // update UI without reload
      setBookings(prev =>
        prev.map(b =>
          b._id === id ? { ...b, bookingStatus: "cancelled" } : b
        )
      );
    } catch (err) {
      alert("Cancel failed");
    }
  };

  // =========================
  // STATUS COLORS
  // =========================
  const getStatusColor = (status) => {
    if (status === "confirmed") return "bg-green-100 text-green-600";
    if (status === "pending") return "bg-yellow-100 text-yellow-600";
    if (status === "cancelled") return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-white px-6 py-10">

      <h1 className="text-3xl font-bold mb-8">
        📦 My Bookings
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {bookings.map((b) => {

          const image =
            b.serviceImage
              ? `${BASE_URL}/${b.serviceImage}`
              : "https://via.placeholder.com/500";

          const title =
            b.serviceName ||
            b.hotelName ||
            b.vehicleName ||
            b.eventName ||
            b.restaurantName ||
            b.guideName ||
            "Service";

          return (
            <div
              key={b._id}
              className="bg-white/70 backdrop-blur-xl border rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden"
            >

              {/* IMAGE */}
              <img
                src={image}
                className="w-full h-40 object-cover"
              />

              {/* CONTENT */}
              <div className="p-4 space-y-2">

                <h2 className="text-lg font-semibold">
                  {title}
                </h2>

                <p className="text-sm text-gray-500">
                  {b.serviceType.toUpperCase()}
                </p>

                <p className="text-sm">
                  📅 {formatDate(b.travelDate)}
                </p>

                <p className="text-sm">
                  👥 {b.numberOfPeople} people
                </p>

                <p className="text-lg font-bold text-orange-500">
                  ₹{b.totalAmount}
                </p>

                {/* STATUS */}
                <div className="flex justify-between items-center mt-2">

                  <span className={`text-xs px-3 py-1 rounded-full ${getStatusColor(b.bookingStatus)}`}>
                    {b.bookingStatus}
                  </span>

                  <span className={`text-xs px-3 py-1 rounded-full ${
                    b.paymentStatus === "paid"
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-600"
                  }`}>
                    {b.paymentStatus}
                  </span>

                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 mt-3">

                  {/* RECEIPT */}
                  {b.paymentStatus === "paid" && (
                    <button
                      onClick={() =>
                        navigate("/receipt", {
                          state: {
                            payment: {
                              id: b.transactionId || b._id,
                              amount: b.totalAmount,
                              date: b.paidAt || new Date()
                            }
                          }
                        })
                      }
                      className="flex-1 bg-black text-white py-1 rounded hover:opacity-90"
                    >
                      Receipt
                    </button>
                  )}

                  {/* CANCEL */}
                  {b.bookingStatus !== "cancelled" && (
                    <button
                      onClick={() => handleCancel(b._id)}
                      className="flex-1 bg-red-500 text-white py-1 rounded hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  )}

                </div>

              </div>

            </div>
          );
        })}

      </div>

    </div>
  );
}

export default MyBookings;