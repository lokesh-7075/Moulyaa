import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {

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
    }
  }

  const logout = ()=>{
    localStorage.clear();
    navigate("/login");
  };

  return (

    <div className="
      fixed top-0 left-64 right-0 z-40 h-[70px]
      backdrop-blur-xl bg-white/40 border-b border-white/30
      flex items-center justify-between px-6
      shadow-lg
    ">

      {/* TITLE */}
      <h1 className="
        text-xl font-bold
        bg-gradient-to-r from-purple-600 to-pink-500
        bg-clip-text text-transparent
      ">
        Dashboard Overview
      </h1>

      {/* RIGHT */}
      <div className="flex items-center gap-4">

        <p className="hidden md:block text-sm text-gray-700">
          Welcome, <span className="font-semibold">{user?.name}</span>
        </p>

        <div className="relative">

          <img
            src={imageUrl}
            onClick={()=>setOpen(!open)}
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-white shadow hover:scale-110 transition"
          />

          {open && (
            <div className="
              absolute right-0 mt-3 w-60
              bg-white/90 backdrop-blur-xl
              rounded-2xl shadow-2xl p-4
            ">

              <div className="flex items-center gap-3 mb-3">
                <img src={imageUrl} className="w-12 h-12 rounded-full"/>
                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.role}</p>
                </div>
              </div>

              <button
                onClick={logout}
                className="
                  w-full py-2 rounded-xl
                  bg-gradient-to-r from-red-500 to-pink-500
                  text-white hover:scale-105 transition
                "
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