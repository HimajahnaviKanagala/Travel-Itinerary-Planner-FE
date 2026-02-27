import React from "react";

export default function LoadingSpinner({ size = "md", text }) {
  const s = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-2",
    lg: "w-12 h-12 border-[3px]",
  }[size];
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={`${s} border-surface-300 border-t-primary-500 rounded-full animate-spin`}
      />
      {text && <p className="text-surface-500 text-sm font-medium">{text}</p>}
    </div>
  );
}
