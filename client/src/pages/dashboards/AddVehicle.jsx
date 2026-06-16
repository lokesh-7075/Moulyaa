import { useState } from "react";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

function AddVehicle(){

  const navigate = useNavigate();

  const [vehicleName,setVehicleName] = useState("");
  const [type,setType] = useState("car");
  const [pricePerDay,setPrice] = useState("");
  const [location,setLocation] = useState("");
  const [images,setImages] = useState([]);

  const handleSubmit = async(e)=>{

    e.preventDefault();

    const formData = new FormData();

    formData.append("vehicleName",vehicleName);
    formData.append("type",type);
    formData.append("pricePerDay",pricePerDay);
    formData.append("location",location);
    formData.append("availability",true);

    for(let i=0;i<images.length;i++){
      formData.append("images",images[i]);
    }

    try{

      await API.post("/vehicles/create",formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        }
      });

      alert("Vehicle added successfully");

      navigate("/vehicle-dashboard");

    }
    catch(error){

      console.error("Vehicle create error",error);
      alert("Failed to add vehicle");

    }

  };


  return(

    <div className="min-h-screen bg-white flex justify-center items-center px-4 transition-all duration-500">

      <form
        onSubmit={handleSubmit}
        className="bg-white border border-gray-200 p-10 rounded-xl shadow-xl w-[500px] transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]"
      >

        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center tracking-wide">
          🚗 Add Vehicle
        </h2>

        <input
          type="text"
          placeholder="Vehicle Name"
          className="w-full border border-gray-300 p-3 mb-4 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 focus:shadow-md hover:border-gray-400"
          onChange={(e)=>setVehicleName(e.target.value)}
          required
        />

        <select
          className="w-full border border-gray-300 p-3 mb-4 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 focus:shadow-md hover:border-gray-400"
          onChange={(e)=>setType(e.target.value)}
        >

          <option value="car">Car</option>
          <option value="bike">Bike</option>
          <option value="bus">Bus</option>
          <option value="van">Van</option>
          <option value="jeep">Jeep</option>

        </select>

        <input
          type="number"
          placeholder="Price Per Day"
          className="w-full border border-gray-300 p-3 mb-4 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 focus:shadow-md hover:border-gray-400"
          onChange={(e)=>setPrice(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Location"
          className="w-full border border-gray-300 p-3 mb-4 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 focus:shadow-md hover:border-gray-400"
          onChange={(e)=>setLocation(e.target.value)}
          required
        />

        <input
          type="file"
          multiple
          className="w-full mb-4 text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:scale-105 hover:file:bg-blue-700 transition-all duration-300 cursor-pointer"
          onChange={(e)=>setImages(e.target.files)}
        />

        <button
          className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-3 rounded-lg font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30 active:scale-95"
        >
          🚀 Add Vehicle
        </button>

      </form>

    </div>

  )

}

export default AddVehicle;