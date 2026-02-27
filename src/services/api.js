import axios from "axios";

const BASE = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({ baseURL: BASE, timeout: 15000 });

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  },
);

export default api;

//  Auth
export const authAPI = {
  register: (d) => api.post("/auth/register", d),
  login: (d) => api.post("/auth/login", d),
  logout: () => api.post("/auth/logout"),
  me: () => api.get("/auth/me"),
  updateProfile: (d) => api.put("/auth/profile", d),
  changePassword: (d) => api.put("/auth/change-password", d),
};

// Trips
export const tripAPI = {
  getAll: (params) => api.get("/trips", { params }),
  getById: (id) => api.get(`/trips/${id}`),
  getStats: (id) => api.get(`/trips/${id}/stats`),
  create: (d) => api.post("/trips", d),
  update: (id, d) => api.put(`/trips/${id}`, d),
  delete: (id) => api.delete(`/trips/${id}`),
};

// Itinerary
export const itineraryAPI = {
  getAll: (tripId) => api.get(`/itinerary/trips/${tripId}/itinerary`),
  add: (tripId, d) => api.post(`/itinerary/trips/${tripId}/itinerary`, d),
  update: (id, d) => api.put(`/itinerary/itinerary/${id}`, d),
  delete: (id) => api.delete(`/itinerary/itinerary/${id}`),
};

// Expenses
export const expenseAPI = {
  getAll: (tripId) => api.get(`/expenses/trips/${tripId}/expenses`),
  add: (tripId, d) => api.post(`/expenses/trips/${tripId}/expenses`, d),
  update: (id, d) => api.put(`/expenses/expenses/${id}`, d),
  delete: (id) => api.delete(`/expenses/expenses/${id}`),
};

//  Documents
export const documentAPI = {
  getAll: (tripId) => api.get(`/documents/trips/${tripId}/documents`),
  add: (tripId, d) => api.post(`/documents/trips/${tripId}/documents`, d),
  delete: (id) => api.delete(`/documents/documents/${id}`),
};

//  Packing
export const packingAPI = {
  getAll: (tripId) => api.get(`/packing/trips/${tripId}/packing`),
  add: (tripId, d) => api.post(`/packing/trips/${tripId}/packing`, d),
  toggle: (id) => api.put(`/packing/packing/${id}/toggle`),
  delete: (id) => api.delete(`/packing/packing/${id}`),
};

// Trip Shares
export const shareAPI = {
  getAll: (tripId) => api.get(`/trip-shares/trips/${tripId}/shares`),
  share: (tripId, d) => api.post(`/trip-shares/trips/${tripId}/share`, d),
  remove: (tripId, shareId) =>
    api.delete(`/trip-shares/trips/${tripId}/shares/${shareId}`),
};

// Reviews
export const reviewAPI = {
  getAll: (tripId) => api.get(`/reviews/trips/${tripId}/reviews`),
  add: (tripId, d) => api.post(`/reviews/trips/${tripId}/reviews`, d),
  delete: (id) => api.delete(`/reviews/reviews/${id}`),
};

//  Reminders
export const reminderAPI = {
  getAll: (tripId) => api.get(`/reminders/trips/${tripId}/reminders`),
  add: (tripId, d) => api.post(`/reminders/trips/${tripId}/reminders`, d),
  delete: (id) => api.delete(`/reminders/reminders/${id}`),
};

// Recommendations
export const recommendationAPI = {
  getAll: (tripId) =>
    api.get(`/recommendations/trips/${tripId}/recommendations`),
  add: (tripId, d) =>
    api.post(`/recommendations/trips/${tripId}/recommendations`, d),
};
