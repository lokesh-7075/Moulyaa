import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login(){

  const navigate = useNavigate();

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");

  // =========================
  // ROLE-BASED REDIRECT
  // =========================
  useEffect(()=>{

    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if(token && user){

      if(user.role === "traveler"){
        return;
      }

      const roleRoutes = {
        admin: "/",
        hotel_owner: "/hotel-dashboard",
        vehicle_owner: "/vehicle-dashboard",
        restaurant_owner: "/restaurant-dashboard",
        tour_guide: "/guide-dashboard",
        event_organizer: "/event-dashboard"
      };

      navigate(roleRoutes[user.role] || "/");

    }

  },[navigate]);


  // =========================
  // LOGIN FUNCTION
  // =========================
  const handleLogin = async (e)=>{

    e.preventDefault();

    try{

      const res = await API.post("/auth/login",{ email, password });

      const token = res.data.token;
      const user = res.data.user;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      const roleRoutes = {
        admin: "/",
        hotel_owner: "/hotel-dashboard",
        vehicle_owner: "/vehicle-dashboard",
        restaurant_owner: "/restaurant-dashboard",
        tour_guide: "/guide-dashboard",
        event_organizer: "/event-dashboard"
      };

      navigate(roleRoutes[user.role] || "/");

    }
    catch(error){

      alert("Invalid credentials");

      localStorage.removeItem("token");
      localStorage.removeItem("user");

    }

  };


  // =========================
  // UI
  // =========================
  return (

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-rose-100 via-white to-orange-100 px-4">

      {/* GLASS CARD */}
      <div className="w-full max-w-md backdrop-blur-xl bg-white/60 border border-white/40 shadow-2xl rounded-3xl p-8 transition-all duration-500 hover:shadow-rose-200">

        {/* TITLE */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
          Welcome Back ✨
        </h2>

        <p className="text-center text-gray-500 mb-8">
          Login to continue your journey
        </p>


        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
          >
            Login
          </button>

        </form>


        {/* FOOTER */}
        <p className="text-center text-sm text-gray-500 mt-6">
          New here?{" "}
          <span
            onClick={()=>navigate("/register")}
            className="text-orange-500 font-semibold cursor-pointer hover:underline"
          >
            Create account
          </span>
        </p>

      </div>

    </div>

  );
}

export default Login;