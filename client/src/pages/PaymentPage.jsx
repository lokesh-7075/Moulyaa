import React, { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement
} from "@stripe/react-stripe-js";
import API from "../services/api";

const stripePromise = loadStripe("pk_test_51T5UdZL8SNNtn42BhYO4ln0Q3RhCtBDYrXEjZV0kMnBpBCoYOyvhNJCBogKDApZS9hUVaCFrjbjUsdRard1bFyy200s81zCB7D");

const elementStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#000",
      "::placeholder": { color: "#999" }
    }
  }
};

const CheckoutForm = () => {

  const stripe = useStripe();
  const elements = useElements();
  const location = useLocation();
  const navigate = useNavigate();

  const { bookingId: paramBookingId } = useParams();

  const [bookingId, setBookingId] = useState(null);
  const [amount, setAmount] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [zip, setZip] = useState("");

  // =========================
  // LOAD DATA
  // =========================
  useEffect(() => {

    const loadData = async () => {

      let finalId = paramBookingId || location.state?.bookingId;

      if (!finalId) {
        const saved = JSON.parse(localStorage.getItem("paymentData"));
        finalId = saved?.bookingId;
      }

      if (!finalId) {
        navigate("/");
        return;
      }

      const res = await API.get(`/bookings/${finalId}`);
      const booking = res.data.booking || res.data;

      setBookingId(booking._id);
      setAmount(booking.totalAmount);

    };

    loadData();

  }, [paramBookingId, location.state]);



  // =========================
  // CREATE INTENT
  // =========================
  useEffect(() => {
    if (!amount) return;

    API.post("/payments/create-intent", { amount })
      .then(res => setClientSecret(res.data.clientSecret));

  }, [amount]);



  // =========================
  // HANDLE PAYMENT
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    setLoading(true);

    const cardNumber = elements.getElement(CardNumberElement);

    const { paymentIntent, error } =
      await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardNumber,
          billing_details: {
            address: { postal_code: zip }
          }
        }
      });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {

      await API.post("/payments/confirm", {
        bookingId,
        amount,
        paymentIntentId: paymentIntent.id,
      });

      navigate("/receipt", {
        state: {
          payment: {
            id: paymentIntent.id,
            amount,
            date: new Date()
          }
        }
      });
    }

    setLoading(false);
  };



  if (!bookingId || !amount) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }



  return (
  <div className="min-h-screen flex items-center justify-center bg-white px-4">

    <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6">

      {/* 🔵 LEFT: BOOKING BOX (SKY BLUE) */}
      <div className="bg-sky-100/70 backdrop-blur-lg border border-sky-300 rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300">

        <h2 className="text-xl font-semibold mb-4 text-sky-900">
          Booking Summary 🧾
        </h2>

        <p className="text-sky-700">Total Amount</p>
        <p className="text-2xl font-bold text-sky-900 mt-1">
          ₹{amount}
        </p>

        <div className="mt-4 border-t border-sky-300 pt-3 flex justify-between font-semibold text-sky-800">
          <span>Total</span>
          <span>₹{amount}</span>
        </div>

      </div>


      {/* 🟠 RIGHT: PAYMENT BOX (ORANGE OUTLINE) */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-orange-400 rounded-2xl p-6 shadow-md hover:shadow-xl transition duration-300 space-y-4"
      >

        <h2 className="text-xl font-semibold text-orange-600">
          Card Details 💳
        </h2>

        {/* CARD NUMBER */}
        <div className="p-3 border border-gray-300 rounded-lg focus-within:border-orange-500 transition">
          <CardNumberElement options={elementStyle} />
        </div>

        {/* EXPIRY + CVC */}
        <div className="grid grid-cols-2 gap-4">

          <div className="p-3 border border-gray-300 rounded-lg focus-within:border-orange-500 transition">
            <CardExpiryElement options={elementStyle} />
          </div>

          <div className="p-3 border border-gray-300 rounded-lg focus-within:border-orange-500 transition">
            <CardCvcElement options={elementStyle} />
          </div>

        </div>

        {/* ZIP */}
        <input
          type="text"
          placeholder="ZIP / PIN Code"
          value={zip}
          onChange={(e) => setZip(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:border-orange-500 outline-none transition"
        />

        {/* TEST INFO */}
        <div className="text-sm text-gray-500">
          <p>Card: <span className="text-black font-medium">4242 4242 4242 4242</span></p>
          <p>CVC: 123</p>
          <p>ZIP: 522001</p>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition"
        >
          {loading ? "Processing..." : `Pay ₹${amount}`}
        </button>

      </form>

    </div>

  </div>
);
};



export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}