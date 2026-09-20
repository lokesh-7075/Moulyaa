import { useState } from "react";
import API from "../services/api";
import "./Profile.css";

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
    const clean = path.replace(/\\/g,"/");
    const index = clean.indexOf("uploads/");
    if (index !== -1) {
      return `${BASE_URL}/${clean.substring(index)}`;
    }

    return `${BASE_URL}/uploads/${clean}`;
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

    <div className="profile-page-container">

      <div className="profile-card">

        {/* IMAGE */}
        <div className="profile-avatar-section">

          <img
            src={preview}
            onError={(e)=>{
              e.target.src = "https://cdn-icons-png.flaticon.com/512/847/847969.png";
            }}
            className="profile-preview-img"
          />

          <label className="change-photo-label">
            Change Photo
            <input
              type="file"
              hidden
              onChange={handleImageChange}
            />
          </label>

        </div>

        <h2 className="profile-title">
          My Profile 💖
        </h2>

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          className="profile-input"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="profile-input"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="profile-input"
        />

        <button
          onClick={handleUpdate}
          className="save-profile-btn"
        >
          {loading ? "Updating..." : "Save Changes"}
        </button>

      </div>

    </div>

  )

}

export default Profile;