import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import "./Layout.css";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (

    <div className="admin-layout-container">

      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* RIGHT SIDE */}
      <div className="layout-main-area">

        {/* NAVBAR */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        {/* CONTENT */}
        <main className="layout-content-box">
          {children}
        </main>

      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="mobile-sidebar-overlay"
        />
      )}

    </div>

  );

}

export default Layout;