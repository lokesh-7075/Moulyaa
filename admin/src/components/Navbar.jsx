import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar({ onMenuClick }) {

  const navigate = useNavigate();
  const [open,setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const BASE_URL = "http://localhost:5000";

  let imageUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

  if(user?.profileImage){
    const clean = user.profileImage.replace(/\\/g,"/");
    const index = clean.indexOf("uploads/");
    if(index !== -1){
      imageUrl = `${BASE_URL}/${clean.substring(index)}`;
    } else {
      imageUrl = `${BASE_URL}/uploads/${clean}`;
    }
  }

  const logout = ()=>{
    localStorage.clear();
    navigate("/login");
  };

  return (

    <div className="admin-navbar">

      {/* LEFT AREA: TITLE & HAMBURGER */}
      <div className="navbar-left">
        <button
          onClick={onMenuClick}
          className="hamburger-btn"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <h1 className="navbar-title">
          Dashboard Overview
        </h1>
      </div>

      {/* RIGHT */}
      <div className="navbar-right">

        <p className="welcome-msg">
          Welcome, <span className="welcome-name">{user?.name}</span>
        </p>

        <div className="profile-dropdown-wrapper">

          <img
            src={imageUrl}
            onClick={()=>setOpen(!open)}
            className="navbar-profile-avatar"
          />

          {open && (
            <div className="navbar-dropdown">

              <div className="dropdown-user-header">
                <img src={imageUrl} className="dropdown-avatar-img"/>
                <div>
                  <p className="dropdown-user-name">{user?.name}</p>
                  <p className="dropdown-user-role">{user?.role}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="navbar-logout-btn"
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>

    </div>

  );

}

export default Navbar;