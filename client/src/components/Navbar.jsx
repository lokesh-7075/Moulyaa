import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { BASE_URL } from "../services/api";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [openProfile, setOpenProfile] = useState(false);
  const [openServices, setOpenServices] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const servicesRef = useRef(null);
  const authRef = useRef(null);
  const profileRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const providerRoles = [
    "hotel_owner",
    "vehicle_owner",
    "restaurant_owner",
    "tour_guide",
    "event_organizer"
  ];

  if (user && providerRoles.includes(user.role)) {
    return null;
  }

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setOpenServices(false);
      }
      if (authRef.current && !authRef.current.contains(e.target)) {
        setOpenAuth(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpenProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdowns on route change
  useEffect(() => {
    setOpenServices(false);
    setOpenAuth(false);
    setOpenProfile(false);
    setMobileMenu(false);
  }, [location.pathname]);

  // ================= IMAGE =================
  const getImage = (path) => {
    if (!path) {
      return "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    }
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/uploads/${path.replace(/^uploads\//, "")}`;
  };

  // ================= LOGOUT =================
  const logout = () => {
    localStorage.clear();
    navigate("/login");
    window.location.reload();
  };

  // ================= ACTIVE LINK CLASS =================
  const linkClass = (path) =>
    `relative px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
      location.pathname === path
        ? "text-white bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 shadow-md shadow-pink-500/30"
        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
    }`;

  const isServicesActive = ["/hotels", "/restaurants", "/vehicles", "/guides"].some(
    (p) => location.pathname.startsWith(p)
  );

  return (
    <>
      {/* ================= NAVBAR CONTAINER ================= */}
      <header className="fixed top-0 left-0 w-full z-[9999] backdrop-blur-2xl bg-slate-950/85 border-b border-purple-500/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-[76px] lg:h-[90px] flex items-center justify-between">

          {/* LEFT: MOBILE TRIGGER & MOULYASHREE BRAND */}
          <div className="flex items-center gap-4">
            {user?.role === "traveler" && (
              <button
                onClick={() => setMobileMenu(true)}
                className="text-2xl text-slate-300 hover:text-orange-400 transition lg:hidden"
                aria-label="Open navigation menu"
              >
                ☰
              </button>
            )}

            <div
              onClick={() => navigate("/")}
              className="cursor-pointer flex items-center gap-2.5 group"
            >
              <span className="text-3xl filter drop-shadow-md group-hover:scale-110 transition duration-300">
                🌍
              </span>
              <h1 className="text-3xl lg:text-4xl font-black tracking-tight bg-gradient-to-r from-orange-400 via-pink-400 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_2px_12px_rgba(244,63,94,0.45)]">
                Moulyashree
              </h1>
            </div>
          </div>

          {/* RIGHT: ALL NAVIGATION ITEMS RIGHT-ALIGNED */}
          <nav className="hidden lg:flex items-center gap-2 bg-slate-900/90 backdrop-blur-xl px-4 py-1.5 rounded-full border border-purple-500/25 shadow-xl">
            
            {/* 1. HOME */}
            <Link className={linkClass("/")} to="/">
              Home
            </Link>

            {/* 2. SERVICES DROPDOWN (Hotels, Restaurants, Vehicles, Guides) */}
            <div className="relative" ref={servicesRef}>
              <button
                type="button"
                onClick={() => setOpenServices(!openServices)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                  isServicesActive
                    ? "text-white bg-gradient-to-r from-orange-500 to-pink-500 shadow-md shadow-orange-500/30"
                    : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                }`}
              >
                <span>Services</span>
                <span className={`text-xs transition-transform duration-200 ${openServices ? "rotate-180" : ""}`}>
                  ▼
                </span>
              </button>

              {openServices && (
                <div className="absolute left-0 mt-3 w-56 bg-slate-900/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl shadow-2xl py-2 z-[9999]">
                  <Link
                    to="/hotels"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:text-white hover:bg-purple-950/60 transition"
                  >
                    <span className="text-lg">🏨</span>
                    <div>
                      <div className="font-semibold">Hotels & Stays</div>
                      <div className="text-xs text-slate-400">Luxury suites & homestays</div>
                    </div>
                  </Link>

                  <Link
                    to="/restaurants"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:text-white hover:bg-purple-950/60 transition"
                  >
                    <span className="text-lg">🍽️</span>
                    <div>
                      <div className="font-semibold">Restaurants & Dining</div>
                      <div className="text-xs text-slate-400">Authentic regional flavors</div>
                    </div>
                  </Link>

                  <Link
                    to="/vehicles"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:text-white hover:bg-purple-950/60 transition"
                  >
                    <span className="text-lg">🚗</span>
                    <div>
                      <div className="font-semibold">Vehicles & Cabs</div>
                      <div className="text-xs text-slate-400">Chauffeur & self-drive</div>
                    </div>
                  </Link>

                  <Link
                    to="/guides"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-200 hover:text-white hover:bg-purple-950/60 transition"
                  >
                    <span className="text-lg">👤</span>
                    <div>
                      <div className="font-semibold">Tour Guides</div>
                      <div className="text-xs text-slate-400">Certified local experts</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. AI PLANNER */}
            <Link
              className={`relative px-3.5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                location.pathname === "/ai-planner"
                  ? "text-white bg-gradient-to-r from-orange-500 to-pink-500 shadow-md shadow-pink-500/30"
                  : "text-orange-400 hover:text-orange-300 hover:bg-orange-500/10"
              }`}
              to="/ai-planner"
            >
              ✨ AI Planner
            </Link>

            {/* 4. BUNDLES */}
            <Link
              className={`relative px-3.5 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                location.pathname === "/bundle-bookings"
                  ? "text-white bg-gradient-to-r from-violet-600 to-pink-500 shadow-md shadow-violet-500/30"
                  : "text-violet-300 hover:text-violet-200 hover:bg-violet-500/10"
              }`}
              to="/bundle-bookings"
            >
              💎 Bundles
            </Link>

            {/* 5. SNAP & EXPLORE */}
            <Link className={linkClass("/snap-explore")} to="/snap-explore">
              📸 Snap & Explore
            </Link>

            {/* 6. EVENTS */}
            <Link className={linkClass("/events")} to="/events">
              🎉 Events
            </Link>

            {/* 7. AUTH DROPDOWN (Login, Register) OR USER PROFILE */}
            {!user ? (
              <div className="relative ml-2" ref={authRef}>
                <button
                  type="button"
                  onClick={() => setOpenAuth(!openAuth)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white text-sm font-bold shadow-lg shadow-pink-500/25 hover:scale-105 transition duration-300"
                >
                  <span>🔐 Account</span>
                  <span className={`text-xs transition-transform duration-200 ${openAuth ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </button>

                {openAuth && (
                  <div className="absolute right-0 mt-3 w-48 bg-slate-900/95 backdrop-blur-2xl border border-purple-500/30 rounded-2xl shadow-2xl py-2 z-[9999]">
                    <Link
                      to="/login"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:text-white hover:bg-purple-950/60 transition"
                    >
                      <span>🔑</span>
                      <span className="font-semibold">Login</span>
                    </Link>

                    <Link
                      to="/register"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-200 hover:text-white hover:bg-purple-950/60 transition"
                    >
                      <span>✨</span>
                      <span className="font-semibold">Register</span>
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative ml-2" ref={profileRef}>
                <img
                  src={getImage(user?.profileImage)}
                  alt="Profile"
                  onClick={() => setOpenProfile(!openProfile)}
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-purple-400/60 shadow-lg hover:scale-110 transition duration-300"
                />

                {openProfile && (
                  <div className="absolute right-0 mt-3 w-72 bg-slate-900/95 backdrop-blur-2xl border border-purple-500/30 rounded-3xl shadow-2xl p-5 z-[9999]">
                    <div className="flex items-center gap-3.5 mb-4 pb-3 border-b border-slate-800">
                      <img
                        src={getImage(user?.profileImage)}
                        alt="Profile"
                        className="w-12 h-12 rounded-full border border-purple-400/40"
                      />
                      <div>
                        <p className="font-bold text-slate-100">{user?.name}</p>
                        <p className="text-xs text-slate-400 truncate max-w-[170px]">{user?.email}</p>
                      </div>
                    </div>

                    <div className="space-y-1 mb-4">
                      <Link
                        to="/bundle-bookings"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-200 hover:bg-purple-900/40 hover:text-white transition"
                      >
                        <span>💎</span> My Bundles & Vouchers
                      </Link>
                      <Link
                        to="/my-bookings"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-200 hover:bg-purple-900/40 hover:text-white transition"
                      >
                        <span>📦</span> My Bookings
                      </Link>
                      <Link
                        to="/profile"
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-slate-200 hover:bg-purple-900/40 hover:text-white transition"
                      >
                        <span>👤</span> Profile Settings
                      </Link>
                    </div>

                    <button
                      onClick={logout}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold shadow hover:scale-102 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

          </nav>
        </div>
      </header>

      {/* ================= MOBILE SIDEBAR ================= */}
      <div className={`fixed inset-0 z-[10000] flex ${mobileMenu ? "visible" : "invisible"}`}>
        <div
          onClick={() => setMobileMenu(false)}
          className={`flex-1 bg-black/70 backdrop-blur-md transition-opacity duration-300 ${
            mobileMenu ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`w-80 h-full bg-slate-950 border-r border-purple-500/30 p-6 shadow-2xl transform transition duration-500 ease-out overflow-y-auto text-slate-100 ${
            mobileMenu ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* PROFILE */}
          <div className="flex items-center gap-4 mb-6 pb-4 border-b border-slate-800">
            <img
              src={getImage(user?.profileImage)}
              alt="User"
              className="w-12 h-12 rounded-full border border-purple-400"
            />
            <div>
              <h3 className="font-bold text-base text-white">{user?.name || "Traveler"}</h3>
              <p className="text-xs text-purple-300">{user?.email || "Moulyashree Tourist"}</p>
            </div>
          </div>

          {/* MOBILE NAV LINKS */}
          <div className="space-y-2">
            <button
              onClick={() => { navigate("/"); setMobileMenu(false); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-900 transition text-left"
            >
              <span>🏠</span>
              <span>Home</span>
            </button>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
                Services
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { navigate("/hotels"); setMobileMenu(false); }} className="text-left text-sm p-1.5 hover:text-orange-400">🏨 Hotels</button>
                <button onClick={() => { navigate("/restaurants"); setMobileMenu(false); }} className="text-left text-sm p-1.5 hover:text-orange-400">🍽️ Dining</button>
                <button onClick={() => { navigate("/vehicles"); setMobileMenu(false); }} className="text-left text-sm p-1.5 hover:text-orange-400">🚗 Vehicles</button>
                <button onClick={() => { navigate("/guides"); setMobileMenu(false); }} className="text-left text-sm p-1.5 hover:text-orange-400">👤 Guides</button>
              </div>
            </div>

            <button
              onClick={() => { navigate("/ai-planner"); setMobileMenu(false); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-900 transition text-left text-orange-400 font-semibold"
            >
              <span>✨</span>
              <span>AI Trip Planner</span>
            </button>

            <button
              onClick={() => { navigate("/bundle-bookings"); setMobileMenu(false); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-900 transition text-left text-violet-300 font-semibold"
            >
              <span>💎</span>
              <span>Bundle & Multi-Bookings</span>
            </button>

            <button
              onClick={() => { navigate("/snap-explore"); setMobileMenu(false); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-900 transition text-left"
            >
              <span>📸</span>
              <span>Snap & Explore</span>
            </button>

            <button
              onClick={() => { navigate("/events"); setMobileMenu(false); }}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-900 transition text-left"
            >
              <span>🎉</span>
              <span>Events</span>
            </button>

            {user && (
              <>
                <button
                  onClick={() => { navigate("/my-bookings"); setMobileMenu(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-900 transition text-left"
                >
                  <span>📦</span>
                  <span>My Bookings</span>
                </button>
                <button
                  onClick={() => { navigate("/profile"); setMobileMenu(false); }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-900 transition text-left"
                >
                  <span>👤</span>
                  <span>Profile</span>
                </button>
              </>
            )}
          </div>

          {/* MOBILE FOOTER AUTH */}
          <div className="mt-8 pt-4 border-t border-slate-800">
            {!user ? (
              <div className="space-y-2">
                <button
                  onClick={() => { navigate("/login"); setMobileMenu(false); }}
                  className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-semibold"
                >
                  Login
                </button>
                <button
                  onClick={() => { navigate("/register"); setMobileMenu(false); }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold"
                >
                  Register
                </button>
              </div>
            ) : (
              <button
                onClick={logout}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold shadow"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;