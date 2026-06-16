import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Layout from "./components/Layout";
import AdminRoute from "./components/AdminRoute";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Providers from "./pages/Providers";
import Bookings from "./pages/Bookings";
import Payments from "./pages/Payments";
import Balances from "./pages/Balances";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN PAGE */}
        <Route path="/login" element={<Login/>} />

        {/* ADMIN DASHBOARD */}
        <Route
          path="/"
          element={
            <AdminRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </AdminRoute>
          }
        />
        <Route
 path="/balances"
 element={
  <AdminRoute>
   <Layout>
    <Balances/>
   </Layout>
  </AdminRoute>
 }
/>


        <Route
          path="/users"
          element={
            <AdminRoute>
              <Layout>
                <Users />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/providers"
          element={
            <AdminRoute>
              <Layout>
                <Providers />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/bookings"
          element={
            <AdminRoute>
              <Layout>
                <Bookings />
              </Layout>
            </AdminRoute>
          }
        />

        <Route
          path="/payments"
          element={
            <AdminRoute>
              <Layout>
                <Payments />
              </Layout>
            </AdminRoute>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default App;