import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import AIChatWidget from "./AIChatWidget";

function Layout() {

  return (
    <div className="flex flex-col min-h-screen">

      {/* NAVBAR */}
      <Navbar />

      {/* MAIN CONTENT */}
      <main className="flex-1 px-4 md:px-8 py-6">
        <Outlet />
      </main>

      {/* FLOATING AI CHAT CONCIERGE */}
      <AIChatWidget />

      {/* FOOTER */}
      <Footer />

    </div>
  );
}

export default Layout;