import { Routes, Route, Navigate } from "react-router-dom";
import ChooseRole from "./components/ChooseRole";

import AdminAuth from "./travel-admin/components/auth/AdminAuth";
import Dashboard from "./travel-admin/components/dashboard/Dashboard";
import AdminCategories from "./travel-admin/components/categories/AdminCategories";
import AdminListings from "./travel-admin/components/listings/AdminListings";
import AdminBookings from "./travel-admin/components/bookings/AdminBookings";
import ProtectedRoute from "./travel-admin/components/auth/ProtectedRoute";

import UserAuth from "./travel-user/components/auth/UserAuth";
import UserHome from "./travel-user/components/dashboard/UserDashboard";
import UserListings from "./travel-user/components/listings/UserListings";
import UserBookings from "./travel-user/components/booking/UserBookings";
import UserProtectedRoute from "./travel-user/components/auth/ProtectedRoute";
import UserCart from "./travel-user/components/cart/UserCart";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ChooseRole />} />

        <Route path="/admin/auth" element={<AdminAuth />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/categories"
          element={
            <ProtectedRoute>
              <AdminCategories />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/listings"
          element={
            <ProtectedRoute>
              <AdminListings />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedRoute>
              <AdminBookings />
            </ProtectedRoute>
          }
        />

        <Route path="/user/login" element={<UserAuth />} />
        <Route
          path="/user/home"
          element={
            <UserProtectedRoute>
              <UserCart />
              <UserHome />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/user/listings"
          element={
            <UserProtectedRoute>
              <UserCart />
              <UserListings />
            </UserProtectedRoute>
          }
        />
        <Route
          path="/user/bookings"
          element={
            <UserProtectedRoute>
              <UserCart />
              <UserBookings />
            </UserProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
