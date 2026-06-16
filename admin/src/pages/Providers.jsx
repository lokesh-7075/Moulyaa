import { useEffect, useState } from "react";
import API from "../services/api";

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

    return Object.keys(grouped).map(role=>(

      <div key={role} className="mb-10">

        {/* ROLE TITLE */}
        <h2 className="text-xl font-bold mb-4 capitalize text-orange-600">
          {role.replace("_"," ")}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {grouped[role].map(user=>(

            <div
              key={user._id}
              className="
                bg-white/60 backdrop-blur-xl border border-white/30
                rounded-3xl p-5 shadow-xl
                hover:shadow-2xl hover:-translate-y-1 transition
              "
            >

              {/* IMAGE */}
              <img
                src={getImage(user.profileImage)}
                className="w-20 h-20 rounded-full mx-auto mb-3 border"
              />

              <h3 className="text-center font-bold text-lg">
                {user.name}
              </h3>

              <p className="text-center text-gray-500 text-sm">
                {user.email}
              </p>

              <p className="text-center text-sm mt-1">
                {user.role}
              </p>

              {/* SERVICE IMAGES */}
              <div className="flex gap-2 mt-4 flex-wrap justify-center">

                {user.serviceImages?.map((img,i)=>(
                  <img
                    key={i}
                    src={getImage(img)}
                    className="w-14 h-14 rounded object-cover"
                  />
                ))}

              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-5">

                {activeTab === "pending" && (
                  <>
                    <button
                      onClick={()=>approve(user._id)}
                      className="flex-1 bg-green-500 text-white py-2 rounded-xl hover:bg-green-600"
                    >
                      Approve
                    </button>

                    <button
                      onClick={()=>reject(user._id)}
                      className="flex-1 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}

                {activeTab === "approved" && (
                  <button
                    onClick={()=>deleteUser(user._id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-xl hover:bg-red-600"
                  >
                    Delete
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

    <div className="min-h-screen p-8 bg-gradient-to-br from-orange-50 via-white to-pink-50">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
          Admin Panel 👑
        </h1>

      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-6">

        <button
          onClick={()=>setActiveTab("pending")}
          className={`px-5 py-2 rounded-full ${
            activeTab==="pending"
              ? "bg-orange-500 text-white"
              : "bg-white shadow"
          }`}
        >
          Pending
        </button>

        <button
          onClick={()=>setActiveTab("approved")}
          className={`px-5 py-2 rounded-full ${
            activeTab==="approved"
              ? "bg-green-500 text-white"
              : "bg-white shadow"
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