import React, { useState, useEffect } from "react";
import { itineraryAPI } from "../../services/api";
import toast from "react-hot-toast";
import { Plus, MapPin, Clock, Calendar, Trash2, Edit2 } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import AddItineraryModal from "../modals/AddItineraryModal";
import LoadingSpinner from "../../components/LoadingSpinner.jsx";
import { tripDuration } from "../../utils/dateHelpers";

const ItineraryTab = ({ tripId, trip, onUpdate }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    fetchItinerary();
  }, [tripId]);

  const fetchItinerary = async () => {
    try {
      setLoading(true);
      const response = await itineraryAPI.getAll(tripId);
      setItems(response.data.items);
    } catch (error) {
      toast.error("Failed to fetch itinerary");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Delete this itinerary item?")) return;

    try {
      await itineraryAPI.delete(itemId);
      toast.success("Item deleted");
      fetchItinerary();
      onUpdate?.();
    } catch (error) {
      toast.error("Failed to delete item");
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleModalClose = () => {
    setShowAddModal(false);
    setEditingItem(null);
    fetchItinerary();
    onUpdate?.();
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "flight":
        return "✈️";
      case "accommodation":
        return "🏨";
      case "activity":
        return "🎯";
      case "transport":
        return "🚗";
      default:
        return "📍";
    }
  };

  const getTypeColor = (type) => {
    const colors = {
      flight: "bg-blue-100 text-blue-800 border-blue-200",
      accommodation: "bg-purple-100 text-purple-800 border-purple-200",
      activity: "bg-green-100 text-green-800 border-green-200",
      transport: "bg-orange-100 text-orange-800 border-orange-200",
      other: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[type] || colors.other;
  };

  // Group items by day
  const itemsByDay = items.reduce((acc, item) => {
    const day = item.day_number;
    if (!acc[day]) acc[day] = [];
    acc[day].push(item);
    return acc;
  }, {});

  const tripduration = trip ? tripDuration(trip.start_date, trip.end_date) : 0;

  if (loading) {
    return <LoadingSpinner message="Loading itinerary..." />;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Trip Itinerary</h3>
          <p className="text-gray-600 mt-1">Plan your day-by-day activities</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-primary-600 bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl text-white  hover:bg-primary-700 transition-colors shadow-lg hover:shadow-xl"
        >
          <Plus className="w-5 h-5" />
          <span>Add Activity</span>
        </button>
      </div>

      {/* Itinerary List */}
      {Object.keys(itemsByDay).length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No itinerary items yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start planning your trip by adding flights, hotels, and activities
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-indigo-500 to-purple-600 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add First Activity</span>
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {Array.from({ length: tripduration }, (_, i) => i + 1).map(
            (dayNum) => {
              const dayItems = itemsByDay[dayNum] || [];
              const dayDate = new Date(trip.start_date);
              dayDate.setDate(dayDate.getDate() + dayNum - 1);

              return (
                <motion.div
                  key={dayNum}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: dayNum * 0.1 }}
                  className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                  {/* Day Header */}
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900">
                          Day {dayNum}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {format(dayDate, "EEEE, MMMM d, yyyy")}
                        </p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {dayItems.length}{" "}
                        {dayItems.length === 1 ? "activity" : "activities"}
                      </div>
                    </div>
                  </div>

                  {/* Day Items */}
                  <div className="p-6">
                    {dayItems.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        No activities planned for this day
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {dayItems
                          .sort((a, b) => {
                            if (!a.start_time) return 1;
                            if (!b.start_time) return -1;
                            return (
                              new Date(a.start_time) - new Date(b.start_time)
                            );
                          })
                          .map((item) => (
                            <motion.div
                              key={item.id}
                              whileHover={{ x: 4 }}
                              className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-primary-300 transition-all"
                            >
                              {/* Type Icon */}
                              <div className="flex-shrink-0 text-3xl">
                                {getTypeIcon(item.type)}
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex-1">
                                    <h5 className="text-lg font-semibold text-gray-900">
                                      {item.title}
                                    </h5>
                                    <span
                                      className={`inline-block px-2 py-1 rounded text-xs font-medium border mt-1 ${getTypeColor(item.type)}`}
                                    >
                                      {item.type}
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2 ml-4">
                                    <button
                                      onClick={() => handleEdit(item)}
                                      className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
                                    >
                                      <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                      onClick={() => handleDelete(item.id)}
                                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                </div>

                                {item.description && (
                                  <p className="text-gray-600 text-sm mb-3">
                                    {item.description}
                                  </p>
                                )}

                                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                  {item.start_time && (
                                    <div className="flex items-center space-x-1">
                                      <Clock className="w-4 h-4" />
                                      <span>
                                        {format(
                                          new Date(item.start_time),
                                          "h:mm a",
                                        )}
                                        {item.end_time &&
                                          ` - ${format(new Date(item.end_time), "h:mm a")}`}
                                      </span>
                                    </div>
                                  )}
                                  {item.location && (
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="w-4 h-4" />
                                      <span>{item.location}</span>
                                    </div>
                                  )}
                                  {item.confirmation_number && (
                                    <div className="flex items-center space-x-1">
                                      <span className="font-medium">
                                        Confirmation:
                                      </span>
                                      <span>{item.confirmation_number}</span>
                                    </div>
                                  )}
                                </div>

                                {item.notes && (
                                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <p className="text-sm text-gray-700">
                                      <span className="font-medium">Note:</span>{" "}
                                      {item.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </motion.div>
                          ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            },
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <AddItineraryModal
          tripId={tripId}
          trip={trip}
          editingItem={editingItem}
          onClose={handleModalClose}
        />
      )}
    </div>
  );
};

export default ItineraryTab;
