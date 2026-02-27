import React, { useState, useEffect } from "react";
import { Plus, Trash2, Shield } from "lucide-react";
import { documentAPI } from "../../services/api.js";
import Modal from "../Modal.jsx";
import { useToast } from "../ToastProvider.jsx";

const DOC_TYPES = [
  { value: "passport", label: "Passport", emoji: "🛂" },
  { value: "visa", label: "Visa", emoji: "🔖" },
  { value: "ticket", label: "Ticket", emoji: "✈️" },
  { value: "hotel", label: "Hotel", emoji: "🏨" },
  { value: "insurance", label: "Insurance", emoji: "🛡️" },
  { value: "id", label: "ID Card", emoji: "🪪" },
  { value: "other", label: "Other", emoji: "📄" },
];

export default function DocumentsTab({ tripId }) {
  const toast = useToast();
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    type: "passport",
    name: "",
    file_url: "",
    expiry_date: "",
    notes: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await documentAPI.getAll(tripId);
        setDocs(data.documents || []);
      } catch {
        toast("Failed to load documents", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [tripId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await documentAPI.add(tripId, form);
      setDocs((d) => [data.document, ...d]);
      toast("Document saved! 🔒");
      setShowModal(false);
      setForm({
        type: "passport",
        name: "",
        file_url: "",
        expiry_date: "",
        notes: "",
      });
    } catch {
      toast("Failed to save", "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await documentAPI.delete(id);
      setDocs((d) => d.filter((x) => x.id !== id));
      toast("Removed", "info");
    } catch {
      toast("Failed to delete", "error");
    }
  };

  const isExpired = (d) => d && new Date(d) < new Date();
  const isSoon = (d) => {
    if (!d) return false;
    const diff = (new Date(d) - new Date()) / 86400000;
    return diff >= 0 && diff < 30;
  };

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-surface-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Secure Banner */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3 bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 px-5 py-3 rounded-2xl shadow-sm">
          <Shield size={16} className="text-blue-600" />
          <span className="text-sm font-medium text-blue-700">
            Documents stored securely & encrypted
          </span>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl text-sm text-white gap-2 py-2.5 px-4 shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={15} />
          Add Document
        </button>
      </div>

      {/* Empty State */}
      {docs.length === 0 ? (
        <div className="card p-16 text-center rounded-2xl">
          <div className="text-6xl mb-4">📁</div>
          <p className="text-dark-900 font-semibold mb-1">
            No documents added yet
          </p>
          <p className="text-surface-400 text-sm">
            Keep your travel documents organized & accessible
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {docs.map((doc) => {
            const dt =
              DOC_TYPES.find((t) => t.value === doc.type) || DOC_TYPES[6];

            return (
              <div
                key={doc.id}
                className="group relative bg-white border border-surface-200 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex gap-4 items-start">
                  <div className="text-4xl">{dt.emoji}</div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-dark-900 mb-1">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-surface-400 mb-2">{dt.label}</p>

                    {doc.expiry_date && (
                      <span
                        className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${
                          isExpired(doc.expiry_date)
                            ? "bg-red-100 text-red-600"
                            : isSoon(doc.expiry_date)
                              ? "bg-amber-100 text-amber-600"
                              : "bg-green-100 text-green-600"
                        }`}
                      >
                        {isExpired(doc.expiry_date)
                          ? "Expired"
                          : isSoon(doc.expiry_date)
                            ? "Expires Soon"
                            : "Valid"}{" "}
                        • {doc.expiry_date}
                      </span>
                    )}

                    {doc.notes && (
                      <p className="text-xs text-surface-400 mt-3 italic">
                        {doc.notes}
                      </p>
                    )}

                    {doc.file_url && (
                      <a
                        href={doc.file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary-600 hover:underline mt-2 inline-block"
                      >
                        📎 View attached file
                      </a>
                    )}
                  </div>

                  <button
                    onClick={() => remove(doc.id)}
                    className="opacity-0 group-hover:opacity-100 text-surface-300 hover:text-red-500 p-2 transition-all"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Document"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <label className="label">Document Name *</label>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              placeholder="e.g. US Passport"
              className="w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm focus:border-primary-400 focus:ring-1 focus:ring-primary-200 outline-none transition-all"
            />
          </div>

          {/* Type */}
          <div>
            <label className="label">Type</label>
            <div className="grid grid-cols-4 gap-3">
              {DOC_TYPES.map((dt) => (
                <button
                  key={dt.value}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: dt.value }))}
                  className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all text-xs ${
                    form.type === dt.value
                      ? "border-primary-400 bg-primary-50 text-primary-700 shadow-sm"
                      : "border-surface-200 text-surface-500 hover:border-primary-300 hover:bg-primary-50/40"
                  }`}
                >
                  <span className="text-lg">{dt.emoji}</span>
                  {dt.label}
                </button>
              ))}
            </div>
          </div>

          {/* File URL */}
          <div>
            <label className="label">File URL</label>
            <input
              value={form.file_url}
              onChange={(e) =>
                setForm((f) => ({ ...f, file_url: e.target.value }))
              }
              placeholder="https://..."
              className="w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm focus:border-primary-400 focus:ring-1 focus:ring-primary-200 outline-none transition-all"
            />
          </div>

          {/* Expiry */}
          <div>
            <label className="label">Expiry Date</label>
            <input
              type="date"
              value={form.expiry_date}
              onChange={(e) =>
                setForm((f) => ({ ...f, expiry_date: e.target.value }))
              }
              className="w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm focus:border-primary-400 focus:ring-1 focus:ring-primary-200 outline-none transition-all"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="label">Notes</label>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
              className="w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm resize-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 outline-none transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-xl py-2.5 text-sm font-medium shadow-sm hover:shadow-md transition-all"
            >
              {saving ? "Saving…" : "Save Document"}
            </button>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 border border-surface-200 rounded-xl py-2.5 text-sm font-medium hover:bg-surface-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
