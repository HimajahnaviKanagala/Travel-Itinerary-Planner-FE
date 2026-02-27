import React, { useState } from "react";
import { supabase } from "../config/supabase";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { X, Save, Loader2, Bell, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const AddReminderModal = ({ tripId, trip, editingReminder, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: editingReminder?.type || "custom",
    title: editingReminder?.title || "",
    description: editingReminder?.description || "",
    reminder_time: editingReminder?.reminder_time
      ? format(new Date(editingReminder.reminder_time), "yyyy-MM-dd'T'HH:mm")
      : "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.reminder_time) {
      toast.error("Please set a reminder time");
      return;
    }

    setLoading(true);

    try {
      if (editingReminder) {
        const { error } = await supabase
          .from("reminders")
          .update({
            type: formData.type,
            title: formData.title,
            description: formData.description,
            reminder_time: formData.reminder_time,
          })
          .eq("id", editingReminder.id);

        if (error) throw error;
        toast.success("Reminder updated!");
      } else {
        const { error } = await supabase.from("reminders").insert([
          {
            trip_id: tripId,
            user_id: user.id,
            type: formData.type,
            title: formData.title,
            description: formData.description,
            reminder_time: formData.reminder_time,
            is_sent: false,
          },
        ]);

        if (error) throw error;
        toast.success("Reminder created!");
      }
      onClose();
    } catch (error) {
      toast.error("Failed to save reminder");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-primary-50 to-accent-50">
          <div className="flex items-center space-x-3">
            <div className="bg-primary-100 p-2 rounded-lg">
              <Bell className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {editingReminder ? "Edit Reminder" : "Add Reminder"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-5">
            {/* Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Reminder Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="flight">✈️ Flight</option>
                <option value="checkin">🏨 Check-in</option>
                <option value="activity">🎯 Activity</option>
                <option value="custom">🔔 Custom</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="e.g., Flight departure, Hotel check-in"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Additional details about this reminder..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            {/* Reminder Time */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                <span>Reminder Date & Time *</span>
              </label>
              <input
                type="datetime-local"
                name="reminder_time"
                value={formData.reminder_time}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
              <p className="text-sm text-blue-900">
                💡 <span className="font-medium">Tip:</span> Set reminders ahead
                of time so you never miss important events!
              </p>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 flex items-center justify-center space-x-2 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{editingReminder ? "Update" : "Create"} Reminder</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddReminderModal;
