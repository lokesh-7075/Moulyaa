import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function ManageEvents(){

  const navigate = useNavigate();

  const [events,setEvents] = useState([]);
  const [loading,setLoading] = useState(true);


  // =========================
  // FETCH EVENTS
  // =========================

  const fetchEvents = async()=>{

    try{

      const res = await API.get("/events/my-events");

      setEvents(res.data || []);

    }
    catch(error){

      console.error("Fetch events error",error);

    }
    finally{

      setLoading(false);

    }

  };


  useEffect(()=>{
    fetchEvents();
  },[]);


  // =========================
  // DELETE EVENT
  // =========================

  const deleteEvent = async(id)=>{

    if(!window.confirm("Delete this event?")) return;

    try{

      await API.delete(`/events/delete/${id}`);

      setEvents(events.filter(e => e._id !== id));

    }
    catch(error){

      console.error("Delete event error",error);

    }

  };


  if(loading){

    return(
      <div className="flex justify-center items-center h-screen text-xl">
        Loading events...
      </div>
    )

  }


  return(

    <div className="min-h-screen bg-gray-100 p-10">

      <h2 className="text-3xl font-bold mb-8">
        🛠 Manage Your Events
      </h2>


      {events.length === 0 && (
        <p className="text-gray-500">
          No events created yet
        </p>
      )}


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {events.map(event=>(

          <div key={event._id}
               className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">

            {/* IMAGE */}

            <img
              src={
                event.images?.length > 0
                ? `http://localhost:5000/${event.images[0]}`
                : "https://via.placeholder.com/400x200"
              }
              className="h-48 w-full object-cover"
            />

            {/* CONTENT */}

            <div className="p-5">

              <h3 className="text-xl font-bold mb-2">
                {event.eventName}
              </h3>

              <p className="text-gray-600 text-sm mb-2">
                📍 {event.location}
              </p>

              <p className="text-gray-600 text-sm mb-2">
                📅 {new Date(event.eventDate).toLocaleDateString()}
              </p>

              <p className="text-gray-700 font-semibold mb-4">
                ₹{event.price}
              </p>


              {/* ACTION BUTTONS */}

              <div className="flex gap-3">

                <button
                  onClick={()=>navigate(`/edit-event/${event._id}`)}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Edit
                </button>

                <button
                  onClick={()=>deleteEvent(event._id)}
                  className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>

  )

}

export default ManageEvents;