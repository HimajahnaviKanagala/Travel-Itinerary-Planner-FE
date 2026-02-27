export const ROLES = {
  ADMIN: "ADMIN",
  TRAVEL_AGENT: "TRAVEL_AGENT",
  USER: "USER",
};

export const isAdmin = (user) => user?.role === "ADMIN";
export const isTravelAgent = (user) => user?.role === "TRAVEL_AGENT";
export const isUser = (user) => user?.role === "USER";
export const isAdminOrAgent = (user) =>
  ["ADMIN", "TRAVEL_AGENT"].includes(user?.role);

export const hasRole = (user, role) => user?.role === role;
export const hasAnyRole = (user, ...roles) => roles.includes(user?.role);

export const PERMISSIONS = {
  CREATE_TRIP: ["ADMIN", "TRAVEL_AGENT", "USER"],
  DELETE_ANY_TRIP: ["ADMIN"],
  VIEW_ALL_TRIPS: ["ADMIN"],
  CREATE_RECOMMENDATION: ["ADMIN", "TRAVEL_AGENT"],
  DELETE_RECOMMENDATION: ["ADMIN"],
  EDIT_RECOMMENDATION: ["ADMIN", "TRAVEL_AGENT"],
  MANAGE_USERS: ["ADMIN"],
  VIEW_ALL_USERS: ["ADMIN"],
  CHANGE_USER_ROLE: ["ADMIN"],
  APPROVE_REVIEWS: ["ADMIN", "TRAVEL_AGENT"],
  DELETE_ANY_REVIEW: ["ADMIN"],
};

export const can = (user, permission) => {
  const allowed = PERMISSIONS[permission];
  if (!allowed) return false;
  return allowed.includes(user?.role);
};
