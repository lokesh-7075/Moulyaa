import { useEffect, useState } from "react";
import API from "../services/api";

function Payments(){

  const [payments,setPayments] = useState([]);
  const [loading,setLoading] = useState(true);

  // ================= NUMBER → WORDS =================
  const numberToWords = (num)=>{

    if(!num) return "Zero";

    const a = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
      "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];

    const b = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];

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
  const fetchPayments = async ()=>{

    try{

      const res = await API.get("/payments/all"); // ✅ FIXED

      setPayments(res.data || []);

    }
    catch(error){
      console.error("Payment fetch error:",error);
    }
    finally{
      setLoading(false);
    }

  };

  useEffect(()=>{
    fetchPayments();
  },[]);

  // ================= CALCULATIONS =================
  const totalRevenue = payments.reduce((sum,p)=>sum + (p.platformShare || 0),0);
  const totalPayments = payments.reduce((sum,p)=>sum + (p.amount || 0),0);

  const formatCurrency = (amount)=>{
    return new Intl.NumberFormat("en-IN",{
      style:"currency",
      currency:"INR"
    }).format(amount || 0);
  };

  if(loading){
    return(
      <div className="min-h-screen flex items-center justify-center text-xl">
        Loading payments...
      </div>
    )
  }

  return(

    <div className="min-h-screen p-8 bg-gradient-to-br from-orange-50 via-white to-pink-50 space-y-8">

      {/* HEADER */}
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
        💳 Payments & Revenue Dashboard
      </h1>

      {/* SUMMARY */}
      <div className="grid md:grid-cols-3 gap-6">

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow hover:scale-105 transition">
          <p className="text-gray-500 text-sm">Total Transactions</p>
          <h2 className="text-3xl font-bold">{payments.length}</h2>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow hover:scale-105 transition">
          <p className="text-gray-500 text-sm">Total Payment</p>
          <h2 className="text-3xl font-bold text-blue-600">
            {formatCurrency(totalPayments)}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {numberToWords(totalPayments)}
          </p>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-2xl shadow hover:scale-105 transition">
          <p className="text-gray-500 text-sm">Platform Revenue</p>
          <h2 className="text-3xl font-bold text-green-600">
            {formatCurrency(totalRevenue)}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {numberToWords(totalRevenue)}
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
              <th className="p-3 text-left">Provider Share</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Time</th>
            </tr>
          </thead>

          <tbody>

            {payments.map((pay)=>(

              <tr key={pay._id} className="border-t hover:bg-gray-50">

                <td className="p-3 font-medium">
                  {pay.travelerId?.name || "User"} {/* ✅ FIXED */}
                </td>

                <td className="p-3 capitalize">
                  {pay.serviceType}
                </td>

                <td className="p-3 font-semibold">
                  {formatCurrency(pay.amount)}
                  <p className="text-xs text-gray-500">
                    {numberToWords(pay.amount)}
                  </p>
                </td>

                <td className="p-3 text-green-600 font-bold">
                  {formatCurrency(pay.platformShare)}
                </td>

                <td className="p-3 text-blue-600">
                  {formatCurrency(pay.providerShare)}
                </td>

                <td className="p-3">

                  <span className={`px-3 py-1 rounded-full text-sm ${
                    pay.status==="success"
                      ? "bg-green-100 text-green-700"
                      : pay.status==="pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {pay.status}
                  </span>

                </td>

                <td className="p-3 text-sm text-gray-500">
                  {new Date(pay.createdAt).toLocaleString()}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>

  )

}

export default Payments;