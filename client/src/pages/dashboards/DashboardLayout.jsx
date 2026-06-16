import { Link } from "react-router-dom";
import "./Dashboard.css";

function DashboardLayout({title, children}){

  const user = JSON.parse(localStorage.getItem("user"));

  return(

    <div className="dashboard-page">

      <aside className="dashboard-sidebar">

        <h2>Moulyas</h2>

        <p className="user-name">{user?.name}</p>

        <Link to="/">Home</Link>

        <Link to="#">My Services</Link>

        <Link to="#">Bookings</Link>

        <Link to="#">Reviews</Link>

      </aside>

      <main className="dashboard-content">

        <h1>{title}</h1>

        {children}

      </main>

    </div>

  )

}

export default DashboardLayout;