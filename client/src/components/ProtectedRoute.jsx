import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roles }) {

  const user = JSON.parse(localStorage.getItem("user"));

  if(!user){
    return <Navigate to="/login" />;
  }

  if(!roles.includes(user.role)){
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;