import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function AddRoom(){

  const navigate = useNavigate();

  const [hotel,setHotel] = useState(null);

  const [title,setTitle] = useState("");
  const [price,setPrice] = useState("");
  const [capacity,setCapacity] = useState("");
  const [bedType,setBedType] = useState("");
  const [images,setImages] = useState([]);

  useEffect(()=>{

    const fetchHotel = async()=>{
      try{
        const res = await API.get("/hotels/my-hotel");
        setHotel(res.data);
      }catch(err){
        console.error(err);
      }
    };

    fetchHotel();

  },[]);

  const handleSubmit = async(e)=>{

    e.preventDefault();

    if(!hotel || !hotel._id){
      alert("Create hotel first");
      return;
    }

    try{

      const formData = new FormData();

      formData.append("hotelId", hotel._id);
      formData.append("title", title);
      formData.append("price", price);
      formData.append("capacity", capacity);
      formData.append("bedType", bedType);

      for(let i=0;i<images.length;i++){
        formData.append("roomImages", images[i]);
      }

      await API.post("/rooms/create", formData);

      alert("Room added successfully 🏨");

      navigate("/hotel-dashboard");

    }
    catch(err){
      console.error("ROOM ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Error adding room");
    }

  };

  if(!hotel){
    return <p className="text-center mt-10 text-gray-300 text-lg animate-pulse">Create hotel first</p>;
  }

  return(

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-indigo-900 to-black transition-all duration-500">

      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl w-[400px] transition-all duration-500 hover:scale-[1.03] hover:shadow-purple-500/40"
      >

        <h2 className="text-xl font-bold mb-4 text-white text-center tracking-wide">
          Add Room
        </h2>

        <input
          placeholder="Room Title"
          className="border border-white/30 bg-white/20 text-white placeholder-gray-300 p-2 w-full mb-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-400 focus:scale-[1.02] hover:bg-white/30"
          onChange={(e)=>setTitle(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          className="border border-white/30 bg-white/20 text-white placeholder-gray-300 p-2 w-full mb-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-pink-400 focus:scale-[1.02] hover:bg-white/30"
          onChange={(e)=>setPrice(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Capacity"
          className="border border-white/30 bg-white/20 text-white placeholder-gray-300 p-2 w-full mb-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-400 focus:scale-[1.02] hover:bg-white/30"
          onChange={(e)=>setCapacity(e.target.value)}
        />

        <input
          placeholder="Bed Type"
          className="border border-white/30 bg-white/20 text-white placeholder-gray-300 p-2 w-full mb-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-300 focus:scale-[1.02] hover:bg-white/30"
          onChange={(e)=>setBedType(e.target.value)}
        />

        <input
          type="file"
          multiple
          className="w-full text-gray-300 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-indigo-500 file:to-purple-500 file:text-white hover:file:scale-105 transition-all duration-300 cursor-pointer"
          onChange={(e)=>setImages(e.target.files)}
        />

        <button className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white w-full p-2 rounded-lg mt-3 font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/40 active:scale-95">
          Add Room
        </button>

      </form>

    </div>

  );

}

export default AddRoom;