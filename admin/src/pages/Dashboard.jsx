import { useEffect, useState } from "react";
import API from "../services/api";
import "./Dashboard.css";

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

    <div className="dashboard-container">

      {/* ================= HEADER ================= */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          👑 Admin Overview Control
        </h1>
        <p className="dashboard-subtitle">Real-time system totals, business metrics, and financial status.</p>
      </div>

      {/* ================= CARDS ================= */}
      <div className="metrics-grid">

        {/* USERS */}
        <div className="metric-card card-users">
          <div className="metric-card-top">
            <span className="metric-label">Travelers</span>
            <span className="metric-icon">👤</span>
          </div>
          <h2 className="metric-value">
            {stats.totalUsers}
          </h2>
          <p className="metric-card-desc">Registered customer accounts</p>
        </div>

        {/* PROVIDERS */}
        <div className="metric-card card-providers">
          <div className="metric-card-top">
            <span className="metric-label">Providers</span>
            <span className="metric-icon">🏨</span>
          </div>
          <h2 className="metric-value">
            {stats.totalProviders}
          </h2>
          <p className="metric-card-desc">Registered business agencies</p>
        </div>

        {/* BOOKINGS */}
        <div className="metric-card card-bookings">
          <div className="metric-card-top">
            <span className="metric-label">Bookings</span>
            <span className="metric-icon">📦</span>
          </div>
          <h2 className="metric-value">
            {stats.totalBookings}
          </h2>
          <p className="metric-card-desc">Completed reservations</p>
        </div>

        {/* REVENUE */}
        <div className="metric-card card-revenue">
          <div className="metric-card-top">
            <span className="metric-label">Total Sales</span>
            <span className="metric-icon">💰</span>
          </div>
          <h2 className="metric-value">
            {formatCurrency(stats.totalRevenue)}
          </h2>
          <p className="metric-card-desc capitalize">
            {numberToWords(stats.totalRevenue)} Rupees
          </p>
        </div>

      </div>

      {/* ================= EXTRA PANEL ================= */}
      <div className="analytics-panel">

        <h2 className="analytics-title">
          📊 Platform Analytics Summary
        </h2>

        <p className="analytics-text">
          Your tourism ecosystem is currently active with{" "}
          <span className="highlight-bold">{stats.totalUsers}</span> travelers and{" "}
          <span className="highlight-bold">{stats.totalProviders}</span> approved providers,
          generating a total gross value of{" "}
          <span className="highlight-revenue">
            {formatCurrency(stats.totalRevenue)}
          </span>{" "}
          across{" "}
          <span className="highlight-bold">{stats.totalBookings}</span> reservations.
        </p>
        
        <div className="analytics-subgrid">
          <div className="subgrid-item subgrid-item-orange">
            <p className="subgrid-label">Average Order Size</p>
            <p className="subgrid-value subgrid-val-orange">
              {stats.totalBookings > 0 ? formatCurrency(Math.floor(stats.totalRevenue / stats.totalBookings)) : "₹0.00"}
            </p>
          </div>
          <div className="subgrid-item subgrid-item-blue">
            <p className="subgrid-label">Customer-to-Partner Ratio</p>
            <p className="subgrid-value subgrid-val-blue">
              {stats.totalProviders > 0 ? `${(stats.totalUsers / stats.totalProviders).toFixed(1)}:1` : "0:0"}
            </p>
          </div>
          <div className="subgrid-item subgrid-item-purple">
            <p className="subgrid-label">Platform Revenue Share (25%)</p>
            <p className="subgrid-value subgrid-val-purple">
              {formatCurrency(Math.floor(stats.totalRevenue * 0.25))}
            </p>
          </div>
        </div>

      </div>

    </div>

  )

}

export default Dashboard;