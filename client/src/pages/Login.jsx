import { useState, useEffect } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Login.css";

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

    <div className="login-container">

      {/* GLASS CARD */}
      <div className="login-card">

        {/* TITLE */}
        <h2 className="login-title">
          Welcome Back ✨
        </h2>

        <p className="login-subtitle">
          Login to continue your journey
        </p>


        {/* FORM */}
        <form onSubmit={handleLogin} className="login-form">

          {/* EMAIL */}
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            className="login-input"
          />

          {/* PASSWORD */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
            className="login-input"
          />

          {/* BUTTON */}
          <button
            type="submit"
            className="login-btn"
          >
            Login
          </button>

        </form>


        {/* FOOTER */}
        <p className="login-footer">
          New here?{" "}
          <span
            onClick={()=>navigate("/register")}
            className="create-account-link"
          >
            Create account
          </span>
        </p>

      </div>

    </div>

  );
}

export default Login;