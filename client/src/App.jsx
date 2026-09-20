import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import RoleRedirect from "./components/RoleRedirect";
import ProtectedRoute from "./components/ProtectedRoute";

// PUBLIC
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// AWS BEDROCK AI FEATURES
import AITripPlanner from "./pages/AITripPlanner";
import SnapAndExplore from "./pages/SnapAndExplore";
import BundleBookings from "./pages/BundleBookings";

// USER SERVICES
import Hotels from "./pages/Hotels";
import HotelDetails from "./pages/HotelDetails";
import Booking from "./pages/Booking";

import Guides from "./pages/Guides";
import GuideDetails from "./pages/GuideDetails";

import Vehicles from "./pages/Vehicle";
import VehicleDetails from "./pages/VehicleDetails";

import Restaurants from "./pages/Restaurants";
import RestaurantDetails from "./pages/RestaurantDetails";

import Events from "./pages/Events";
import EventDetails from "./pages/EventDetails";

// PAYMENT
import PaymentPage from "./pages/PaymentPage";
import Receipt from "./pages/Receipt";

// TRAVELER
import Profile from "./pages/Profile";
import Transactions from "./pages/Transactions";
import MyBookings from "./pages/MyBookings";

// DASHBOARDS
import HotelDashboard from "./pages/dashboards/HotelDashboard";
import VehicleDashboard from "./pages/dashboards/VehicleDashboard";
import RestaurantDashboard from "./pages/dashboards/RestaurantDashboard";
import GuideDashboard from "./pages/dashboards/GuideDashboard";
import EventDashboard from "./pages/dashboards/EventDashboard";

// EXTRA DASHBOARD
import CreateGuidePost from "./pages/dashboards/CreateGuidePost";
import AddHotel from "./pages/dashboards/AddHotel";
import AddRoom from "./pages/dashboards/AddRoom";
import EditHotel from "./pages/dashboards/EditHotel";
import AddVehicle from "./pages/dashboards/AddVehicle";
import CreateRestaurant from "./pages/dashboards/CreateRestaurant";
import AddFood from "./pages/dashboards/AddFood";
import CreateGuide from "./pages/dashboards/CreateGuide";
import EditGuide from "./pages/dashboards/EditGuide";
import CreateEvent from "./pages/dashboards/CreateEvent";
import EditEvent from "./pages/dashboards/EditEvent";
import ManageEvents from "./pages/dashboards/ManageEvents";

import EventBookings from "./pages/EventBookings";
import RestaurantOrders from "./pages/RestaurantOrders";

function App() {
  return (
    <BrowserRouter>

      <RoleRedirect />

      <Routes>

        {/* ================= MAIN LAYOUT ================= */}
        <Route path="/" element={<Layout />}>

          {/* ================= PUBLIC ================= */}
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* ================= AWS BEDROCK AI INNOVATION ================= */}
          <Route path="ai-planner" element={<AITripPlanner />} />
          <Route path="snap-explore" element={<SnapAndExplore />} />
          <Route path="bundle-bookings" element={<BundleBookings />} />

          {/* ================= SERVICES ================= */}
          <Route path="hotels" element={<Hotels />} />
          <Route path="hotel/:id" element={<HotelDetails />} />
          <Route path="booking/:id" element={<Booking />} />

          <Route path="guides" element={<Guides />} />
          <Route path="guide/:id" element={<GuideDetails />} />

          <Route path="vehicles" element={<Vehicles />} />
          <Route path="vehicle/:id" element={<VehicleDetails />} />

          <Route path="restaurants" element={<Restaurants />} />
          <Route path="restaurant/:id" element={<RestaurantDetails />} />

          <Route path="events" element={<Events />} />
          <Route path="event/:id" element={<EventDetails />} />

          {/* ================= PAYMENT ================= */}
          <Route path="payment/:bookingId" element={<PaymentPage />} />
          <Route path="receipt" element={<Receipt />} />

          {/* ================= TRAVELER ================= */}
          <Route
            path="profile"
            element={
              <ProtectedRoute roles={["traveler"]}>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="my-bookings"
            element={
              <ProtectedRoute roles={["traveler"]}>
                <MyBookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="my-payments"
            element={
              <ProtectedRoute roles={["traveler"]}>
                <Transactions />
              </ProtectedRoute>
            }
          />

          {/* ================= HOTEL ================= */}
          <Route
            path="hotel-dashboard"
            element={
              <ProtectedRoute roles={["hotel_owner"]}>
                <HotelDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="add-hotel" element={<AddHotel />} />
          <Route path="add-room" element={<AddRoom />} />
          <Route path="edit-hotel/:id" element={<EditHotel />} />

          {/* ================= VEHICLE ================= */}
          <Route
            path="vehicle-dashboard"
            element={
              <ProtectedRoute roles={["vehicle_owner"]}>
                <VehicleDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="add-vehicle" element={<AddVehicle />} />

          {/* ================= RESTAURANT ================= */}
          <Route
            path="restaurant-dashboard"
            element={
              <ProtectedRoute roles={["restaurant_owner"]}>
                <RestaurantDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="create-restaurant" element={<CreateRestaurant />} />
          <Route path="add-food" element={<AddFood />} />

          {/* ================= GUIDE ================= */}
          <Route
            path="guide-dashboard"
            element={
              <ProtectedRoute roles={["tour_guide"]}>
                <GuideDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="create-guide" element={<CreateGuide />} />
          <Route path="edit-guide/:id" element={<EditGuide />} />
          <Route path="create-guide-post" element={<CreateGuidePost />} />

          {/* ================= EVENTS ================= */}
          <Route
            path="event-dashboard"
            element={
              <ProtectedRoute roles={["event_organizer"]}>
                <EventDashboard />
              </ProtectedRoute>
            }
          />

          <Route path="create-event" element={<CreateEvent />} />
          <Route path="edit-event/:id" element={<EditEvent />} />
          <Route path="manage-events" element={<ManageEvents />} />
          <Route path="event-bookings" element={<EventBookings />} />

          {/* ================= EXTRA ================= */}
          <Route path="restaurant-orders" element={<RestaurantOrders />} />

        </Route>

      </Routes>

    </BrowserRouter>
  );
}

export default App;