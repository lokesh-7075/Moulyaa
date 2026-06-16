import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CalendarCheck,
  CreditCard,
  Wallet
} from "lucide-react";

function Sidebar() {

  const location = useLocation();

  const linkClass = (path) =>
    `flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
      location.pathname === path
        ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg scale-[1.02]"
        : "text-gray-200 hover:bg-white/10 hover:scale-[1.02]"
    }`;

  return (

    <div className="
      fixed top-0 left-0 h-full w-64 z-50
      bg-[#3b0a45]
      flex flex-col
      shadow-2xl
    ">

      {/* LOGO */}
      <div className="py-6 text-center border-b border-white/10">

        <h1 className="
          text-3xl font-extrabold tracking-wide
          bg-gradient-to-r from-pink-400 via-purple-400 to-orange-400
          bg-clip-text text-transparent
        ">
          Moulyas
        </h1>

        <p className="text-xs text-gray-300 mt-1">
          Admin Panel
        </p>

      </div>

      {/* MENU */}
      <div className="flex-1 px-4 py-6 space-y-3 overflow-y-auto">

        <Link to="/" className={linkClass("/")}>
          <LayoutDashboard size={18}/> Dashboard
        </Link>

        <Link to="/users" className={linkClass("/users")}>
          <Users size={18}/> Users
        </Link>

        <Link to="/providers" className={linkClass("/providers")}>
          <Briefcase size={18}/> Providers
        </Link>

        <Link to="/bookings" className={linkClass("/bookings")}>
          <CalendarCheck size={18}/> Bookings
        </Link>

        <Link to="/payments" className={linkClass("/payments")}>
          <CreditCard size={18}/> Payments
        </Link>

        <Link to="/balances" className={linkClass("/balances")}>
          <Wallet size={18}/> Balances
        </Link>

      </div>

    </div>

  );

}

export default Sidebar;