import { useEffect,useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import API from "../../services/api";

function EditEvent(){

  const navigate = useNavigate();
  const { id } = useParams();

  const [eventName,setEventName] = useState("");
  const [location,setLocation] = useState("");
  const [eventDate,setEventDate] = useState("");
  const [price,setPrice] = useState("");
  const [totalTickets,setTotalTickets] = useState("");
  const [category,setCategory] = useState("");
  const [description,setDescription] = useState("");
  const [images,setImages] = useState([]);

  const [loading,setLoading] = useState(true);

  const fetchEvent = async()=>{

    try{

      const res = await API.get(`/events/${id}`);

      const e = res.data;

      setEventName(e.eventName || "");
      setLocation(e.location || "");
      setEventDate(e.eventDate?.substring(0,10) || "");
      setPrice(e.price || "");
      setTotalTickets(e.totalTickets || "");
      setCategory(e.category || "");
      setDescription(e.description || "");

    }
    catch(error){

      console.error("Fetch event error",error);
      alert("Failed to load event");

    }
    finally{
      setLoading(false);
    }

  };

  useEffect(()=>{
    if(id) fetchEvent();
  },[id]);

  const handleSubmit = async(e)=>{

    e.preventDefault();

    try{

      if(images.length > 0){

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

        await API.put(`/events/update/${id}`,formData);

      } else {

        await API.put(`/events/update/${id}`,{
          eventName,
          location,
          eventDate,
          price:Number(price),
          totalTickets:Number(totalTickets),
          category,
          description
        });

      }

      alert("Event updated successfully");

      navigate("/manage-events");

    }
    catch(error){

      console.error("Update event error",error);
      alert("Failed to update event");

    }

  };

  if(loading){
    return(
      <div className="flex justify-center items-center h-screen text-xl bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">
        Loading event...
      </div>
    )
  }

  return(

    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200">

      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-xl bg-white/30 border border-white/40 p-8 rounded-2xl shadow-2xl w-96 transition-all duration-500 hover:shadow-purple-300/50 hover:scale-[1.02]"
      >

        <h2 className="text-3xl font-bold mb-5 text-center text-gray-800">
          Edit Event
        </h2>

        <input
          value={eventName}
          placeholder="Event Name"
          className="border border-white/40 bg-white/40 backdrop-blur-md p-2 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 hover:bg-white/60"
          onChange={(e)=>setEventName(e.target.value)}
          required
        />

        <input
          value={location}
          placeholder="Location"
          className="border border-white/40 bg-white/40 backdrop-blur-md p-2 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 hover:bg-white/60"
          onChange={(e)=>setLocation(e.target.value)}
          required
        />

        <input
          type="date"
          value={eventDate}
          className="border border-white/40 bg-white/40 backdrop-blur-md p-2 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 hover:bg-white/60"
          onChange={(e)=>setEventDate(e.target.value)}
          required
        />

        <input
          type="number"
          value={price}
          placeholder="Price"
          className="border border-white/40 bg-white/40 backdrop-blur-md p-2 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 hover:bg-white/60"
          onChange={(e)=>setPrice(e.target.value)}
          required
        />

        <input
          type="number"
          value={totalTickets}
          placeholder="Total Tickets"
          className="border border-white/40 bg-white/40 backdrop-blur-md p-2 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 hover:bg-white/60"
          onChange={(e)=>setTotalTickets(e.target.value)}
          required
        />

        <select
          value={category}
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

        <textarea
          value={description}
          placeholder="Description"
          className="border border-white/40 bg-white/40 backdrop-blur-md p-2 w-full mb-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 hover:bg-white/60"
          onChange={(e)=>setDescription(e.target.value)}
        />

        <input
          type="file"
          multiple
          className="mb-4 w-full text-sm text-gray-700 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white hover:file:bg-purple-600 transition-all"
          onChange={(e)=>setImages(e.target.files)}
        />

        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white w-full p-2 rounded-lg font-semibold transition-all duration-300 hover:from-pink-500 hover:to-purple-500 hover:scale-105 hover:shadow-lg">
          Update Event
        </button>

      </form>

    </div>

  )

}

export default EditEvent;