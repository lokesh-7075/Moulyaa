import { useLocation, useNavigate } from "react-router-dom";

function Receipt() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const payment = state?.payment;

  if (!payment) {
    return <h2 className="text-center mt-10">Invalid Receipt ❌</h2>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">

      <div className="bg-white p-8 rounded-xl shadow-lg w-[400px]">

        <h2 className="text-2xl font-bold text-center mb-4">
          Payment Successful 🎉
        </h2>

        <div className="border-t border-b py-4 my-4 space-y-2">

          <div className="flex justify-between">
            <span>Transaction ID</span>
            <span className="text-sm">{payment.id}</span>
          </div>

          <div className="flex justify-between">
            <span>Amount Paid</span>
            <span>₹{payment.amount}</span>
          </div>

          <div className="flex justify-between">
            <span>Status</span>
            <span className="text-green-600 font-semibold">Success</span>
          </div>

          <div className="flex justify-between">
            <span>Date</span>
            <span>{new Date(payment.date).toLocaleString()}</span>
          </div>

        </div>

        <button
          onClick={() => navigate("/my-bookings")}
          className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
        >
          View My Bookings
        </button>

      </div>

    </div>
  );
}

export default Receipt;