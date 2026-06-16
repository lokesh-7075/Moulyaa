import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";

function RoleRedirect(){

  const navigate = useNavigate();

  useEffect(()=>{

    const user = JSON.parse(localStorage.getItem("user"));

    if(!user) return;

    const roleRoutes = {
      hotel_owner: "/hotel-dashboard",
      vehicle_owner: "/vehicle-dashboard",
      restaurant_owner: "/restaurant-dashboard",
      tour_guide: "/guide-dashboard",
      event_organizer: "/event-dashboard"
    };

    const route = roleRoutes[user.role];

    if(route){
      navigate(route);
    }

  },[]);

  return null;
}
export default RoleRedirect;

