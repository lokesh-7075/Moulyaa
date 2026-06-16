import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {

  return (

    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-[#fdf4ff] via-[#f3e8ff] to-[#ffe4e6]">

      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col ml-64">

        {/* NAVBAR */}
        <Navbar />

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 mt-[70px]">
          {children}
        </main>

      </div>

    </div>

  );

}

export default Layout;