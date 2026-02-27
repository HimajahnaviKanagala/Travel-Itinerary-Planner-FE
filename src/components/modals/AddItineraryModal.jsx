import React, { useState } from "react";
import { itineraryAPI } from "../../services/api.js";
import toast from "react-hot-toast";
import { X, Save, Loader2, MapPin, Clock, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { tripDuration } from "../../utils/dateHelpers.js";

const AddItineraryModal = ({ tripId, trip, editingItem, onClose }) => {
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    day_number: editingItem?.day_number || 1,
    type: editingItem?.type || "activity",
    title: editingItem?.title || "",
    description: editingItem?.description || "",
    location: editingItem?.location || "",
    address: editingItem?.address || "",
    start_time: editingItem?.start_time
      ? format(new Date(editingItem.start_time), "yyyy-MM-dd'T'HH:mm")
      : "",
    end_time: editingItem?.end_time
      ? format(new Date(editingItem.end_time), "yyyy-MM-dd'T'HH:mm")
      : "",
    confirmation_number: editingItem?.confirmation_number || "",
    notes: editingItem?.notes || "",
  });

  const tripduration = trip ? tripDuration(trip.start_date, trip.end_date) : 1;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingItem) {
        await itineraryAPI.update(editingItem.id, formData);
        toast.success("Itinerary item updated!");
      } else {
        await itineraryAPI.add(tripId, formData);
        toast.success("Itinerary item added!");
      }

      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save item");
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
        className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2 rounded-lg">
              <Calendar className="w-5 h-5 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {editingItem ? "Edit Itinerary Item" : "Add Itinerary Item"}
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* FORM STARTS */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/* Scrollable Content */}
          <div className="p-6 overflow-y-auto flex-1 space-y-5">
            {/* Day + Type */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Day *
                </label>
                <select
                  name="day_number"
                  value={formData.day_number}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-xl"
                >
                  {Array.from({ length: tripduration }, (_, i) => i + 1).map(
                    (day) => (
                      <option key={day} value={day}>
                        Day {day}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-xl"
                >
                  <option value="flight">✈️ Flight</option>
                  <option value="accommodation">🏨 Accommodation</option>
                  <option value="activity">🎯 Activity</option>
                  <option value="transport">🚗 Transport</option>
                  <option value="other">📍 Other</option>
                </select>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-xl"
              />
            </div>

            {/* Description */}
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Description..."
              className="w-full px-4 py-3 border rounded-xl resize-none"
            />

            {/* Location + Address */}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Location"
                className="px-4 py-3 border rounded-xl"
              />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address"
                className="px-4 py-3 border rounded-xl"
              />
            </div>

            {/* Time */}
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleChange}
                className="px-4 py-3 border rounded-xl"
              />
              <input
                type="datetime-local"
                name="end_time"
                value={formData.end_time}
                onChange={handleChange}
                className="px-4 py-3 border rounded-xl"
              />
            </div>

            {/* Confirmation */}
            <input
              type="text"
              name="confirmation_number"
              value={formData.confirmation_number}
              onChange={handleChange}
              placeholder="Confirmation Number"
              className="w-full px-4 py-3 border rounded-xl"
            />

            {/* Notes */}
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
              placeholder="Notes..."
              className="w-full px-4 py-3 border rounded-xl resize-none"
            />
          </div>

          {/* Footer (NOW INSIDE FORM ✅) */}
          <div className="px-6 py-4 border-t bg-gray-50 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-gray-200 rounded-xl"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {editingItem ? "Update" : "Add"} Item
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddItineraryModal;
