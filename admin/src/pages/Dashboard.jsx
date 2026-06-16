import { useEffect, useState } from "react";
import API from "../services/api";

function Dashboard(){

  const [stats,setStats] = useState({
    totalUsers:0,
    totalProviders:0,
    totalBookings:0,
    totalRevenue:0
  });

  const [loading,setLoading] = useState(true);

  // ================= FORMAT =================
  const formatCurrency = (num)=>{
    return new Intl.NumberFormat("en-IN",{
      style:"currency",
      currency:"INR"
    }).format(num || 0);
  };

  // ================= WORD FORMAT =================
  const numberToWords = (num)=>{
    if(!num) return "Zero";

    const a = [
      "", "One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
      "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"
    ];

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
  const fetchStats = async ()=>{
    try{
      const res = await API.get("/admin/dashboard-stats");
      setStats(res.data || {});
    }
    catch(error){
      console.error("Dashboard stats error:",error);
    }
    finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchStats();
  },[]);

  // ================= LOADING =================
  if(loading){
    return(
      <div className="min-h-screen flex items-center justify-center text-xl font-semibold">
        Loading dashboard...
      </div>
    )
  }

  return(

    <div className="min-h-screen p-8 bg-gradient-to-br from-orange-50 via-white to-pink-50">

      {/* ================= HEADER ================= */}
      <h1 className="
        text-4xl font-extrabold mb-10
        bg-gradient-to-r from-orange-500 via-pink-500 to-rose-500
        bg-clip-text text-transparent
        drop-shadow-lg
      ">
        🚀 Admin Dashboard Overview
      </h1>

      {/* ================= CARDS ================= */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* USERS */}
        <div className="card hover:shadow-orange-300">
          <p className="text-gray-500 mb-2">👤 Travelers</p>
          <h2 className="text-3xl font-bold text-orange-600">
            {stats.totalUsers}
          </h2>
        </div>

        {/* PROVIDERS */}
        <div className="card hover:shadow-blue-300">
          <p className="text-gray-500 mb-2">🏨 Providers</p>
          <h2 className="text-3xl font-bold text-blue-600">
            {stats.totalProviders}
          </h2>
        </div>

        {/* BOOKINGS */}
        <div className="card hover:shadow-purple-300">
          <p className="text-gray-500 mb-2">📦 Bookings</p>
          <h2 className="text-3xl font-bold text-purple-600">
            {stats.totalBookings}
          </h2>
        </div>

        {/* REVENUE */}
        <div className="card hover:shadow-green-300">
          <p className="text-gray-500 mb-2">💰 Revenue</p>
          <h2 className="text-3xl font-bold text-green-600">
            {formatCurrency(stats.totalRevenue)}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {numberToWords(stats.totalRevenue)}
          </p>
        </div>

      </div>

      {/* ================= EXTRA PANEL ================= */}
      <div className="mt-12">

        <div className="card">

          <h2 className="text-xl font-bold mb-3 text-pink-600">
            📊 Platform Summary
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Your platform currently has{" "}
            <span className="font-semibold">{stats.totalUsers}</span> travelers and{" "}
            <span className="font-semibold">{stats.totalProviders}</span> providers,
            generating{" "}
            <span className="font-semibold text-green-600">
              {formatCurrency(stats.totalRevenue)}
            </span>{" "}
            revenue through{" "}
            <span className="font-semibold">{stats.totalBookings}</span> bookings.
          </p>

        </div>

      </div>

    </div>

  )

}

export default Dashboard;