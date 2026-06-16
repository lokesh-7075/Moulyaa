import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function EventDashboard(){

  const navigate = useNavigate();

  const [events,setEvents] = useState([]);
  const [bookings,setBookings] = useState([]);
  const [earnings,setEarnings] = useState(0);
  const [loading,setLoading] = useState(true);
  const [open,setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const BASE_URL = "http://localhost:5000";

  // ✅ IMAGE FIX FUNCTION (NO DUPLICATES)
  const getImage = (path)=>{
    if(!path) return "https://cdn-icons-png.flaticon.com/512/847/847969.png";

    if(path.startsWith("http")) return path;

    const cleanPath = path.replace(/\\/g, "/").replace(/^\/+/, "");

    if(cleanPath.startsWith("uploads")){
      return `${BASE_URL}/${cleanPath}`;
    }

    return `${BASE_URL}/uploads/${cleanPath}`;
  };

  // =====================
  // FETCH DATA
  // =====================
  const fetchData = async()=>{
    try{
      const [eventRes,bookingRes,earningRes] = await Promise.all([
        API.get("/events/my-events"),
        API.get("/bookings/provider"),
        API.get("/payments/provider-earnings")
      ]);

      setEvents(eventRes.data || []);
      setBookings(bookingRes.data?.bookings || bookingRes.data || []);
      setEarnings(earningRes.data.totalEarnings || 0);

    }catch(err){
      console.error(err);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchData();
  },[]);


  // =====================
  // STATS
  // =====================
  const upcomingEvents = events.filter(
    e => e.eventDate && new Date(e.eventDate) > new Date()
  );

  const totalBookings = bookings.length;

  const logout = ()=>{
    localStorage.clear();
    navigate("/login");
  };


  if(loading){
    return(
      <div className="flex justify-center items-center h-screen text-xl">
        Loading dashboard...
      </div>
    )
  }


  return(

    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-white">

      {/* TOP BAR */}
      <div className="flex justify-between items-center px-10 py-5 backdrop-blur-lg bg-white/60 shadow-md">

        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-pink-500 to-purple-600 text-transparent bg-clip-text">
          Moulyas ✨
        </h1>

        <div className="relative">

          {/* ✅ PROFILE IMAGE FIX */}
          <img
            src={getImage(user?.profileImage)}
            onError={(e)=>{
              e.target.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
            }}
            className="w-11 h-11 rounded-full object-cover cursor-pointer border-2 border-purple-400 hover:scale-110 transition"
            onClick={()=>setOpen(!open)}
          />

          {open && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl p-4">

              <div className="flex gap-3 mb-3">

                {/* ✅ DROPDOWN IMAGE FIX */}
                <img
                  src={getImage(user?.profileImage)}
                  onError={(e)=>{
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
                  }}
                  className="w-12 h-12 rounded-full object-cover"
                />

                <div>
                  <p className="font-semibold">{user?.name}</p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

              </div>

              <button
                onClick={logout}
                className="w-full text-red-500 hover:bg-red-50 p-2 rounded-lg"
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>


      {/* BODY */}
      <div className="p-10">

        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          🎉 Event Organizer Dashboard
        </h2>


        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">

          {[
            {title:"Total Events",value:events.length,color:"from-purple-400 to-purple-600"},
            {title:"Upcoming",value:upcomingEvents.length,color:"from-green-400 to-green-600"},
            {title:"Bookings",value:totalBookings,color:"from-blue-400 to-blue-600"},
            {title:"Earnings",value:`₹${earnings}`,color:"from-pink-400 to-pink-600"}
          ].map((card,i)=>(
            <div key={i}
              className={`bg-gradient-to-r ${card.color} text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition duration-300`}
            >
              <p className="text-sm opacity-80">{card.title}</p>
              <h3 className="text-3xl font-bold mt-2">{card.value}</h3>
            </div>
          ))}

        </div>


        {/* ACTIONS */}
        <div className="grid md:grid-cols-4 gap-6 mb-10">

          {[
            {title:"Create Event",path:"/create-event"},
            {title:"Manage Events",path:"/manage-events"},
            {title:"Bookings",path:"/event-bookings"}
          ].map((item,i)=>(
            <div key={i}
              onClick={()=>navigate(item.path)}
              className="bg-white/70 backdrop-blur-xl p-6 rounded-2xl shadow hover:shadow-2xl hover:-translate-y-1 cursor-pointer transition"
            >
              <h3 className="font-semibold">{item.title}</h3>
            </div>
          ))}

        </div>


        {/* EVENTS GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {events.map(event=>{

            const eventBookings = bookings.filter(
              b => b.serviceId?.toString() === event._id?.toString()
            ).length;

            return(

              <div
                key={event._id}
                className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl hover:scale-[1.02] transition duration-300"
              >

                {/* ✅ EVENT IMAGE FIX */}
                <img
                  src={
                    event.images?.length
                    ? getImage(event.images[0])
                    : "https://via.placeholder.com/400"
                  }
                  onError={(e)=>{
                    e.target.src = "https://via.placeholder.com/400";
                  }}
                  className="h-44 w-full object-cover"
                />

                <div className="p-5">

                  <h4 className="font-bold text-lg">
                    {event.title}
                  </h4>

                  <p className="text-gray-500 text-sm">
                    📍 {event.location}
                  </p>

                  {/* ✅ DATE FIX */}
                  <p className="text-gray-500 text-sm">
                    📅 {
                      event.eventDate
                      ? new Date(event.eventDate).toLocaleDateString("en-IN")
                      : "No Date"
                    }
                  </p>

                  <p className="text-purple-600 font-semibold mt-2">
                    ₹{event.price}
                  </p>

                  <p className="text-sm text-gray-600 mt-1">
                    🎟 Bookings: {eventBookings}
                  </p>

                  <div className="flex justify-between mt-4">
                    <button
                      onClick={()=>navigate(`/edit-event/${event._id}`)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                  </div>

                </div>

              </div>

            )

          })}

        </div>

      </div>

    </div>

  )

}

export default EventDashboard;