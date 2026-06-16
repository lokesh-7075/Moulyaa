import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function CreateEvent(){

  const navigate = useNavigate();

  const [eventName,setEventName] = useState("");
  const [location,setLocation] = useState("");
  const [eventDate,setEventDate] = useState("");
  const [price,setPrice] = useState("");
  const [totalTickets,setTotalTickets] = useState("");
  const [category,setCategory] = useState("");
  const [description,setDescription] = useState("");
  const [images,setImages] = useState([]);

  const handleSubmit = async(e)=>{

    e.preventDefault();

    const formData = new FormData();

    formData.append("eventName",eventName);
    formData.append("location",location);
    formData.append("eventDate",eventDate);
    formData.append("price",price);
    formData.append("totalTickets",totalTickets);
    formData.append("category",category);
    formData.append("description",description);

    for(let i=0;i<images.length;i++){
      formData.append("images",images[i]);
    }

    try{

      await API.post("/events/create",formData);

      alert("Event created successfully");

      navigate("/event-dashboard");

    }
    catch(error){

      console.error("Create event error",error);
      alert("Failed to create event");

    }

  };

  return(

    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">

      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-xl bg-white/30 border border-white/40 p-8 rounded-2xl shadow-2xl w-96 transition-all duration-500 hover:shadow-purple-300/50 hover:scale-[1.02]"
      >

        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Create Event
        </h2>

        {/* Input */}
        <input
          placeholder="Event Name"
          className="border border-white/40 bg-white/40 backdrop-blur-md p-2 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 hover:bg-white/60"
          onChange={(e)=>setEventName(e.target.value)}
          required
        />

        <input
          placeholder="Location"
          className="border border-white/40 bg-white/40 backdrop-blur-md p-2 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 hover:bg-white/60"
          onChange={(e)=>setLocation(e.target.value)}
          required
        />

        <input
          type="date"
          className="border border-white/40 bg-white/40 backdrop-blur-md p-2 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 hover:bg-white/60"
          onChange={(e)=>setEventDate(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Ticket Price"
          className="border border-white/40 bg-white/40 backdrop-blur-md p-2 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 hover:bg-white/60"
          onChange={(e)=>setPrice(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Total Tickets"
          className="border border-white/40 bg-white/40 backdrop-blur-md p-2 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 hover:bg-white/60"
          onChange={(e)=>setTotalTickets(e.target.value)}
          required
        />

        {/* Select */}
        <select
          className="border border-white/40 bg-white/40 backdrop-blur-md p-2 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 hover:bg-white/60"
          onChange={(e)=>setCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          <option value="festival">Festival</option>
          <option value="adventure">Adventure</option>
          <option value="music">Music</option>
          <option value="culture">Culture</option>
          <option value="tour">Tour</option>
        </select>

        {/* Textarea */}
        <textarea
          placeholder="Description"
          className="border border-white/40 bg-white/40 backdrop-blur-md p-2 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 hover:bg-white/60"
          onChange={(e)=>setDescription(e.target.value)}
        />

        {/* File Input */}
        <input
          type="file"
          multiple
          className="mb-4 w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600 transition-all"
          onChange={(e)=>setImages(e.target.files)}
        />

        {/* Button */}
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-full p-2 rounded-lg font-semibold transition-all duration-300 hover:from-pink-500 hover:to-purple-500 hover:scale-105 hover:shadow-lg">
          Create Event
        </button>

      </form>

    </div>

  )

}

export default CreateEvent;