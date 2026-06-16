import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/api";

function AddFood(){

  const navigate = useNavigate();

  const [foodName,setFoodName] = useState("");
  const [category,setCategory] = useState("");
  const [price,setPrice] = useState("");
  const [description,setDescription] = useState("");
  const [foodImages,setFoodImages] = useState([]);

  const handleSubmit = async(e)=>{

    e.preventDefault();

    const formData = new FormData();

    formData.append("foodName",foodName);
    formData.append("category",category);
    formData.append("price",price);
    formData.append("description",description);

    for(let i=0;i<foodImages.length;i++){
      formData.append("food",foodImages[i]);
    }

    try{

      await API.post("/foods/create",formData);

      alert("Food item added successfully");

      navigate("/restaurant-dashboard");

    }
    catch(error){

      console.error(error);

    }

  };

  return(

    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-900 via-indigo-900 to-black px-4 transition-all duration-500">

      <form
        onSubmit={handleSubmit}
        className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-xl shadow-2xl w-96 transition-all duration-500 hover:scale-[1.03] hover:shadow-blue-500/30"
      >

        <h2 className="text-2xl font-bold mb-5 text-white text-center tracking-wide drop-shadow-lg">
          🍔 Add Food Item
        </h2>

        <input
          placeholder="Food Name"
          className="border border-white/30 bg-white/20 text-white placeholder-gray-300 p-2 w-full mb-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:scale-[1.02] hover:bg-white/30"
          onChange={(e)=>setFoodName(e.target.value)}
          required
        />

        <input
          placeholder="Category"
          className="border border-white/30 bg-white/20 text-white placeholder-gray-300 p-2 w-full mb-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-indigo-400 focus:scale-[1.02] hover:bg-white/30"
          onChange={(e)=>setCategory(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          className="border border-white/30 bg-white/20 text-white placeholder-gray-300 p-2 w-full mb-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-400 focus:scale-[1.02] hover:bg-white/30"
          onChange={(e)=>setPrice(e.target.value)}
          required
        />

        <textarea
          placeholder="Description"
          className="border border-white/30 bg-white/20 text-white placeholder-gray-300 p-2 w-full mb-3 rounded-lg outline-none transition-all duration-300 focus:ring-2 focus:ring-pink-400 focus:scale-[1.02] hover:bg-white/30"
          onChange={(e)=>setDescription(e.target.value)}
        />

        <input
          type="file"
          multiple
          className="w-full text-gray-300 mb-3 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-blue-500 file:to-indigo-500 file:text-white hover:file:scale-105 transition-all duration-300 cursor-pointer"
          onChange={(e)=>setFoodImages(e.target.files)}
        />

        <button className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white w-full p-2 rounded-lg font-semibold tracking-wide transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/40 active:scale-95">
          🚀 Add Food
        </button>

      </form>

    </div>

  )

}

export default AddFood;