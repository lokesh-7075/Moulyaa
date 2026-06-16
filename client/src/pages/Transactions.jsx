import { useEffect,useState } from "react";
import API from "../services/api";

function Transactions(){

  const [payments,setPayments] = useState([]);

  useEffect(()=>{
    const fetchPayments = async()=>{
      try{
        const res = await API.get("/payments/my-payments");
        setPayments(res.data || []);
      }catch(err){
        console.error(err);
      }
    };
    fetchPayments();
  },[]);

  return(

    <div className="min-h-screen p-10 bg-gradient-to-br from-green-50 via-white to-blue-50">

      <h1 className="text-3xl font-bold mb-8">
        💳 My Transactions
      </h1>

      <div className="grid md:grid-cols-3 gap-6">

        {payments.map(p=>(
          <div key={p._id}
            className="bg-white/60 backdrop-blur-xl p-5 rounded-2xl shadow hover:scale-105 transition"
          >

            <p className="text-gray-500 text-sm">
              Booking ID
            </p>

            <p className="font-semibold">
              {p.bookingId}
            </p>

            <p className="text-green-600 text-xl font-bold mt-2">
              ₹{p.amount}
            </p>

            <p className="text-sm mt-1">
              {p.paymentStatus}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              {new Date(p.createdAt).toLocaleDateString()}
            </p>

          </div>
        ))}

      </div>

    </div>

  )

}

export default Transactions;