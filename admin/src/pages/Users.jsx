import { useEffect, useState } from "react";
import API from "../services/api";
import "./Users.css";

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

    // Check if cleanPath already contains uploads/
    const index = cleanPath.indexOf("uploads/");
    if(index !== -1){
      return `${BASE_URL}/${cleanPath.substring(index)}`;
    }
    return `${BASE_URL}/uploads/${cleanPath}`;
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

    <div className="users-container">

      {/* ================= HEADER ================= */}
      <div className="users-header">
        <h1 className="users-title">
          👥 Travelers & Users Management
        </h1>
        <p className="users-subtitle">Audit registered accounts, assign/revoke privileges, or terminate profiles.</p>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="filter-bar">

        {/* SEARCH */}
        <input
          type="text"
          placeholder="🔍 Search name, email or role..."
          className="search-input"
          onChange={(e)=>setSearch(e.target.value)}
        />

        {/* ROLE DROPDOWN */}
        <select
          value={selectedRole}
          onChange={(e)=>setSelectedRole(e.target.value)}
          className="role-select"
        >
          {roles.map(role=>(
            <option key={role} value={role}>
              {role === "all" ? "All Account Types" : formatRole(role)}
            </option>
          ))}
        </select>

        {/* COUNT */}
        <span className="filter-count">
          Filtered Accounts: {filteredUsers.length}
        </span>

      </div>

      {/* ================= USERS ================= */}
      {Object.keys(groupedUsers).map(role=>(

        <div key={role} className="role-section">

          {/* ROLE TITLE */}
          <div className="role-section-header">
            <h2 className="role-section-title">
              {formatRole(role)}s
            </h2>
          </div>

          <div className="users-grid">

            {groupedUsers[role].map(user=>(

              <div key={user._id} className="user-card">

                {/* IMAGE */}
                <div className="user-avatar-wrapper">
                  <img
                    src={getImage(user.profileImage)}
                    onError={(e)=>{
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    }}
                    className="user-avatar"
                  />
                </div>

                {/* INFO */}
                <h3 className="user-name">
                  {user.name}
                </h3>

                <p className="user-email">
                  {user.email}
                </p>

                <div className="user-badges">
                  <span className={`badge ${
                    user.status === "approved"
                      ? "badge-approved"
                      : user.status === "pending"
                      ? "badge-pending"
                      : "badge-rejected"
                  }`}>
                    {user.status}
                  </span>
                  
                  <span className="badge badge-role">
                    {formatRole(user.role)}
                  </span>
                </div>

                {/* DELETE */}
                <button
                  onClick={()=>deleteUser(user._id)}
                  className="delete-account-btn"
                >
                  Delete Account
                </button>

              </div>

            ))}

          </div>

        </div>

      ))}

      {/* EMPTY */}
      {filteredUsers.length === 0 && (
        <div className="empty-users-card">
          <span className="empty-icon">🤷‍♂️</span>
          <p className="empty-text">No matching accounts found.</p>
        </div>
      )}

    </div>

  )

}

export default Users;