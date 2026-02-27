import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import RoleGuard from "./RoleGuard.jsx";
import { useRole } from "../hooks/useRole.js";
import RecommendationsPanel from "./recommendations/RecommendationsPanel.jsx";
import {
  Plane,
  LogOut,
  User,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  Plus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAdmin, isTravelAgent } = useRole(); 
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* ── Logo ── */}
        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          className="flex items-center gap-3 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300">
            <Plane size={18} className="text-white" />
          </div>
          <span className="text-4xl font-bold bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent hidden sm:block">
            Wanderlust
          </span>
        </Link>

        {/* ── Desktop Nav ── */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive("/dashboard")
                    ? "bg-indigo-50 text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                Dashboard
              </Link>

              <Link
                to="/trips/new"
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-indigo-500 to-purple-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <Plus size={14} /> New Trip
              </Link>

              {/* ✅ ADMIN + TRAVEL_AGENT only — desktop */}
              <RoleGuard roles={["ADMIN", "TRAVEL_AGENT"]}>
                <Link
                  to="/recommendations/manage"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive("/recommendations/manage")
                      ? "bg-purple-50 text-purple-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  ✨ Recommendations
                </Link>
              </RoleGuard>

              {/* ✅ ADMIN only — desktop */}
              <RoleGuard roles={["ADMIN"]}>
                <Link
                  to="/admin/users"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive("/admin/users")
                      ? "bg-red-50 text-red-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  👑 Admin
                </Link>
              </RoleGuard>

              {/* User Dropdown */}
              <div className="relative ml-2" ref={dropRef}>
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-white shadow-md border border-gray-100 hover:shadow-lg transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-sm font-bold text-white">
                    {user?.full_name?.[0]?.toUpperCase()}
                  </div>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-300 ${dropOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropOpen && (
                  <div className="absolute right-0 mt-3 w-60 bg-white rounded-3xl shadow-2xl border border-gray-100 p-2 animate-[fadeIn_.2s_ease]">
                    <div className="px-4 py-3 border-b border-gray-100 mb-2">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user?.email}
                      </p>
                      {/* ✅ Role shown in dropdown */}
                      <span
                        className={`inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full font-medium ${
                          user?.role === "ADMIN"
                            ? "bg-red-50 text-red-500 border border-red-200"
                            : user?.role === "TRAVEL_AGENT"
                              ? "bg-purple-50 text-purple-500 border border-purple-200"
                              : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {user?.role === "ADMIN"
                          ? "👑 Admin"
                          : user?.role === "TRAVEL_AGENT"
                            ? "🧭 Travel Agent"
                            : "👤 User"}
                      </span>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setDropOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm hover:bg-gray-50 transition-all"
                    >
                      <User size={15} /> Profile & Settings
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-all"
                    >
                      <LogOut size={15} /> Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-indigo-500 to-purple-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="px-5 py-2 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-indigo-500 to-purple-600 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile Toggle ── */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-all"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile Menu ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            {isAuthenticated ? (
              <>
                {/* User info */}
                <div className="flex items-center gap-3 px-3 py-3 mb-3 bg-gray-50 rounded-xl">
                  <div className="w-9 h-9 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
                    {user?.full_name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {user?.full_name}
                    </p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                    {/* ✅ Role badge in mobile user info */}
                    <span
                      className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${
                        user?.role === "ADMIN"
                          ? "bg-red-50 text-red-500"
                          : user?.role === "TRAVEL_AGENT"
                            ? "bg-purple-50 text-purple-500"
                            : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {user?.role === "ADMIN"
                        ? "👑 Admin"
                        : user?.role === "TRAVEL_AGENT"
                          ? "🧭 Travel Agent"
                          : "👤 User"}
                    </span>
                  </div>
                </div>

                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all"
                >
                  <LayoutDashboard size={14} /> Dashboard
                </Link>

                <Link
                  to="/trips/new"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all"
                >
                  <Plus size={14} /> New Trip
                </Link>

                {/* ✅ ADMIN + TRAVEL_AGENT only — mobile */}
                <RoleGuard roles={["ADMIN", "TRAVEL_AGENT"]}>
                  <Link
                    to="/recommendations/manage"
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-purple-600 hover:bg-purple-50 transition-all"
                  >
                    ✨ Recommendations
                  </Link>
                </RoleGuard>

                {/* ✅ ADMIN only — mobile */}
                <RoleGuard roles={["ADMIN"]}>
                  <Link
                    to="/admin/users"
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                  >
                    👑 Admin Panel
                  </Link>
                </RoleGuard>

                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all"
                >
                  <User size={14} /> Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
                >
                  <LogOut size={14} /> Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-100"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2.5 rounded-xl text-sm font-semibold text-white bg-linear-to-r from-indigo-500 to-purple-600 text-center"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
