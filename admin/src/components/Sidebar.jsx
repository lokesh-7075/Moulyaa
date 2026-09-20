import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  CalendarCheck,
  CreditCard,
  Wallet
} from "lucide-react";
import "./Sidebar.css";

function Sidebar({ isOpen, setIsOpen }) {

  const location = useLocation();

  const linkClass = (path) =>
    `sidebar-link ${location.pathname === path ? "sidebar-link-active" : ""}`;

  return (

    <div className={`admin-sidebar ${isOpen ? "sidebar-open" : ""}`}>

      {/* MOBILE CLOSE */}
      <div className="mobile-close-header">
        <span className="mobile-close-title">Navigation</span>
        <button 
          onClick={() => setIsOpen(false)}
          className="mobile-close-btn"
        >
          ✕
        </button>
      </div>

      {/* LOGO */}
      <div className="sidebar-logo-section">

        <h1 className="sidebar-logo-text">
          Moulyas
        </h1>

        <p className="sidebar-logo-sub">
          Admin Panel
        </p>

      </div>

      {/* MENU */}
      <div className="sidebar-menu-list">

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