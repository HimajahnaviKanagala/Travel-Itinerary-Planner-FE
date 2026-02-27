import React from "react";
import { Cloud } from "lucide-react";

const MOCK = [
  { day: "Mon", icon: "☀️", hi: 22, lo: 14 },
  { day: "Tue", icon: "⛅", hi: 19, lo: 12 },
  { day: "Wed", icon: "🌧️", hi: 15, lo: 10 },
  { day: "Thu", icon: "⛅", hi: 18, lo: 11 },
  { day: "Fri", icon: "☀️", hi: 24, lo: 15 },
  { day: "Sat", icon: "☀️", hi: 26, lo: 16 },
  { day: "Sun", icon: "🌦️", hi: 20, lo: 13 },
];

export default function WeatherWidget({ destination }) {
  const city = destination?.split(",")[0]?.trim() || "Destination";
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Cloud size={16} className="text-primary-500" />
          <h3 className="font-semibold text-dark-900 text-sm">
            7-Day Forecast
          </h3>
        </div>
        <span className="text-xs text-surface-400">{city}</span>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {MOCK.map(({ day, icon, hi, lo }) => (
          <div
            key={day}
            className="text-center py-2 rounded-xl hover:bg-surface-50 transition-colors"
          >
            <div className="text-xs text-surface-400 mb-1">{day}</div>
            <div className="text-xl mb-1">{icon}</div>
            <div className="text-xs font-semibold text-dark-900">{hi}°</div>
            <div className="text-xs text-surface-400">{lo}°</div>
          </div>
        ))}
      </div>
    </div>
  );
}
