import React, { useState } from "react";
import { authAPI } from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { useToast } from "../components/ToastProvider.jsx";
import RoleBadge from "../components/RoleBadge.jsx";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const toast = useToast();

  const [profileForm, setProfileForm] = useState({
    full_name: user?.full_name || "",
    avatar_url: user?.avatar_url || "",
  });

  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });

  const [saving, setSaving] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);

  
  const FloatingInput = ({
    label,
    type = "text",
    value,
    onChange,
    required,
    disabled,
  }) => (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        placeholder=" "
        className={`
          peer w-full px-4 pt-5 pb-2 rounded-xl border
          ${disabled ? "bg-slate-100 cursor-not-allowed" : "bg-white"}
          border-slate-300
          focus:border-indigo-500
          focus:ring-2 focus:ring-indigo-200
          outline-none transition-all duration-200
        `}
      />
      <label
        className="
          absolute left-4 top-2 text-slate-500 text-sm
          transition-all
          peer-placeholder-shown:top-3.5
          peer-placeholder-shown:text-base
          peer-placeholder-shown:text-slate-400
          peer-focus:top-2
          peer-focus:text-sm
          peer-focus:text-indigo-600
        "
      >
        {label}
      </label>
    </div>
  );

  const handleProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await authAPI.updateProfile(profileForm);
      updateUser(data.user);
      toast("Profile updated!");
    } catch {
      toast("Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handlePw = async (e) => {
    e.preventDefault();

    if (pwForm.newPassword !== pwForm.confirm) {
      toast("Passwords do not match", "error");
      return;
    }

    if (pwForm.newPassword.length < 8) {
      toast("Password must be at least 8 characters", "error");
      return;
    }

    setPwSaving(true);
    try {
      await authAPI.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });

      toast("Password changed! Please log in again.", "info");
      setPwForm({
        currentPassword: "",
        newPassword: "",
        confirm: "",
      });
    } catch (err) {
      toast(err.response?.data?.error || "Failed to change password", "error");
    } finally {
      setPwSaving(false);
    }
  };

  
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-8 border border-slate-200">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-center bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Profile Settings
            </h1>
            <p className="text-slate-500 text-center mt-1">
              Manage your account information and security
            </p>
          </div>

          {/* Avatar Section */}
          <div className="flex items-center gap-6 p-6 rounded-2xl bg-linear-to-r from-indigo-500 to-purple-600 text-white shadow-lg mb-10">
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center text-3xl font-bold overflow-hidden">
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="avatar"
                  className="w-full h-full object-cover"
                />
              ) : (
                user?.full_name?.[0]?.toUpperCase()
              )}
            </div>

            <div>
              <h2 className="text-xl font-semibold">{user?.full_name}</h2>
              <p className="text-sm opacity-90">{user?.email}</p>
              <div className=" rounded-3xl bg-white/30 backdrop-blur px-3 py-1 inline-block">
                <RoleBadge role={user?.role} />
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold text-slate-700 mb-6">
              Personal Information
            </h3>

            <form onSubmit={handleProfile} className="space-y-6">
              <FloatingInput
                label="Full Name"
                value={profileForm.full_name}
                onChange={(e) =>
                  setProfileForm((f) => ({
                    ...f,
                    full_name: e.target.value,
                  }))
                }
                required
              />

              <FloatingInput label="Email" value={user?.email} disabled />

              <FloatingInput
                label="Avatar URL"
                value={profileForm.avatar_url}
                onChange={(e) =>
                  setProfileForm((f) => ({
                    ...f,
                    avatar_url: e.target.value,
                  }))
                }
              />

              <button
                type="submit"
                disabled={saving}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-[.98] transition-all text-white py-3 rounded-xl font-medium shadow-lg disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>

          {/* Security Section */}
          <div>
            <h3 className="text-lg font-semibold text-slate-700 mb-6">
              Security
            </h3>

            <form onSubmit={handlePw} className="space-y-6">
              <FloatingInput
                label="Current Password"
                type="password"
                value={pwForm.currentPassword}
                onChange={(e) =>
                  setPwForm((f) => ({
                    ...f,
                    currentPassword: e.target.value,
                  }))
                }
                required
              />

              <FloatingInput
                label="New Password"
                type="password"
                value={pwForm.newPassword}
                onChange={(e) =>
                  setPwForm((f) => ({
                    ...f,
                    newPassword: e.target.value,
                  }))
                }
                required
              />

              <FloatingInput
                label="Confirm Password"
                type="password"
                value={pwForm.confirm}
                onChange={(e) =>
                  setPwForm((f) => ({
                    ...f,
                    confirm: e.target.value,
                  }))
                }
                required
              />

              <button
                type="submit"
                disabled={pwSaving}
                className="w-full bg-purple-600 hover:bg-purple-700 active:scale-[.98] transition-all text-white py-3 rounded-xl font-medium shadow-lg disabled:opacity-50"
              >
                {pwSaving ? "Changing..." : "Change Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
