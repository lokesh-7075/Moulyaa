import { useEffect, useState } from "react";
import API from "../services/api";

function Balances(){

  const [data,setData] = useState({});
  const [loading,setLoading] = useState(true);

  // ================= FORMAT ₹ =================
  const format = (num)=>{
    return new Intl.NumberFormat("en-IN",{
      style:"currency",
      currency:"INR"
    }).format(num || 0);
  };

  // ================= NUMBER → WORDS =================
  const numberToWords = (num)=>{

    if(!num || num === 0) return "Zero Rupees";

    const a = [
      "", "One", "Two", "Three", "Four", "Five",
      "Six", "Seven", "Eight", "Nine", "Ten",
      "Eleven", "Twelve", "Thirteen", "Fourteen",
      "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"
    ];

    const b = [
      "", "", "Twenty", "Thirty", "Forty",
      "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
    ];

    const convert = (n)=>{
      if(n < 20) return a[n];
      if(n < 100) return b[Math.floor(n/10)] + " " + a[n%10];
      if(n < 1000) return a[Math.floor(n/100)] + " Hundred " + convert(n%100);
      if(n < 100000) return convert(Math.floor(n/1000)) + " Thousand " + convert(n%1000);
      if(n < 10000000) return convert(Math.floor(n/100000)) + " Lakh " + convert(n%100000);
      return convert(Math.floor(n/10000000)) + " Crore " + convert(n%10000000);
    };

    return convert(num) + " Rupees";
  };

  // ================= FETCH =================
  const fetchBalances = async()=>{
    try{
      const res = await API.get("/admin/balances");
      setData(res.data || {});
    }
    catch(error){
      console.error("Balance fetch error:",error);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchBalances();
  },[]);

  // ================= LOADING =================
  if(loading){
    return(
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading balances...
      </div>
    )
  }

  return(

    <div className="min-h-screen p-8 bg-gradient-to-br from-orange-50 via-white to-pink-50 space-y-12">

      {/* ================= HEADER ================= */}
      <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
        💰 Platform Financial Dashboard
      </h1>

      {/* ================= SUMMARY ================= */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="card">
          <p className="text-gray-500">Provider Earnings</p>
          <h2 className="text-2xl font-bold">
            {format(data.providerBalance)}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {numberToWords(data.providerBalance)}
          </p>
        </div>

        <div className="card">
          <p className="text-gray-500">Platform Revenue</p>
          <h2 className="text-2xl font-bold text-green-600">
            {format(data.platformRevenue)}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {numberToWords(data.platformRevenue)}
          </p>
        </div>

        <div className="card">
          <p className="text-gray-500">Provider Paid Revenue</p>
          <h2 className="text-2xl font-bold text-blue-600">
            {format(data.providerRevenue)}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {numberToWords(data.providerRevenue)}
          </p>
        </div>

        <div className="card">
          <p className="text-gray-500">Transactions</p>
          <h2 className="text-2xl font-bold">
            {data.totalTransactions || 0}
          </h2>
        </div>

      </div>

      {/* ================= ROLE WISE ================= */}
      <div>

        <h2 className="text-2xl font-bold mb-4 text-orange-600">
          📊 Role-wise Earnings
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {Object.keys(data.roleWise || {}).length === 0 && (
            <p className="text-gray-500">No role data available</p>
          )}

          {Object.entries(data.roleWise || {}).map(([role,value])=>(
            <div key={role} className="card">

              <p className="capitalize text-gray-500">
                {role.replace("_"," ")}
              </p>

              <h2 className="text-xl font-bold text-orange-600">
                {format(value)}
              </h2>

              <p className="text-xs text-gray-500 mt-1">
                {numberToWords(value)}
              </p>

            </div>
          ))}

        </div>

      </div>

      {/* ================= PROVIDERS ================= */}
      <div>

        <h2 className="text-2xl font-bold mb-4 text-pink-600">
          👨‍💼 Provider Earnings
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {(!data.providers || data.providers.length === 0) && (
            <p className="text-gray-500">No providers found</p>
          )}

          {data.providers?.map(p=>(
            <div
              key={p._id}
              className="bg-white/60 backdrop-blur-xl p-5 rounded-2xl shadow hover:shadow-2xl hover:-translate-y-1 transition"
            >

              <h3 className="font-bold text-lg">
                {p.name}
              </h3>

              <p className="text-sm text-gray-500 capitalize">
                {p.role.replace("_"," ")}
              </p>

              <p className="mt-3 text-xl font-bold text-blue-600">
                {format(p.balance)}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {numberToWords(p.balance)}
              </p>

            </div>
          ))}

        </div>

      </div>

    </div>

  )

}

export default Balances;