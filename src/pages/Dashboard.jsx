import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { tripAPI } from "../services/api.js";
import toast from "react-hot-toast";
import {
  Plus,
  Plane,
  Calendar,
  DollarSign,
  MapPin,
  Filter,
  Search,
} from "lucide-react";
import { motion } from "framer-motion";
import TripCard from "../components/TripCard.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import StatCard from "../components/StatCard.jsx";

const Dashboard = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadTrips = async () => {
      await fetchTrips();
    };
    loadTrips();
  }, [filter]);

  const fetchTrips = async () => {
    try {
      setLoading(true);

      const params = filter !== "all" ? { status: filter } : {};
      const response = await tripAPI.getAll(params);

      // Safe fallback
      setTrips(response?.data?.trips || []);
    } catch (error) {
      toast.error("Failed to fetch trips");
      console.error("Fetch trips error:", error);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  // Safe filtering
  const filteredTrips = trips.filter((trip) => {
    const title = trip?.title?.toLowerCase() || "";
    const country = trip?.destination_country?.toLowerCase() || "";
    const search = searchQuery.toLowerCase();

    return title.includes(search) || country.includes(search);
  });

  // Stats calculation
  const stats = {
    total: trips.length,
    planning: trips.filter((t) => t.status === "planning").length,
    confirmed: trips.filter((t) => t.status === "confirmed").length,
    ongoing: trips.filter((t) => t.status === "ongoing").length,
    completed: trips.filter((t) => t.status === "completed").length,
  };

  const filterOptions = [
    { value: "all", label: "All Trips" },
    { value: "planning", label: "Planning" },
    { value: "confirmed", label: "Confirmed" },
    { value: "ongoing", label: "Ongoing" },
    { value: "completed", label: "Completed" },
  ];

  const handleDelete = async (id) => {
    try {
      await tripAPI.delete(id);
      setTrips((prev) => prev.filter((trip) => trip.id !== id));
      toast.success("Trip deleted successfully");
    } catch (error) {
      toast.error("Failed to delete trip");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-purple-600 mb-2">
                Welcome back, {user?.full_name?.split(" ")[0] || "Traveler"}! 👋
              </h1>
              <p className="text-gray-600">
                Here's an overview of your travel plans
              </p>
            </div>

            <Link
              to="/trips/new"
              className="mt-4 md:mt-0 inline-flex items-center space-x-2 px-6 py-3 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:from-primary-700 hover:to-accent-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Trip</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center mb-8">
            <div className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-linear-to-r from-indigo-200 to-purple-300 rounded-3xl p-4 shadow-md hover:from-primary-700 hover:to-accent-700 transition-all hover:shadow-xl transform hover:scale-105">
              <StatCard
                icon={Plane}
                label="Total Trips"
                value={stats.total}
                color="primary"
              />
            </div>

            <div className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-linear-to-r from-indigo-200 to-purple-300 rounded-3xl p-4 shadow-md hover:from-primary-700 hover:to-accent-700 transition-all hover:shadow-xl transform hover:scale-105">
              <StatCard
                icon={Calendar}
                label="Planning"
                value={stats.planning}
                color="orange"
              />
            </div>

            <div className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-linear-to-r from-indigo-200 to-purple-300 rounded-3xl p-4 shadow-md hover:from-primary-700 hover:to-accent-700 transition-all hover:shadow-xl transform hover:scale-105">
              <StatCard
                icon={MapPin}
                label="Ongoing"
                value={stats.ongoing}
                color="green"
              />
            </div>

            <div className="mt-4 md:mt-0 inline-flex items-center space-x-2 bg-linear-to-r from-indigo-200 to-purple-300 rounded-3xl p-4 shadow-md hover:from-primary-700 hover:to-accent-700 transition-all hover:shadow-xl transform hover:scale-105">
              <StatCard
                icon={DollarSign}
                label="Completed"
                value={stats.completed}
                color="purple"
              />
            </div>
          </div>
        </motion.div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-100"
        >
          <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-4 md:space-y-0">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search trips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all bg-white cursor-pointer"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Trips Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner message="Loading your trips..." />
          </div>
        ) : filteredTrips.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 bg-white rounded-xl shadow-md border border-gray-100"
          >
            <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Plane className="w-12 h-12 text-gray-400" />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {searchQuery ? "No trips found" : "No trips yet"}
            </h3>

            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {searchQuery
                ? "Try adjusting your search or filter criteria"
                : "Start planning your next adventure by creating your first trip!"}
            </p>

            {!searchQuery && (
              <Link
                to="/trips/new"
                className="inline-flex items-center space-x-2 px-6 py-3 bg-primary-600 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl hover:bg-primary-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <Plus className="w-5 h-5" />
                <span>Create Your First Trip</span>
              </Link>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip, index) => (
              <motion.div
                key={trip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <TripCard trip={trip} onDelete={handleDelete} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
