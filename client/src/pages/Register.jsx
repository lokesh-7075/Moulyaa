import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import "./Register.css";

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
  
  // Custom Pop-up states
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("success");
  const [popupMessage, setPopupMessage] = useState("");

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

    try {
      await API.post("/auth/register", formData);
      setPopupType("success");
      setPopupMessage("Registered successfully 🎉 Redirecting to login page...");
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate("/login");
      }, 2500);
    } catch (err) {
      setPopupType("error");
      setPopupMessage(err.response?.data?.message || "Registration failed. Please check all fields.");
      setShowPopup(true);
    }

  };

  return (

    <div className="register-container">

      <div className="register-spacing"></div>

      <div className="register-content">

        {/* GLASS CARD */}
        <div className="register-card">

          {/* TITLE */}
          <h2 className="register-title">
            Create Account ✨
          </h2>

          <p className="register-subtitle">
            Join Moulyas & start your journey
          </p>


          {/* FORM */}
          <form onSubmit={handleSubmit} className="register-form">

            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              required
              className="register-input"
            />

            <input
              name="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
              required
              className="register-input"
            />

            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
              className="register-input"
            />

            <input
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              required
              className="register-input"
            />

            <select
              value={role}
              onChange={(e)=>setRole(e.target.value)}
              className="register-input"
            >
              <option value="traveler">Traveler</option>
              <option value="hotel_owner">Hotel Owner</option>
              <option value="vehicle_owner">Vehicle Owner</option>
              <option value="restaurant_owner">Restaurant Owner</option>
              <option value="tour_guide">Tour Guide</option>
              <option value="event_organizer">Event Organizer</option>
            </select>

            <div className="image-upload-label">
              Profile Image
            </div>

            <input
              type="file"
              onChange={(e)=>setProfileImage(e.target.files[0])}
              required
              className="file-input"
            />

            <button
              type="submit"
              className="register-btn"
            >
              Register
            </button>

          </form>


          {/* FOOTER */}
          <p className="register-footer">
            Already have an account?{" "}
            <span
              onClick={()=>navigate("/login")}
              className="login-link"
            >
              Login
            </span>
          </p>

        </div>

      </div>

      {/* CUSTOM POPUP MODAL */}
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-modal">
            <div className={`popup-icon-wrapper ${
              popupType === "success" 
                ? "popup-success-icon" 
                : "popup-error-icon"
            }`}>
              {popupType === "success" ? "🎉" : "❌"}
            </div>
            
            <h3 className="popup-title">
              {popupType === "success" ? "Success!" : "Failed!"}
            </h3>
            
            <p className="popup-desc">
              {popupMessage}
            </p>
            
            {popupType === "success" ? (
              <div className="popup-loader"></div>
            ) : (
              <button
                type="button"
                onClick={() => setShowPopup(false)}
                className="popup-close-btn"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      )}
    </div>

  );

}

export default Register;