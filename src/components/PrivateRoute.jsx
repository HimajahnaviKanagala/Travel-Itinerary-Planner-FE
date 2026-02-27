import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { can, hasAnyRole } from "../utils/roleHelpers.js";
import LoadingSpinner from "./LoadingSpinner.jsx";

export default function PrivateRoute({ children, roles, permission }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="Loading…" />
      </div>
    );

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Role check
  if (roles && !hasAnyRole(user, ...roles)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Permission check
  if (permission && !can(user, permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
