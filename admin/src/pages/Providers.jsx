import { useEffect, useState } from "react";
import API from "../services/api";
import "./Providers.css";

function Providers(){

  const BASE_URL = "http://localhost:5000";

  const [pending,setPending] = useState([]);
  const [approved,setApproved] = useState([]);
  const [activeTab,setActiveTab] = useState("pending");

  // ================= IMAGE FIX =================
  const getImage = (path)=>{
    if(!path) return "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    if(path.startsWith("http")) return path;
    return `${BASE_URL}/uploads/${path.replace(/^uploads\//,"")}`;
  };

  // ================= FETCH =================
  const fetchData = async()=>{

    try{

      const pendingRes = await API.get("/admin/pending-users");
      const approvedRes = await API.get("/admin/approved-users");

      setPending(pendingRes.data);
      setApproved(approvedRes.data);

    }catch(err){
      console.error(err);
    }

  };

  useEffect(()=>{
    fetchData();
  },[]);

  // ================= ACTIONS =================
  const approve = async(id)=>{
    await API.put(`/admin/approve-user/${id}`);
    fetchData();
  };

  const reject = async(id)=>{
    await API.put(`/admin/reject-user/${id}`);
    fetchData();
  };

  const deleteUser = async(id)=>{
    await API.delete(`/admin/delete-user/${id}`);
    fetchData();
  };

  // ================= GROUP BY ROLE =================
  const groupByRole = (data)=>{
    return data.reduce((acc,user)=>{
      if(!acc[user.role]) acc[user.role] = [];
      acc[user.role].push(user);
      return acc;
    },{});
  };

  const renderCards = (data)=>{

    const grouped = groupByRole(data);

    if (data.length === 0) {
      return (
        <div className="empty-providers-card">
          <span className="empty-icon">📭</span>
          <p className="empty-text">No providers in this section.</p>
        </div>
      );
    }

    return Object.keys(grouped).map(role=>(

      <div key={role} className="providers-section">

        {/* ROLE TITLE */}
        <div className="providers-section-header">
          <h2 className="providers-section-title">
            {role.replace("_"," ")}s
          </h2>
        </div>

        <div className="providers-grid">

          {grouped[role].map(user=>(

            <div key={user._id} className="provider-card">

              {/* IMAGE */}
              <div className="provider-avatar-wrapper">
                <img
                  src={getImage(user.profileImage)}
                  onError={(e)=>{
                    e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                  }}
                  className="provider-avatar"
                />
              </div>

              <h3 className="provider-name">
                {user.name}
              </h3>

              <p className="provider-email">
                {user.email}
              </p>

              <div className="provider-badges">
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
                  {role.replace("_"," ")}
                </span>
              </div>

              {/* SERVICE IMAGES */}
              {user.serviceImages && user.serviceImages.length > 0 && (
                <div className="credentials-section">
                  <p className="credentials-title">Service Credentials</p>
                  <div className="credentials-gallery">
                    {user.serviceImages.map((img,i)=>(
                      <img
                        key={i}
                        src={getImage(img)}
                        className="credentials-img"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* ACTIONS */}
              <div className="actions-row">

                {activeTab === "pending" && (
                  <>
                    <button
                      onClick={()=>approve(user._id)}
                      className="btn-approve"
                    >
                      Approve
                    </button>

                    <button
                      onClick={()=>reject(user._id)}
                      className="btn-reject"
                    >
                      Reject
                    </button>
                  </>
                )}

                {activeTab === "approved" && (
                  <button
                    onClick={()=>deleteUser(user._id)}
                    className="btn-delete-provider"
                  >
                    Delete Provider
                  </button>
                )}

              </div>

            </div>

          ))}

        </div>

      </div>

    ));

  };

  return(

    <div className="providers-container">

      {/* HEADER */}
      <div className="providers-header">
        <h1 className="providers-title">
          🔑 Provider Verification Control
        </h1>
        <p className="providers-subtitle">Review new registration submissions, audit credentials, and grant access.</p>
      </div>

      {/* TABS */}
      <div className="tab-bar">

        <button
          onClick={()=>setActiveTab("pending")}
          className={`tab-btn ${
            activeTab === "pending" ? "tab-btn-pending-active" : ""
          }`}
        >
          Pending
        </button>

        <button
          onClick={()=>setActiveTab("approved")}
          className={`tab-btn ${
            activeTab === "approved" ? "tab-btn-approved-active" : ""
          }`}
        >
          Approved
        </button>

      </div>

      {/* CONTENT */}
      {activeTab === "pending" && renderCards(pending)}
      {activeTab === "approved" && renderCards(approved)}

    </div>

  );

}

export default Providers;