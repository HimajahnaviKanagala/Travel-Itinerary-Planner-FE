import React, { useState, useEffect } from "react";
import { useToast } from "../components/ToastProvider.jsx";
import RoleBadge from "../components/RoleBadge.jsx";
import api from "../services/api.js";
import { Search, Shield, Trash2, ChevronDown } from "lucide-react";

const ROLES = ["USER", "TRAVEL_AGENT", "ADMIN"];

export default function AdminUsers() {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [changing, setChanging] = useState(null); // userId being updated

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/auth/users"); // add this endpoint to your backend
        setUsers(data.users || []);
      } catch {
        toast("Failed to load users", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    setChanging(userId);
    try {
      await api.put(`/auth/users/${userId}/role`, { role: newRole });
      setUsers((u) =>
        u.map((x) => (x.id === userId ? { ...x, role: newRole } : x)),
      );
      toast(`Role updated to ${newRole}`);
    } catch {
      toast("Failed to update role", "error");
    } finally {
      setChanging(null);
    }
  };

  const handleDeactivate = async (userId, isActive) => {
    try {
      await api.put(`/auth/users/${userId}/status`, { is_active: !isActive });
      setUsers((u) =>
        u.map((x) => (x.id === userId ? { ...x, is_active: !isActive } : x)),
      );
      toast(`User ${isActive ? "deactivated" : "activated"}`);
    } catch {
      toast("Failed to update status", "error");
    }
  };

  const filtered = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-linear-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg">
              <Shield size={18} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">
              User Management
            </h1>
          </div>
          <p className="text-slate-400 text-sm ml-13">
            Manage roles and access for all registered users
          </p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              label: "Total Users",
              value: users.length,
              color: "from-indigo-500 to-purple-600",
            },
            {
              label: "Travel Agents",
              value: users.filter((u) => u.role === "TRAVEL_AGENT").length,
              color: "from-purple-500 to-pink-500",
            },
            {
              label: "Admins",
              value: users.filter((u) => u.role === "ADMIN").length,
              color: "from-red-400 to-red-600",
            },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-lg`}
            >
              <p className="text-3xl font-bold">{value}</p>
              <p className="text-sm opacity-80 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            size={15}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-slate-200 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-3">👥</div>
              <p className="text-slate-400 text-sm">No users found</p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/60 transition-colors group"
                  >
                    {/* User info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                          {u.full_name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {u.full_name}
                          </p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>

                    {/* Role dropdown */}
                    <td className="px-6 py-4">
                      <div className="relative inline-block">
                        <select
                          value={u.role}
                          disabled={changing === u.id}
                          onChange={(e) =>
                            handleRoleChange(u.id, e.target.value)
                          }
                          className={`appearance-none pl-3 pr-8 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer focus:outline-none transition-all ${
                            u.role === "ADMIN"
                              ? "bg-red-50 text-red-600 border-red-200"
                              : u.role === "TRAVEL_AGENT"
                                ? "bg-purple-50 text-purple-600 border-purple-200"
                                : "bg-slate-50 text-slate-500 border-slate-200"
                          }`}
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          size={11}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                        />
                        {changing === u.id && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <div className="w-3 h-3 border border-indigo-400 border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                          u.is_active
                            ? "bg-green-50 text-green-600 border-green-200"
                            : "bg-red-50 text-red-400 border-red-200"
                        }`}
                      >
                        {u.is_active ? "● Active" : "○ Inactive"}
                      </span>
                    </td>

                    {/* Joined date */}
                    <td className="px-6 py-4 text-xs text-slate-400">
                      {u.created_at
                        ? new Date(u.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDeactivate(u.id, u.is_active)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                          u.is_active
                            ? "text-red-400 border-red-200 hover:bg-red-50"
                            : "text-green-500 border-green-200 hover:bg-green-50"
                        }`}
                      >
                        {u.is_active ? "Deactivate" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
