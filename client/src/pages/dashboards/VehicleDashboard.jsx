import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function VehicleDashboard(){

  const navigate = useNavigate();

  const [vehicles,setVehicles] = useState([]);
  const [bookings,setBookings] = useState([]);
  const [selectedVehicle,setSelectedVehicle] = useState(null);
  const [allBookings,setAllBookings] = useState([]);
  const [loading,setLoading] = useState(true);
  const [open,setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const BASE_URL = "http://localhost:5000";

  const getImage = (path)=>{
    if(!path) return "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    let clean = path.replace(/\\/g,"/").replace(/^\/+/,"");
    if(!clean.startsWith("uploads/")) clean = "uploads/" + clean;
    return `${BASE_URL}/${clean}`;
  };

  // ✅ DATE FIX
  const formatDate = (date)=>{
    if(!date) return "No Date";
    const d = new Date(date);
    if(isNaN(d)) return "Invalid Date";
    return d.toLocaleDateString("en-IN");
  };

  const fetchData = async () => {
    try{
      const [vehicleRes,bookingRes] = await Promise.all([
        API.get("/vehicles/my-vehicles"),
        API.get("/bookings/provider")
      ]);

      setVehicles(vehicleRes.data || []);

      const vehicleBookings = (bookingRes.data || []).filter(
        b => b.serviceType === "vehicle"
      );

      setAllBookings(vehicleBookings);

    }catch(error){
      console.error(error);
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{ fetchData(); },[]);

  const viewBookings = (vehicleId)=>{
    const filtered = allBookings.filter(
      b => b.serviceId?.toString() === vehicleId?.toString()
    );
    setBookings(filtered);
    setSelectedVehicle(vehicleId);
  };

  const logout = ()=>{
    localStorage.clear();
    navigate("/login");
  };

  if(loading){
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return(

    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 p-6">

      <div className="flex justify-between items-center mb-6 bg-white/60 p-4 rounded-2xl shadow">

        <h1 className="text-3xl font-bold text-orange-600">
          🚗 Vehicle Dashboard
        </h1>

        <img
          src={getImage(user?.profileImage)}
          className="w-12 h-12 rounded-full cursor-pointer"
          onClick={logout}
        />

      </div>

      <div className="grid md:grid-cols-3 gap-8">

        {vehicles.map(vehicle=>{

          const vehicleBookings = allBookings.filter(
            b => b.serviceId?.toString() === vehicle._id?.toString()
          );

          return(

            <div key={vehicle._id} className="bg-white p-4 rounded-2xl shadow">

              <img
                src={getImage(vehicle.images?.[0])}
                className="h-40 w-full object-cover rounded-xl"
              />

              <h3 className="font-bold mt-3">{vehicle.vehicleName}</h3>

              <button
                onClick={()=>viewBookings(vehicle._id)}
                className="mt-3 w-full bg-green-500 text-white py-1 rounded"
              >
                View Bookings
              </button>

            </div>

          )

        })}

      </div>

      {selectedVehicle && (
        <div className="mt-10 bg-white rounded-xl shadow p-6">

          {bookings.map(b=>(
            <div key={b._id} className="border-b py-2 text-sm">

              <p>{b.travelerId?.name}</p>

              {/* ✅ FIXED DATE */}
              <p>{formatDate(b.travelDate)}</p>

            </div>
          ))}

        </div>
      )}

    </div>
  )
}

export default VehicleDashboard;