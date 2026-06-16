import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function AddHotel(){

  const navigate = useNavigate();

  const [hotelName,setHotelName] = useState("");
  const [location,setLocation] = useState("");
  const [images,setImages] = useState([]);
  const [loading,setLoading] = useState(false);

  const handleSubmit = async(e)=>{
    e.preventDefault();

    try{

      setLoading(true);

      const formData = new FormData();

      formData.append("hotelName",hotelName);
      formData.append("location",location);

      for(let i=0;i<images.length;i++){
        formData.append("images",images[i]);
      }

      await API.post("/hotels/create",formData);

      alert("Hotel created successfully 🎉");

      navigate("/hotel-dashboard");

    }
    catch(err){
      alert(err.response?.data?.message || "Error creating hotel");
    }
    finally{
      setLoading(false);
    }
  };

  return(

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-950 via-indigo-900 to-black px-4 transition-all duration-500">

      <form
        onSubmit={handleSubmit}
        className="relative bg-white/10 backdrop-blur-2xl border border-white/20 p-10 rounded-3xl shadow-2xl w-full max-w-md transition-all duration-500 hover:scale-[1.025] hover:shadow-purple-500/40"
      >

        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 blur-3xl opacity-40 pointer-events-none"></div>

        <h2 className="text-3xl font-extrabold mb-8 text-center text-white tracking-wide drop-shadow-lg">
          ✨ Create Hotel
        </h2>

        <input
          placeholder="Hotel Name"
          className="w-full bg-white/20 text-white placeholder-gray-300 border border-white/30 p-3 rounded-xl mb-5 outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-400 focus:scale-[1.02] focus:shadow-md focus:shadow-purple-500/30 hover:bg-white/30"
          onChange={(e)=>setHotelName(e.target.value)}
          required
        />

        <input
          placeholder="Location"
          className="w-full bg-white/20 text-white placeholder-gray-300 border border-white/30 p-3 rounded-xl mb-5 outline-none transition-all duration-300 focus:ring-2 focus:ring-pink-400 focus:scale-[1.02] focus:shadow-md focus:shadow-pink-500/30 hover:bg-white/30"
          onChange={(e)=>setLocation(e.target.value)}
          required
        />

        <div className="mb-6">
          <label className="block text-gray-300 mb-2 text-sm tracking-wide">
            Upload Images
          </label>

          <input
            type="file"
            multiple
            className="w-full text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-purple-500 file:to-indigo-500 file:text-white file:shadow-md file:shadow-purple-500/30 hover:file:scale-105 hover:file:shadow-lg transition-all duration-300 cursor-pointer"
            onChange={(e)=>setImages(e.target.files)}
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 text-white p-3 rounded-xl font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-purple-500/40 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {loading ? "Creating..." : "🚀 Create Hotel"}
        </button>

      </form>

    </div>

  );

}

export default AddHotel;