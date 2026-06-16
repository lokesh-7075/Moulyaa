import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar(){

  const location = useLocation();
  const navigate = useNavigate();

  const [open,setOpen] = useState(false);
  const [menu,setMenu] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const BASE_URL = "http://localhost:5000";

  const providerRoles = [
    "hotel_owner",
    "vehicle_owner",
    "restaurant_owner",
    "tour_guide",
    "event_organizer"
  ];

  if(user && providerRoles.includes(user.role)){
    return null;
  }

  // ================= IMAGE =================
  const getImage = (path) => {
    if (!path) {
      return "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    }
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/uploads/${path.replace(/^uploads\//,"")}`;
  };

  // ================= LOGOUT =================
  const logout = ()=>{
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  // ================= ACTIVE LINK =================
  const linkClass = (path) =>
    `relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
      location.pathname === path
        ? "text-white bg-gradient-to-r from-pink-500 to-orange-500 shadow-lg"
        : "text-gray-700 hover:text-orange-500"
    }`;

  return(

    <>
      {/* ================= NAVBAR ================= */}
      <div className="fixed top-0 left-0 w-full z-[9999] 
      backdrop-blur-2xl bg-white/30 border-b border-white/20 shadow-lg">

        <div className="max-w-7xl mx-auto px-6 h-[80px] lg:h-[110px] flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-5">

            {/* MENU */}
            {user?.role === "traveler" && (
              <button
                onClick={()=>setMenu(true)}
                className="text-3xl hover:scale-125 transition duration-300 text-gray-700"
              >
                ☰
              </button>
            )}

            {/* LOGO */}
            <div
              onClick={()=>navigate("/")}
              className="cursor-pointer flex items-center gap-3"
            >
              <span className="text-3xl">🌍</span>

              <h1 className="text-4xl font-extrabold tracking-wide 
              bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 
              bg-clip-text text-transparent drop-shadow-lg 
              font-[cursive]">
                Moulyas
              </h1>
            </div>

          </div>

          {/* LINKS */}
          <div className="hidden md:flex items-center gap-3 
          bg-white/60 backdrop-blur-xl px-5 py-2 rounded-full shadow-xl">

            <Link className={linkClass("/")} to="/">Home</Link>
            <Link className={linkClass("/hotels")} to="/hotels">Hotels</Link>
            <Link className={linkClass("/guides")} to="/guides">Guides</Link>
            <Link className={linkClass("/vehicles")} to="/vehicles">Vehicles</Link>
            <Link className={linkClass("/restaurants")} to="/restaurants">Restaurants</Link>
            <Link className={linkClass("/events")} to="/events">Events</Link>

            {!user ? (
              <>
                <Link className={linkClass("/login")} to="/login">Login</Link>
                <Link
                  to="/register"
                  className="ml-2 px-5 py-2 rounded-full 
                  bg-gradient-to-r from-orange-500 to-rose-500 
                  text-white shadow-lg hover:scale-105 transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="relative ml-3">

                <img
                  src={getImage(user?.profileImage)}
                  onClick={()=>setOpen(!open)}
                  className="w-11 h-11 rounded-full cursor-pointer border-2 border-white shadow-xl hover:scale-110 transition"
                />

                {/* DROPDOWN */}
                {open && (
                  <div className="absolute right-0 mt-4 w-72 
                  bg-white/80 backdrop-blur-2xl border border-white/40 
                  rounded-3xl shadow-2xl p-5 z-[9999]">

                    <div className="flex items-center gap-4 mb-4">

                      <img
                        src={getImage(user?.profileImage)}
                        className="w-14 h-14 rounded-full shadow"
                      />

                      <div>
                        <p className="font-bold text-lg">{user?.name}</p>
                        <p className="text-sm text-gray-500">{user?.email}</p>
                      </div>

                    </div>

                    <button
                      onClick={logout}
                      className="w-full py-2 rounded-xl 
                      bg-gradient-to-r from-red-500 to-rose-500 
                      text-white shadow hover:scale-105 transition"
                    >
                      Logout
                    </button>

                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      </div>

      {/* ================= SIDEBAR ================= */}
      <div className={`fixed inset-0 z-[10000] flex ${menu ? "visible" : "invisible"}`}>

        {/* OVERLAY */}
        <div
          onClick={()=>setMenu(false)}
          className={`flex-1 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            menu ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* PANEL */}
        <div
          className={`w-80 h-full 
          bg-gradient-to-br from-white via-pink-50 to-orange-50
          p-6 shadow-2xl transform transition duration-500 ease-out
          ${menu ? "translate-x-0" : "-translate-x-full"}`}
        >

          {/* PROFILE */}
          <div className="flex items-center gap-4 mb-8">

            <img
              src={getImage(user?.profileImage)}
              className="w-14 h-14 rounded-full shadow"
            />

            <div>
              <h3 className="font-bold text-lg">{user?.name}</h3>
              <p className="text-sm text-gray-500">Traveler</p>
            </div>

          </div>

          {/* MENU */}
          <div className="space-y-4">

            {[
              {label:"My Bookings",icon:"📦",path:"/my-bookings"},
              {label:"Transactions",icon:"💳",path:"/my-payments"},
              {label:"Profile",icon:"👤",path:"/profile"}
            ].map((item,i)=>(
              <button
                key={i}
                onClick={()=>{
                  navigate(item.path);
                  setMenu(false);
                }}
                className="w-full flex items-center gap-4 p-3 rounded-xl 
                hover:bg-white/70 hover:shadow-md transition"
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}

          </div>

          {/* FOOTER */}
          <div className="absolute bottom-6 left-6 right-6">

            <button
              onClick={logout}
              className="w-full py-3 rounded-xl 
              bg-gradient-to-r from-red-500 to-pink-500 
              text-white shadow-lg hover:scale-105 transition"
            >
              Logout
            </button>

          </div>

        </div>

      </div>

    </>
  );
}

export default Navbar;