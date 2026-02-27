import React from "react";

export default function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  accent = false,
}) {
  return (
    <div
      className={`card p-5 hover:shadow-warm-md transition-all duration-300 ${
        accent ? "bg-primary-500 border-primary-400" : ""
      }`}
    >
      {/* Render icon properly */}
      <div className="text-2xl mb-3">
        {Icon && <Icon className="w-6 h-6" />}
      </div>

      <div
        className={`font-display text-2xl font-bold ${
          accent ? "text-white" : "text-dark-900"
        }`}
      >
        {value}
      </div>

      <div
        className={`text-xs font-medium mt-1 ${
          accent ? "text-primary-100" : "text-surface-500"
        }`}
      >
        {label}
      </div>

      {sub && (
        <div
          className={`text-xs mt-0.5 ${
            accent ? "text-primary-200" : "text-surface-400"
          }`}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
