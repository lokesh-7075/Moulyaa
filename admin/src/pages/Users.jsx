import { useEffect, useState } from "react";
import API from "../services/api";

function Users(){

  const [users,setUsers] = useState([]);
  const [search,setSearch] = useState("");
  const [selectedRole,setSelectedRole] = useState("all");

  const BASE_URL = "http://localhost:5000";

  // ================= IMAGE FIX =================
  const getImage = (path)=>{
    if(!path) return "";

    if(path.startsWith("http")) return path;

    // ✅ fix windows slashes
    const cleanPath = path.replace(/\\/g,"/");

    // ✅ DO NOT replace profiles → uploads (your backend already handles it)
    return `${BASE_URL}/${cleanPath}`;
  };

  // ================= ROLE FORMAT =================
  const formatRole = (role)=>{
    return role
      ?.replace(/_/g," ")
      .replace(/\b\w/g, c => c.toUpperCase());
  };

  // ================= FETCH =================
  const fetchUsers = async ()=>{
    try{
      const res = await API.get("/admin/all-users");
      setUsers(res.data || []);
    }
    catch(err){
      console.error("Users fetch error:",err);
    }
  };

  useEffect(()=>{
    fetchUsers();
  },[]);

  // ================= DELETE =================
  const deleteUser = async(id)=>{
    if(!window.confirm("Delete this user?")) return;

    try{
      await API.delete(`/admin/delete-user/${id}`);
      fetchUsers();
    }
    catch(err){
      console.error("Delete error:",err);
    }
  };

  // ================= FILTER LOGIC =================
  const filteredUsers = users.filter(user=>{

    const searchText = search.toLowerCase();

    const matchesSearch =
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      user.role?.toLowerCase().includes(searchText);

    const matchesRole =
      selectedRole === "all" || user.role === selectedRole;

    return matchesSearch && matchesRole;

  });

  // ================= GROUP BY ROLE =================
  const groupedUsers = filteredUsers.reduce((acc,user)=>{
    if(!acc[user.role]) acc[user.role] = [];
    acc[user.role].push(user);
    return acc;
  },{});

  // ================= UNIQUE ROLES =================
  const roles = ["all", ...new Set(users.map(u=>u.role))];

  return(

    <div className="min-h-screen p-8 bg-gradient-to-br from-orange-50 via-white to-pink-50">

      {/* ================= HEADER ================= */}
      <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
        👥 Users Management
      </h1>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 items-center">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍 Search name, email or role..."
          className="
            w-full md:w-96 px-4 py-3 rounded-xl
            bg-white/60 backdrop-blur-xl
            border border-white/30 shadow
            focus:outline-none focus:ring-2 focus:ring-orange-400
          "
          onChange={(e)=>setSearch(e.target.value)}
        />

        {/* ROLE DROPDOWN */}
        <select
          value={selectedRole}
          onChange={(e)=>setSelectedRole(e.target.value)}
          className="
            px-4 py-3 rounded-xl
            bg-white/60 backdrop-blur-xl
            border border-white/30 shadow
            focus:outline-none
          "
        >
          {roles.map(role=>(
            <option key={role} value={role}>
              {role === "all" ? "All Roles" : formatRole(role)}
            </option>
          ))}
        </select>

        {/* COUNT */}
        <span className="text-gray-500 text-sm">
          Showing: {filteredUsers.length}
        </span>

      </div>

      {/* ================= USERS ================= */}
      {Object.keys(groupedUsers).map(role=>(

        <div key={role} className="mb-12">

          {/* ROLE TITLE */}
          <h2 className="text-xl font-bold mb-5 text-orange-600 capitalize">
            {formatRole(role)}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            {groupedUsers[role].map(user=>(

              <div
                key={user._id}
                className="
                  bg-white/60 backdrop-blur-xl
                  border border-white/30
                  rounded-2xl p-5 shadow-xl
                  hover:shadow-2xl hover:-translate-y-1 transition
                "
              >

                {/* IMAGE */}
                <div className="flex justify-center mb-3">
                  <img
                    src={getImage(user.profileImage)}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                  />
                </div>

                {/* INFO */}
                <h3 className="text-center font-bold text-lg">
                  {user.name}
                </h3>

                <p className="text-center text-sm text-gray-500">
                  {user.email}
                </p>

                <p className="text-center text-sm mt-1 font-medium text-blue-600">
                  {formatRole(user.role)}
                </p>

                {/* STATUS */}
                <div className="flex justify-center mt-2">
                  <span className={`
                    px-3 py-1 rounded-full text-xs font-semibold
                    ${
                      user.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : user.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }
                  `}>
                    {user.status}
                  </span>
                </div>

                {/* DELETE */}
                <button
                  onClick={()=>deleteUser(user._id)}
                  className="
                    w-full mt-4 py-2 rounded-xl
                    bg-red-500 text-white
                    hover:bg-red-600 transition
                  "
                >
                  Delete
                </button>

              </div>

            ))}

          </div>

        </div>

      ))}

      {/* EMPTY */}
      {filteredUsers.length === 0 && (
        <p className="text-center text-gray-500 mt-10">
          No users found
        </p>
      )}

    </div>

  )

}

export default Users;