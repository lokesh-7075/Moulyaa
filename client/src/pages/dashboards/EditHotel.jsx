import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../services/api";

function EditHotel(){

  const { id } = useParams();
  const navigate = useNavigate();

  const [hotel,setHotel] = useState(null);

  const [hotelName,setHotelName] = useState("");
  const [location,setLocation] = useState("");
  const [description,setDescription] = useState("");
  const [images,setImages] = useState([]);

  const BASE_URL = "http://localhost:5000";

  // =========================
  // FETCH HOTEL
  // =========================

  useEffect(()=>{

    const fetchHotel = async()=>{

      try{

        const res = await API.get(`/hotels/${id}`);

        setHotel(res.data);

        setHotelName(res.data.hotelName);
        setLocation(res.data.location);
        setDescription(res.data.description || "");

      }
      catch(err){
        console.error(err);
      }

    };

    fetchHotel();

  },[id]);


  // =========================
  // UPDATE HOTEL
  // =========================

  const handleSubmit = async(e)=>{

    e.preventDefault();

    const formData = new FormData();

    formData.append("hotelName",hotelName);
    formData.append("location",location);
    formData.append("description",description);

    for(let i=0;i<images.length;i++){
      formData.append("images",images[i]);
    }

    try{

      await API.put(`/hotels/update/${id}`,formData,{
        headers:{
          "Content-Type":"multipart/form-data"
        }
      });

      alert("Hotel updated successfully");

      navigate("/hotel-dashboard");

    }
    catch(err){
      console.error(err.response?.data || err);
    }

  };


  if(!hotel){
    return <p className="text-center mt-10">Loading...</p>;
  }


  return(

    <div className="min-h-screen flex justify-center items-center bg-gray-100">

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-lg w-96"
      >

        <h2 className="text-2xl font-bold mb-5">
          Edit Hotel
        </h2>

        {/* HOTEL NAME */}
        <input
          value={hotelName}
          onChange={(e)=>setHotelName(e.target.value)}
          placeholder="Hotel Name"
          className="border p-2 w-full mb-3"
          required
        />

        {/* LOCATION */}
        <input
          value={location}
          onChange={(e)=>setLocation(e.target.value)}
          placeholder="Location"
          className="border p-2 w-full mb-3"
          required
        />

        {/* DESCRIPTION */}
        <textarea
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          placeholder="Description"
          className="border p-2 w-full mb-3"
        />

        {/* OLD IMAGE */}
        {hotel.images?.length > 0 && (
          <img
            src={`${BASE_URL}/${hotel.images[0]}`}
            className="w-full h-40 object-cover rounded mb-3"
          />
        )}

        {/* NEW IMAGES */}
        <input
          type="file"
          multiple
          onChange={(e)=>setImages(e.target.files)}
          className="mb-3"
        />

        <button className="bg-blue-600 text-white w-full p-2 rounded">
          Update Hotel
        </button>

      </form>

    </div>

  )

}

export default EditHotel;