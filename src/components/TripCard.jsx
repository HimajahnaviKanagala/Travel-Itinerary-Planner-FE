import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Clock, Trash2, ArrowRight } from "lucide-react";
import { formatDate, tripDuration } from "../utils/dateHelpers.js";
import { formatCurrency } from "../utils/currencyHelpers.js";

const STATUS_MAP = {
  planning: {
    cls: "bg-blue-50 text-blue-600 border border-blue-200",
    label: "Planning",
  },
  upcoming: {
    cls: "bg-amber-50 text-amber-600 border border-amber-200",
    label: "Upcoming",
  },
  ongoing: {
    cls: "bg-green-50 text-green-600 border border-green-200",
    label: "Ongoing",
  },
  completed: {
    cls: "bg-gray-100 text-gray-600 border border-gray-200",
    label: "Completed",
  },
};

export default function TripCard({ trip, onDelete }) {
  const [imgErr, setImgErr] = useState(false);
  const navigate = useNavigate();

  const days = tripDuration(trip.start_date, trip.end_date);
  const status = STATUS_MAP[trip.status] || STATUS_MAP.planning;

  return (
    <div
      onClick={() => navigate(`/trips/${trip.id}`)}
      className="bg-white rounded-2xl shadow-md hover:shadow-2xl 
      transition-all duration-300 hover:-translate-y-2 
      overflow-hidden cursor-pointer group relative"
    >
      {/* Cover Image */}
      <div className="relative h-48 overflow-hidden">
        {trip.cover_image && !imgErr ? (
          <img
            src={trip.cover_image}
            alt={trip.title}
            onError={() => setImgErr(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-indigo-200 to-purple-200 flex items-center justify-center">
            <span className="text-5xl">🌍</span>
          </div>
        )}

        <span
          className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full ${status.cls}`}
        >
          {status.label}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 truncate">
          {trip.title}
        </h3>

        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin size={14} className="text-indigo-500" />
          {trip.destination_country}
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs text-gray-500 mb-4">
          {trip.start_date && (
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(trip.start_date, "MMM d")}
            </div>
          )}

          {days && (
            <div className="flex items-center gap-1">
              <Clock size={12} />
              {days} days
            </div>
          )}

          {trip.budget && (
            <div className="flex items-center gap-1 col-span-2">
              {/* <DollarSign size={12} /> */}
              {formatCurrency(trip.budget, trip.currency)}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/trips/${trip.id}`);
            }}
            className="flex-1 flex items-center justify-center gap-2
            bg-indigo-600 hover:bg-indigo-700 text-white
            py-2 rounded-xl text-sm font-semibold transition"
          >
            View <ArrowRight size={14} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(trip.id);
            }}
            className="p-2 bg-gray-100 hover:bg-red-50 text-gray-500 
            hover:text-red-500 rounded-xl transition"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
