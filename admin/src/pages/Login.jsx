import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import axios from "axios";

function Login(){

  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  // redirect if already logged in
  if (token && user?.role === "admin") {
    return <Navigate to="/" />;
  }

  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [error,setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try{

      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      const data = res.data;

      // allow only admin
      if(data.user.role !== "admin"){
        setError("Access denied. Admin only.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");

    }
    catch(err){
      setError("Invalid email or password");
    }

  };

  return(

    <div className="flex items-center justify-center h-screen bg-gray-100">

      <div className="bg-white p-8 rounded-xl shadow-md w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">
          Moulyas Admin Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full border p-2 rounded"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-2 rounded"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Login
          </button>

        </form>

      </div>

    </div>

  )

}

export default Login;