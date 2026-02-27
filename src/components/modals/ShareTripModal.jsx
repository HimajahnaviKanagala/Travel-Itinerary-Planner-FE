import React, { useState, useEffect } from "react";
import { Trash2, Copy, Check, Mail, Link2, Shield } from "lucide-react";
import { shareAPI } from "../../services/api.js";
import Modal from "../Modal.jsx";
import { useToast } from "../ToastProvider.jsx";

export default function ShareTripModal({ isOpen, onClose, tripId }) {
  const toast = useToast();
  const [shares, setShares] = useState([]);
  const [form, setForm] = useState({
    shared_with_email: "",
    permission: "view",
  });
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    shareAPI
      .getAll(tripId)
      .then(({ data }) => setShares(data.shares || []))
      .catch(() => {});
  }, [isOpen, tripId]);

  const handleShare = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await shareAPI.share(tripId, form);
      setShares((s) => [
        ...s.filter((x) => x.shared_with_email !== form.shared_with_email),
        data.share,
      ]);
      toast(`Shared with ${form.shared_with_email}! 🔗`);
      setForm({ shared_with_email: "", permission: "view" });
    } catch {
      toast("Failed to share", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = async (tripId, shareId) => {
    try {
      await shareAPI.remove(tripId, shareId);
      setShares((s) => s.filter((x) => x.id !== shareId));
      toast("Access removed", "info");
    } catch {
      toast("Failed to remove", "error");
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast("Link copied! 🔗");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Share Trip">
      <div className="space-y-8">
        {/* Copy Link Section */}
        <div className="bg-linear-to-br from-indigo-50 to-purple-50 p-5 rounded-2xl border border-indigo-100">
          <div className="flex items-center gap-2 mb-3">
            <Link2 size={16} className="text-indigo-600" />
            <label className="text-sm font-semibold text-gray-700">
              Copy Trip Link
            </label>
          </div>

          <div className="flex gap-2">
            <input
              className="flex-1 text-xs px-4 py-3 rounded-xl border bg-white text-gray-500 focus:ring-2 focus:ring-indigo-400"
              value={window.location.href}
              readOnly
            />
            <button
              onClick={copyLink}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                copied
                  ? "bg-green-100 text-green-600"
                  : "bg-indigo-600 text-white hover:shadow-lg hover:scale-105"
              }`}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>

        {/* Invite Section */}
        <div className="bg-white border rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Mail size={16} className="text-purple-600" />
            <label className="text-sm font-semibold text-gray-700">
              Invite by Email
            </label>
          </div>

          <form
            onSubmit={handleShare}
            className="flex flex-col md:flex-row gap-3"
          >
            <input
              required
              type="email"
              className="flex-1 px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-400"
              value={form.shared_with_email}
              onChange={(e) =>
                setForm((f) => ({ ...f, shared_with_email: e.target.value }))
              }
              placeholder="friend@email.com"
            />

            <select
              className="px-4 py-3 rounded-xl border focus:ring-2 focus:ring-purple-400"
              value={form.permission}
              onChange={(e) =>
                setForm((f) => ({ ...f, permission: e.target.value }))
              }
            >
              <option value="view">View</option>
              <option value="edit">Edit</option>
            </select>

            <button
              type="submit"
              disabled={saving}
              className="bg-linear-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50"
            >
              {saving ? "Sharing..." : "Share"}
            </button>
          </form>
        </div>

        {/* Shared Users */}
        {shares.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-indigo-600" />
              <label className="text-sm font-semibold text-gray-700">
                Shared With
              </label>
            </div>

            <div className="space-y-3">
              {shares.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-sm font-bold text-white">
                    {s.shared_with_email[0].toUpperCase()}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">
                      {s.shared_with_email}
                    </p>
                    <span
                      className={`inline-block mt-1 px-2 py-1 text-xs rounded-full ${
                        s.permission === "edit"
                          ? "bg-purple-100 text-purple-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {s.permission}
                    </span>
                  </div>

                  <button
                    onClick={() => handleRemove(tripId, s.id)}
                    className="text-gray-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
