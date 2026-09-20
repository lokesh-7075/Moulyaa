import { useEffect, useState } from "react";
import API from "../services/api";

function Transactions() {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await API.get("/payments/my-payments");
        if (Array.isArray(res.data)) {
          setPayments(res.data);
        } else if (res.data && Array.isArray(res.data.payments)) {
          setPayments(res.data.payments);
        } else {
          setPayments([]);
        }
      } catch (err) {
        console.warn("Transactions fetch notice:", err.message);
        setPayments([]);
      }
    };
    fetchPayments();
  }, []);

  const safePayments = Array.isArray(payments) ? payments : [];

  return (
    <div className="min-h-screen pt-32 pb-16 px-6 lg:px-12 bg-gradient-to-b from-[#0e0f22] via-[#070914] to-[#04050a] text-slate-100">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            Verified Payments
          </span>
          <h1 className="text-3xl lg:text-4xl font-black mt-3 bg-gradient-to-r from-white via-slate-200 to-emerald-400 bg-clip-text text-transparent">
            💳 My Transactions
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Real-time ledger of completed vacation bookings and travel services.
          </p>
        </div>

        {safePayments.length === 0 ? (
          <div className="bg-slate-900/60 border border-purple-500/20 rounded-3xl p-12 text-center text-slate-400">
            <span className="text-4xl">💳</span>
            <p className="mt-3 text-lg font-semibold text-slate-300">No payment transactions recorded yet.</p>
            <p className="text-sm">Book a bundle package or individual service to view transaction receipts.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safePayments.map((p) => (
              <div
                key={p._id}
                className="bg-slate-900/70 backdrop-blur-xl p-6 rounded-3xl border border-purple-500/25 shadow-xl hover:border-emerald-400/50 hover:scale-[1.02] transition duration-300"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">
                      Booking Reference
                    </p>
                    <p className="font-mono text-purple-300 text-sm font-semibold mt-0.5 truncate max-w-[180px]">
                      {p.bookingId || p.transactionReference || p._id}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 uppercase">
                    {p.paymentStatus || "Paid"}
                  </span>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-800/80 flex justify-between items-end">
                  <div>
                    <p className="text-slate-400 text-xs">Amount Paid</p>
                    <p className="text-emerald-400 text-2xl font-black tracking-tight">
                      ₹{p.amount?.toLocaleString("en-IN") || 0}
                    </p>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">
                    📅 {new Date(p.createdAt || Date.now()).toLocaleDateString("en-IN")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Transactions;