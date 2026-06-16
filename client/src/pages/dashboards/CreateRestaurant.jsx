import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function CreateRestaurant(){

  const navigate = useNavigate();

  const [restaurantName,setRestaurantName] = useState("");
  const [location,setLocation] = useState("");
  const [description,setDescription] = useState("");
  const [images,setImages] = useState([]);

  const handleSubmit = async(e)=>{

    e.preventDefault();

    const formData = new FormData();

    formData.append("restaurantName",restaurantName);
    formData.append("location",location);
    formData.append("description",description);

    for(let i=0;i<images.length;i++){
      formData.append("images",images[i]);
    }

    try{

      await API.post("/restaurants/create",formData);

      alert("Restaurant created successfully");

      navigate("/restaurant-dashboard");

    }
    catch(error){

      console.error("Create restaurant error:",error);

      if(error.response?.data?.message){
        alert(error.response.data.message);
      }

    }

  };

  return(

    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-emerald-900 via-green-900 to-black px-4 transition-all duration-500">

      <form 
        onSubmit={handleSubmit} 
        className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 shadow-2xl rounded-2xl w-96 transition-all duration-500 hover:scale-[1.03] hover:shadow-green-500/30"
      >

        <h2 className="text-xl font-bold mb-4 text-white text-center tracking-wide drop-shadow-lg">
          🍽️ Create Restaurant
        </h2>

        <input
          placeholder="Restaurant Name"
          className="border border-white/30 bg-white/20 text-white placeholder-gray-300 p-2 w-full mb-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-green-400 focus:scale-[1.02] hover:bg-white/30"
          onChange={(e)=>setRestaurantName(e.target.value)}
          required
        />

        <input
          placeholder="Location"
          className="border border-white/30 bg-white/20 text-white placeholder-gray-300 p-2 w-full mb-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-emerald-400 focus:scale-[1.02] hover:bg-white/30"
          onChange={(e)=>setLocation(e.target.value)}
        />

        <textarea
          placeholder="Description"
          className="border border-white/30 bg-white/20 text-white placeholder-gray-300 p-2 w-full mb-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-teal-400 focus:scale-[1.02] hover:bg-white/30"
          onChange={(e)=>setDescription(e.target.value)}
        />

        <input
          type="file"
          multiple
          className="w-full text-gray-300 mb-3 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-green-500 file:to-emerald-500 file:text-white hover:file:scale-105 transition-all duration-300 cursor-pointer"
          onChange={(e)=>setImages(e.target.files)}
        />

        <button className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white p-2 w-full rounded-lg font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/40 active:scale-95">
          🚀 Create Restaurant
        </button>

      </form>

    </div>

  )

}

export default CreateRestaurant;