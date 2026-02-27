import React, { useState } from "react";
import { expenseAPI } from "../../services/api";
import toast from "react-hot-toast";
import { X, Save, Loader2, DollarSign, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const AddExpenseModal = ({ tripId, editingExpense, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: editingExpense?.category || "food",
    amount: editingExpense?.amount || "",
    currency: editingExpense?.currency || "USD",
    description: editingExpense?.description || "",
    date: editingExpense?.date || format(new Date(), "yyyy-MM-dd"),
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(formData.amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    setLoading(true);

    try {
      if (editingExpense) {
        await expenseAPI.update(editingExpense.id, formData);
        toast.success("Expense updated!");
      } else {
        await expenseAPI.add(tripId, formData);
        toast.success("Expense added!");
      }
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to save expense");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { value: "flight", label: "✈️ Flight", icon: "✈️" },
    { value: "accommodation", label: "🏨 Accommodation", icon: "🏨" },
    { value: "food", label: "🍽️ Food", icon: "🍽️" },
    { value: "transport", label: "🚗 Transport", icon: "🚗" },
    { value: "activity", label: "🎯 Activity", icon: "🎯" },
    { value: "shopping", label: "🛍️ Shopping", icon: "🛍️" },
    { value: "other", label: "💰 Other", icon: "💰" },
  ];

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
              <DollarSign className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {editingExpense ? "Edit Expense" : "Add Expense"}
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
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Amount and Currency */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span>Amount *</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value="USD">$ USD</option>
                  <option value="EUR">€ EUR</option>
                  <option value="GBP">£ GBP</option>
                  <option value="INR">₹ INR</option>
                  <option value="JPY">¥ JPY</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="e.g., Lunch at restaurant, Hotel booking"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Date */}
            <div>
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4" />
                <span>Date *</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
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
            className="flex-1 flex items-center justify-center space-x-2 py-3 bg-linear-to-r from-indigo-500 to-purple-600 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{editingExpense ? "Update" : "Add"} Expense</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddExpenseModal;
