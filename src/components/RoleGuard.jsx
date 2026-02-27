import { useRole } from "../hooks/useRole.js";
import { Navigate } from "react-router-dom";

export default function RoleGuard({
  children,
  roles,
  permission,
  fallback = null,
  redirect,
}) {
  const { user, can, hasAnyRole } = useRole();

  const isAllowed = permission
    ? can(permission)
    : roles
      ? hasAnyRole(...roles)
      : true;

  if (!isAllowed) {
    if (redirect) return <Navigate to={redirect} replace />;
    return fallback;
  }

  return children;
}
