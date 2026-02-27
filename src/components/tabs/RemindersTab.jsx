import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { reminderAPI } from "../../services/api.js";
import Modal from "../Modal.jsx";
import { useToast } from "../ToastProvider.jsx";

const REM_TYPES = ["flight", "checkin", "checkout", "activity", "general"];

const TYPE_ICON = {
  flight: "✈️",
  checkin: "🏨",
  checkout: "🚪",
  activity: "🎭",
  general: "🔔",
};

export default function RemindersTab({ tripId }) {
  const toast = useToast();
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    type: "general",
    title: "",
    description: "",
    reminder_time: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await reminderAPI.getAll(tripId);
        setReminders(data.reminders || []);
      } catch {
        toast("Failed to load reminders", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [tripId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await reminderAPI.add(tripId, form);
      setReminders((r) => [...r, data.reminder]);
      toast("Reminder set! 🔔");
      setShowModal(false);
      setForm({
        type: "general",
        title: "",
        description: "",
        reminder_time: "",
      });
    } catch {
      toast("Failed to add reminder", "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await reminderAPI.delete(id);
      setReminders((r) => r.filter((x) => x.id !== id));
      toast("Removed", "info");
    } catch {
      toast("Failed to delete", "error");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-surface-200 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );

  const sorted = [...reminders].sort(
    (a, b) => new Date(a.reminder_time) - new Date(b.reminder_time),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-surface-200 flex justify-between items-center rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-dark-900">Reminders</h2>
          <p className="text-sm text-surface-500 mt-1">
            {reminders.length} reminder{reminders.length !== 1 ? "s" : ""}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl px-4 py-2 text-sm font-medium shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={14} />
          Add Reminder
        </button>
      </div>

      {/* Empty State */}
      {sorted.length === 0 ? (
        <div className="card p-16 text-center rounded-2xl border border-dashed border-surface-300">
          <div className="text-5xl mb-4">🔔</div>
          <p className="text-surface-500 text-sm">No reminders set yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map((rem) => {
            const isPast = new Date(rem.reminder_time) < new Date();

            return (
              <div
                key={rem.id}
                className={`relative overflow-hidden bg-white border border-surface-200 rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md transition-all group ${
                  isPast ? "opacity-60" : ""
                }`}
              >
                {/* Left Accent Bar */}
                <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-l-2xl" />

                <div className="text-3xl">{TYPE_ICON[rem.type] || "🔔"}</div>

                <div className="flex-1 min-w-0">
                  <p className="text-base font-semibold text-dark-900 truncate">
                    {rem.title}
                  </p>

                  <p className="text-xs text-surface-400 mt-1">
                    {new Date(rem.reminder_time).toLocaleString()}
                  </p>

                  {rem.description && (
                    <p className="text-xs text-surface-500 mt-2 italic line-clamp-2">
                      {rem.description}
                    </p>
                  )}
                </div>

                {isPast && (
                  <span className="px-3 py-1 text-xs rounded-full bg-surface-100 text-surface-400 border border-surface-200">
                    Past
                  </span>
                )}

                <button
                  onClick={() => remove(rem.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-surface-400 hover:text-red-500 hover:bg-red-50 transition-all"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Reminder"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-surface-500 mb-2">
              Title *
            </label>
            <input
              required
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
              placeholder="Reminder title"
              className="w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-500 mb-2">
              Type
            </label>
            <div className="flex flex-wrap gap-2">
              {REM_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, type: t }))}
                  className={`px-4 py-2 rounded-full text-xs font-medium capitalize transition-all border ${
                    form.type === t
                      ? "bg-indigo-50 border-indigo-400 text-indigo-600"
                      : "border-surface-200 text-surface-500 hover:border-surface-300"
                  }`}
                >
                  {TYPE_ICON[t]} {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-500 mb-2">
              Date & Time *
            </label>
            <input
              required
              type="datetime-local"
              value={form.reminder_time}
              onChange={(e) =>
                setForm((f) => ({ ...f, reminder_time: e.target.value }))
              }
              className="w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-500 mb-2">
              Description
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-xl py-2.5 text-sm font-medium shadow-md hover:shadow-lg transition-all"
            >
              {saving ? "Setting…" : "🔔 Set Reminder"}
            </button>

            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 rounded-xl border border-surface-200 text-sm py-2.5 hover:bg-surface-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
