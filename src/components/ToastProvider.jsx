import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3500);
  }, []);

  const remove = (id) => setToasts((t) => t.filter((x) => x.id !== id));

  const STYLES = {
    success: "bg-white border-green-200 text-green-800",
    error: "bg-white border-red-200 text-red-800",
    info: "bg-white border-primary-200 text-primary-800",
  };
  const ICONS = {
    success: <CheckCircle size={16} className="text-green-500" />,
    error: <XCircle size={16} className="text-red-500" />,
    info: <Info size={16} className="text-primary-500" />,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(({ id, message, type }) => (
          <div
            key={id}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-warm-md border text-sm font-medium animate-slide-down pointer-events-auto max-w-sm ${STYLES[type]}`}
          >
            {ICONS[type]}
            <span className="flex-1">{message}</span>
            <button
              onClick={() => remove(id)}
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
