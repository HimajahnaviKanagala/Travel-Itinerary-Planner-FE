import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ToastProvider } from "./components/ToastProvider.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import CreateTrip from "./pages/CreateTrip.jsx";
import TripDetails from "./pages/TripDetails.jsx";
import Profile from "./pages/Profile.jsx";
import ManageRecommendations from "./pages/ManageRecommendations.jsx";
import AdminUsers from "./pages/AdminUsers.jsx";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-64px)]">{children}</main>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <Landing />
                </>
              }
            />
            <Route
              path="/login"
              element={
                <>
                  <Navbar />
                  <Login />
                </>
              }
            />
            <Route
              path="/register"
              element={
                <>
                  <Navbar />
                  <Register />
                </>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/trips/new"
              element={
                <PrivateRoute>
                  <Layout>
                    <CreateTrip />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/trips/:id"
              element={
                <PrivateRoute>
                  <Layout>
                    <TripDetails />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/recommendations/manage"
              element={
                <PrivateRoute roles={["ADMIN", "TRAVEL_AGENT"]}>
                  <Layout>
                    <ManageRecommendations />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* ── ADMIN only ── */}
            <Route
              path="/admin/users"
              element={
                <PrivateRoute roles={["ADMIN"]}>
                  <Layout>
                    <AdminUsers />
                  </Layout>
                </PrivateRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
