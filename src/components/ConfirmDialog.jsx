import React from "react";
import Modal from "./Modal.jsx";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={24} className="text-red-500" />
        </div>
        <h3 className="font-display text-xl font-bold text-dark-900 mb-2">
          {title}
        </h3>
        <p className="text-surface-500 text-sm mb-6 leading-relaxed">
          {message}
        </p>
        <div className="flex gap-3">
          <button onClick={onConfirm} className="btn-danger flex-1">
            Yes, Delete
          </button>
          <button
            onClick={onClose}
            className="btn-ghost flex-1 border border-surface-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
