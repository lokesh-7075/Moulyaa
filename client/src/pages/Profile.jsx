import { useState } from "react";
import API from "../services/api";

function Profile(){

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const BASE_URL = "http://localhost:5000";

  // =========================
  // 🔥 IMAGE FIX FUNCTION
  // =========================
  const getImage = (path) => {

    if (!path) {
      return "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    }

    // ✅ external URL
    if (path.startsWith("http")) return path;

    // ✅ remove full system path (C:/Users/...)
    if (path.includes("uploads")) {
      const clean = path.split("uploads")[1]; // /profiles/xxx.jpg
      return `${BASE_URL}/uploads${clean}`;
    }

    return `${BASE_URL}/${path}`;
  };

  const [form,setForm] = useState({
    name:user.name || "",
    email:user.email || "",
    phone:user.phone || ""
  });

  const [image,setImage] = useState(null);

  const [preview,setPreview] = useState(
    getImage(user.profileImage)
  );

  const [loading,setLoading] = useState(false);

  // =========================
  // TEXT CHANGE
  // =========================
  const handleChange = (e)=>{
    setForm({
      ...form,
      [e.target.name]:e.target.value
    });
  };

  // =========================
  // IMAGE CHANGE
  // =========================
  const handleImageChange = (e)=>{

    const file = e.target.files[0];
    if(!file) return;

    setImage(file);

    // ✅ live preview
    setPreview(URL.createObjectURL(file));
  };

  // =========================
  // UPDATE PROFILE
  // =========================
  const handleUpdate = async()=>{

    try{

      setLoading(true);

      const data = new FormData();

      data.append("name",form.name);
      data.append("email",form.email);
      data.append("phone",form.phone);

      if(image){
        data.append("profileImage",image);
      }

      const res = await API.put("/users/profile",data,{
        headers:{
          "Content-Type":"multipart/form-data"
        }
      });

      // ✅ update localStorage
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      // ✅ update preview with FIXED PATH
      setPreview(getImage(res.data.user.profileImage));

      alert("Profile Updated ✅");

    }
    catch(error){
      console.error(error);
      alert("Update failed");
    }
    finally{
      setLoading(false);
    }

  };

  return(

    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-orange-50">

      <div className="w-[420px] p-6 rounded-3xl bg-white/60 backdrop-blur-xl shadow-2xl">

        {/* IMAGE */}
        <div className="flex flex-col items-center mb-5">

          <img
            src={preview}
            onError={(e)=>{
              e.target.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
            }}
            className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-lg"
          />

          <label className="mt-3 text-sm text-blue-600 cursor-pointer hover:underline">
            Change Photo
            <input
              type="file"
              hidden
              onChange={handleImageChange}
            />
          </label>

        </div>

        <h2 className="text-center text-2xl font-bold mb-4">
          My Profile 💖
        </h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-2 mb-3 border rounded"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="w-full p-2 mb-4 border rounded"
        />

        <button
          onClick={handleUpdate}
          className="w-full py-2 rounded-xl bg-gradient-to-r from-pink-500 to-orange-500 text-white hover:scale-105 transition"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>

      </div>

    </div>

  )

}

export default Profile;