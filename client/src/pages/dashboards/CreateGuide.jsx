import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function CreateGuide(){

  const navigate = useNavigate();

  const [guideName,setGuideName] = useState("");
  const [languages,setLanguages] = useState("");
  const [experience,setExperience] = useState("");
  const [pricePerDay,setPricePerDay] = useState("");
  const [location,setLocation] = useState("");
  const [description,setDescription] = useState("");
  const [images,setImages] = useState([]);
  const [open,setOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const logout = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleSubmit = async(e)=>{
    e.preventDefault();

    const formData = new FormData();

    formData.append("guideName", guideName);

    formData.append(
      "languages",
      JSON.stringify(
        languages.split(",").map(lang => lang.trim())
      )
    );

    formData.append("experience", Number(experience));
    formData.append("pricePerDay", Number(pricePerDay));
    formData.append("location", location);
    formData.append("description", description);

    formData.append("role", "tour_guide");

    for(let i=0;i<images.length;i++){
      formData.append("serviceImages", images[i]);
    }

    try{
      await API.post("/guides/create", formData);
      alert("Guide profile created successfully");
      navigate("/guide-dashboard");
    }catch(error){
      console.error("Create guide error", error.response?.data || error);
      alert(error.response?.data?.message || "Error creating guide");
    }
  };

  return(
    <div className="min-h-screen bg-white transition-all duration-500">

      <div className="flex justify-between items-center px-10 py-5 bg-white border-b border-gray-200 shadow-sm">
        <h1 className="text-3xl font-bold text-orange-500 tracking-wide">
          Moulyas
        </h1>

        <div className="relative">
          <img
            src={user?.profileImage
              ? `http://localhost:5000/${user.profileImage}`
              : "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
            className="w-10 h-10 rounded-full cursor-pointer border-2 border-gray-300 hover:scale-110 transition-all duration-300"
            onClick={()=>setOpen(!open)}
          />

          {open && (
            <div className="absolute right-0 mt-3 w-60 bg-white rounded-xl shadow-xl border border-gray-200 p-4 animate-fadeIn">
              <div className="flex gap-3 mb-3">
                <img src={user?.profileImage
                  ? `http://localhost:5000/${user.profileImage}`
                  : "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
                  className="w-12 h-12 rounded-full border"
                />
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">{user?.name}</p>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button 
                onClick={logout} 
                className="text-red-500 font-medium hover:underline hover:text-red-600 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-20 px-4">
        <form 
          onSubmit={handleSubmit} 
          className="bg-white border border-gray-200 p-8 rounded-xl w-96 shadow-lg transition-all duration-500 hover:shadow-2xl hover:scale-[1.01]"
        >

          <input 
            placeholder="Guide Name" 
            className="w-full border border-gray-300 p-3 mb-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-green-400 focus:border-green-400 hover:border-gray-400"
            onChange={e=>setGuideName(e.target.value)} 
            required 
          />

          <input 
            placeholder="Languages" 
            className="w-full border border-gray-300 p-3 mb-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 hover:border-gray-400"
            onChange={e=>setLanguages(e.target.value)} 
            required 
          />

          <input 
            type="number" 
            placeholder="Experience" 
            className="w-full border border-gray-300 p-3 mb-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 hover:border-gray-400"
            onChange={e=>setExperience(e.target.value)} 
          />

          <input 
            type="number" 
            placeholder="Price" 
            className="w-full border border-gray-300 p-3 mb-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 hover:border-gray-400"
            onChange={e=>setPricePerDay(e.target.value)} 
            required 
          />

          <input 
            placeholder="Location" 
            className="w-full border border-gray-300 p-3 mb-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 hover:border-gray-400"
            onChange={e=>setLocation(e.target.value)} 
            required 
          />

          <textarea 
            placeholder="Description" 
            className="w-full border border-gray-300 p-3 mb-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 hover:border-gray-400"
            onChange={e=>setDescription(e.target.value)} 
          />

          <input 
            type="file" 
            multiple 
            className="w-full mb-3 text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-600 file:text-white hover:file:scale-105 hover:file:bg-green-700 transition-all duration-300 cursor-pointer"
            onChange={e=>setImages(e.target.files)} 
          />

          <button className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white w-full mt-3 p-3 rounded-lg font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 active:scale-95">
            🚀 Create
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreateGuide;