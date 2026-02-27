import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { expenseAPI } from "../../services/api.js";
import { useToast } from "../ToastProvider.jsx";
import ExpenseChart from "../widgets/ExpenseChart.jsx";
import AddExpenseModal from "../modals/AddExpenseModal.jsx";
import { formatDate } from "../../utils/dateHelpers.js";
import { formatCurrency } from "../../utils/currencyHelpers.js";

const CATS = [
  { value: "flight", label: "Flights", emoji: "✈️" },
  { value: "accommodation", label: "Accommodation", emoji: "🏨" },
  { value: "food", label: "Food", emoji: "🍜" },
  { value: "activity", label: "Activities", emoji: "🎭" },
  { value: "transport", label: "Transport", emoji: "🚌" },
  { value: "shopping", label: "Shopping", emoji: "🛍️" },
  { value: "other", label: "Other", emoji: "💰" },
];

export default function ExpensesTab({ tripId, trip }) {
  const toast = useToast();

  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("all");

  /* ---------------- FETCH ---------------- */

  const fetchExpenses = async () => {
    try {
      const { data } = await expenseAPI.getAll(tripId);
      setExpenses(data.expenses || []);
      setSummary(data.summary || {});
    } catch {
      toast("Failed to load expenses", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [tripId]);

  /* ---------------- DELETE ---------------- */

  const handleDelete = async (id) => {
    try {
      await expenseAPI.delete(id);
      const next = expenses.filter((e) => e.id !== id);
      setExpenses(next);

      const newSummary = next.reduce((acc, e) => {
        acc[e.category] = (acc[e.category] || 0) + parseFloat(e.amount);
        return acc;
      }, {});
      setSummary(newSummary);

      toast("Expense removed", "info");
    } catch {
      toast("Failed to delete", "error");
    }
  };

  /* ---------------- CALCULATIONS ---------------- */

  const total = expenses.reduce((sum, e) => sum + parseFloat(e.amount || 0), 0);

  const budget = parseFloat(trip?.budget || 0);
  const remaining = budget - total;
  const percentUsed = budget ? Math.min((total / budget) * 100, 100) : 0;

  const filtered =
    filter === "all" ? expenses : expenses.filter((e) => e.category === filter);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-surface-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard
          title="Total Spent"
          value={formatCurrency(total, trip?.currency)}
        />

        <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm">
          <p className="text-xs text-surface-400 font-medium mb-1">Budget</p>
          <p className="text-2xl font-bold text-dark-900">
            {formatCurrency(budget, trip?.currency)}
          </p>

          <div className="mt-4">
            <div className="flex justify-between text-xs text-surface-400 mb-1">
              <span>{percentUsed.toFixed(0)}% used</span>
              <span>
                {remaining >= 0
                  ? `${formatCurrency(remaining, trip?.currency)} left`
                  : "Over budget"}
              </span>
            </div>

            <div className="h-2 bg-surface-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentUsed > 90
                    ? "bg-red-400"
                    : percentUsed > 70
                      ? "bg-yellow-400"
                      : "bg-green-400"
                }`}
                style={{ width: `${percentUsed}%` }}
              />
            </div>
          </div>
        </div>

        <SummaryCard
          title="Remaining"
          value={formatCurrency(Math.abs(remaining), trip?.currency)}
          valueClass={remaining >= 0 ? "text-green-600" : "text-red-500"}
        />
      </div>

      {/* Chart */}
      <ExpenseChart summary={summary} />

      {/* Filter + Add */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-2 flex-wrap flex-1">
          {["all", ...CATS.map((c) => c.value)].map((val) => {
            const cat = CATS.find((c) => c.value === val);
            return (
              <button
                key={val}
                onClick={() => setFilter(val)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  filter === val
                    ? "bg-primary-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {val === "all" ? "All" : `${cat.emoji} ${cat.label}`}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={14} />
          Add Expense
        </button>
      </div>

      {/* Expense List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-surface-200 shadow-sm">
            <div className="text-5xl mb-3">💸</div>
            <p className="text-surface-400 text-sm">No expenses yet</p>
          </div>
        ) : (
          filtered.map((exp) => {
            const cat =
              CATS.find((c) => c.value === exp.category) ||
              CATS[CATS.length - 1];

            return (
              <div
                key={exp.id}
                className="bg-white rounded-2xl p-4 border border-surface-200 shadow-sm hover:shadow-md transition-all flex items-center gap-4 group"
              >
                <div className="w-11 h-11 rounded-xl bg-gray-100 flex items-center justify-center text-xl">
                  {cat.emoji}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-semibold text-dark-900">
                    {exp.description || cat.label}
                  </p>
                  <p className="text-xs text-surface-400">
                    {cat.label} · {formatDate(exp.date)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-bold text-dark-900">
                    {formatCurrency(exp.amount, exp.currency)}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(exp.id)}
                  className="opacity-0 group-hover:opacity-100 text-surface-400 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <AddExpenseModal
          tripId={tripId}
          onClose={() => {
            setShowModal(false);
            fetchExpenses(); // refresh after add
          }}
        />
      )}
    </div>
  );
}



function SummaryCard({ title, value, valueClass = "" }) {
  return (
    <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm">
      <p className="text-xs text-surface-400 font-medium mb-1">{title}</p>
      <p className={`text-2xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}
