import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./MyBookings.css";

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
        if (Array.isArray(res.data)) {
          setBookings(res.data);
        } else if (res.data && Array.isArray(res.data.bookings)) {
          setBookings(res.data.bookings);
        } else {
          setBookings([]);
        }
      } catch (err) {
        console.warn("Bookings fetch notice:", err.message);
        setBookings([]);
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
        (Array.isArray(prev) ? prev : []).map(b =>
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
    if (status === "confirmed") return "status-confirmed";
    if (status === "pending") return "status-pending";
    if (status === "cancelled") return "status-cancelled";
    return "";
  };

  const safeBookings = Array.isArray(bookings) ? bookings : [];

  return (
    <div className="bookings-page-container">

      <div className="bookings-page-header">
        <h1 className="bookings-page-title">
          📦 My Bookings
        </h1>
      </div>

      <div className="bookings-grid">

        {safeBookings.map((b) => {

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
            <div key={b._id} className="booking-card">

              {/* IMAGE */}
              <div className="booking-card-img-wrapper">
                <img
                  src={image}
                  className="booking-card-img"
                />
              </div>

              {/* CONTENT */}
              <div className="booking-card-content">

                <p className="booking-card-type">
                  {b.serviceType.toUpperCase()}
                </p>

                <h2 className="booking-card-title">
                  {title}
                </h2>

                <p className="booking-card-meta">
                  📅 {formatDate(b.travelDate)}
                </p>

                <p className="booking-card-meta">
                  👥 {b.numberOfPeople} people
                </p>

                <p className="booking-card-amount">
                  ₹{b.totalAmount}
                </p>

                {/* STATUS */}
                <div className="booking-status-row">

                  <span className={`badge ${getStatusColor(b.bookingStatus)}`}>
                    {b.bookingStatus}
                  </span>

                  <span className={`badge ${
                    b.paymentStatus === "paid"
                      ? "payment-paid"
                      : "payment-unpaid"
                  }`}>
                    {b.paymentStatus}
                  </span>

                </div>

                {/* ACTIONS */}
                <div className="actions-row">

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
                      className="btn-receipt"
                    >
                      Receipt
                    </button>
                  )}

                  {/* CANCEL */}
                  {b.bookingStatus !== "cancelled" && (
                    <button
                      onClick={() => handleCancel(b._id)}
                      className="btn-cancel"
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