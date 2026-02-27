import { useAuth } from "../context/AuthContext.jsx";
import {
  can,
  isAdmin,
  isTravelAgent,
  isUser,
  isAdminOrAgent,
  hasRole,
  hasAnyRole,
} from "../utils/roleHelpers.js";

export function useRole() {
  const { user } = useAuth();

  return {
    user,
    role: user?.role,
    isAdmin: isAdmin(user),
    isTravelAgent: isTravelAgent(user),
    isUser: isUser(user),
    isAdminOrAgent: isAdminOrAgent(user),
    can: (permission) => can(user, permission),
    hasRole: (role) => hasRole(user, role),
    hasAnyRole: (...roles) => hasAnyRole(user, ...roles),
  };
}
