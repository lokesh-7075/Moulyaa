import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {

  const navigate = useNavigate();

  const [role, setRole] = useState("traveler");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const [profileImage, setProfileImage] = useState(null);
  const [serviceImages, setServiceImages] = useState([]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("phone", form.phone);
    formData.append("role", role);

    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    if (role !== "traveler") {
      serviceImages.forEach(img =>
        formData.append("serviceImages", img)
      );
    }

    try {
      await API.post("/auth/register", formData);
      alert("Registered successfully 🎉");
      navigate("/login");
    } catch (err) {
      alert("Registration failed ❌");
    }

  };

  return (

    <div className="w-full bg-gradient-to-br from-rose-100 via-white to-orange-100">

      {/* ✅ NAVBAR SPACING FIX */}
      <div className="h-[18vh]"></div>

      <div className="min-h-[82vh] flex items-center justify-center px-4">

        {/* GLASS CARD */}
        <div className="w-full max-w-md backdrop-blur-xl bg-white/60 border border-white/40 shadow-2xl rounded-3xl p-8 transition-all duration-500 hover:shadow-rose-200">

          {/* TITLE */}
          <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
            Create Account ✨
          </h2>

          <p className="text-center text-gray-500 mb-6">
            Join Moulyas & start your journey
          </p>


          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">

            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            />

            <select
              value={role}
              onChange={(e)=>setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/70 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            >
              <option value="traveler">Traveler</option>
              <option value="hotel_owner">Hotel Owner</option>
              <option value="vehicle_owner">Vehicle Owner</option>
              <option value="restaurant_owner">Restaurant Owner</option>
              <option value="tour_guide">Tour Guide</option>
              <option value="event_organizer">Event Organizer</option>
            </select>

            <div className="text-sm text-gray-600">
              Profile Image
            </div>

            <input
              type="file"
              onChange={(e)=>setProfileImage(e.target.files[0])}
              required
              className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-orange-500 file:text-white hover:file:bg-orange-600"
            />

            {role !== "traveler" && (
              <>
                <div className="text-sm text-gray-600">
                  Service Images
                </div>

                <input
                  type="file"
                  multiple
                  onChange={(e)=>setServiceImages(Array.from(e.target.files))}
                  className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-rose-500 file:text-white hover:file:bg-rose-600"
                />
              </>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-rose-500 text-white font-semibold shadow-lg hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              Register
            </button>

          </form>


          {/* FOOTER */}
          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <span
              onClick={()=>navigate("/login")}
              className="text-orange-500 font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>

        </div>

      </div>

    </div>

  );

}

export default Register;