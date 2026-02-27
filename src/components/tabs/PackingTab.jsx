import React, { useState, useEffect } from "react";
import { Plus, Check, Trash2, Sparkles } from "lucide-react";
import { packingAPI } from "../../services/api.js";
import Modal from "../Modal.jsx";
import { useToast } from "../ToastProvider.jsx";

const CATS = [
  "Essentials",
  "Clothing",
  "Toiletries",
  "Electronics",
  "Documents",
  "Health",
  "Entertainment",
  "Other",
];

const EMOJI = {
  Essentials: "🎒",
  Clothing: "👕",
  Toiletries: "🧴",
  Electronics: "💻",
  Documents: "📄",
  Health: "💊",
  Entertainment: "🎧",
  Other: "📦",
};

const SUGGESTIONS = {
  Documents: [
    "Passport",
    "Visa",
    "Travel Insurance",
    "Hotel Confirmations",
    "Flight Tickets",
    "Emergency Contacts",
  ],
  Essentials: [
    "Phone Charger",
    "Power Bank",
    "Sunglasses",
    "Cash & Cards",
    "Travel Pillow",
    "Luggage Lock",
  ],
  Clothing: [
    "T-shirts ×5",
    "Pants ×3",
    "Underwear ×7",
    "Socks ×7",
    "Light Jacket",
    "Swimsuit",
    "Comfortable Shoes",
  ],
  Toiletries: [
    "Sunscreen SPF50+",
    "Toothbrush & Paste",
    "Deodorant",
    "Shampoo",
    "Face Wash",
    "Moisturizer",
  ],
  Electronics: [
    "Camera",
    "Memory Cards",
    "Universal Adapter",
    "Laptop",
    "Headphones",
    "Portable Charger",
  ],
  Health: [
    "Prescription Meds",
    "Pain Relievers",
    "Band-aids",
    "Hand Sanitizer",
    "Vitamins",
    "Antidiarrheal",
  ],
  Entertainment: ["Book/Kindle", "Journal", "Travel Games", "Neck Pillow"],
  Other: [
    "Reusable Bag",
    "Water Bottle",
    "Umbrella",
    "Snacks",
    "Zip-lock Bags",
  ],
};

export default function PackingTab({ tripId }) {
  const toast = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSugg, setShowSugg] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    item_name: "",
    category: "Essentials",
    quantity: 1,
    notes: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await packingAPI.getAll(tripId);
        setItems(data.items || []);
      } catch {
        toast("Failed to load packing list", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [tripId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await packingAPI.add(tripId, form);
      setItems((i) => [...i, data.item]);
      toast("Item added");
      setShowModal(false);
      setForm({
        item_name: "",
        category: "Essentials",
        quantity: 1,
        notes: "",
      });
    } catch {
      toast("Failed to add item", "error");
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (item) => {
    try {
      const { data } = await packingAPI.toggle(item.id);
      setItems((i) => i.map((x) => (x.id === item.id ? data.item : x)));
    } catch {
      toast("Failed to update", "error");
    }
  };

  const remove = async (id) => {
    try {
      await packingAPI.delete(id);
      setItems((i) => i.filter((x) => x.id !== id));
      toast("Removed", "info");
    } catch {
      toast("Failed to delete", "error");
    }
  };

  const total = items.length;
  const packed = items.filter((i) => i.is_packed).length;
  const pct = total ? Math.round((packed / total) * 100) : 0;

  const grouped = CATS.reduce((acc, cat) => {
    const ci = items.filter((i) => i.category === cat);
    if (ci.length) acc[cat] = ci;
    return acc;
  }, {});

  if (loading)
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-2 border-surface-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-8">
      {/* Progress */}
      <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm">
        <div className="flex justify-between text-sm font-medium mb-2">
          <span>
            {packed} of {total} packed
          </span>
          <span className={pct === 100 ? "text-green-600" : "text-primary-500"}>
            {pct}%
          </span>
        </div>
        <div className="h-2 bg-surface-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${
              pct === 100
                ? "bg-green-400"
                : "bg-linear-to-r from-primary-400 to-primary-600"
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
        {pct === 100 && (
          <p className="text-green-600 text-xs mt-2 text-center font-medium">
            🎉 All packed! You're ready to go
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between gap-3">
        <button
          onClick={() => setShowSugg(!showSugg)}
          className="btn-outline flex items-center gap-2 text-sm py-2"
        >
          <Sparkles size={14} />
          {showSugg ? "Hide" : "Show"} Suggestions
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center bg-linear-to-r from-indigo-500 to-purple-600 rounded-xl text-sm text-white gap-2 py-2.5 px-4 shadow-md hover:shadow-lg transition-all"
        >
          <Plus size={14} />
          Add Item
        </button>
      </div>

      {/* Suggestions */}
      {showSugg && (
        <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm animate-fade-in">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Sparkles size={14} className="text-primary-500" />
            Suggested Items
          </h3>

          {CATS.map((cat) => (
            <div key={cat} className="mb-5">
              <p className="text-xs uppercase tracking-wider font-semibold text-surface-400 mb-2">
                {EMOJI[cat]} {cat}
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS[cat].map((item) => {
                  const added = items.find(
                    (i) =>
                      i.item_name.toLowerCase() ===
                      item.toLowerCase().replace(/ ×\d+/, ""),
                  );
                  return (
                    <button
                      key={item}
                      onClick={() =>
                        !added &&
                        packingAPI
                          .add(tripId, {
                            item_name: item,
                            category: cat,
                            quantity: 1,
                          })
                          .then(({ data }) =>
                            setItems((i) => [...i, data.item]),
                          )
                      }
                      className={`text-xs px-4 py-2 rounded-full border transition-all ${
                        added
                          ? "bg-green-50 border-green-300 text-green-600"
                          : "border-surface-200 hover:bg-primary-50 hover:border-primary-300"
                      }`}
                    >
                      {added ? "✓ " : ""}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List */}
      {Object.entries(grouped).map(([cat, list]) => (
        <div key={cat}>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-lg">{EMOJI[cat]}</span>
            <span className="text-xs font-bold uppercase tracking-wider text-surface-500">
              {cat}
            </span>
            <span className="text-xs text-surface-400">
              ({list.filter((i) => i.is_packed).length}/{list.length})
            </span>
          </div>

          <div className="space-y-2">
            {list.map((item) => (
              <div
                key={item.id}
                onClick={() => toggle(item)}
                className={`bg-white rounded-2xl p-4 border border-surface-200 shadow-sm hover:shadow-md transition-all flex items-center gap-3 cursor-pointer group ${
                  item.is_packed ? "opacity-60" : ""
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-md border-2 flex items-center justify-center ${
                    item.is_packed
                      ? "bg-green-500 border-green-500"
                      : "border-surface-300 group-hover:border-primary-400"
                  }`}
                >
                  {item.is_packed && <Check size={11} className="text-white" />}
                </div>

                <span
                  className={`flex-1 text-sm ${
                    item.is_packed
                      ? "line-through text-surface-300"
                      : "text-dark-900"
                  }`}
                >
                  {item.item_name}
                </span>

                {item.quantity > 1 && (
                  <span className="text-xs text-surface-400">
                    ×{item.quantity}
                  </span>
                )}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(item.id);
                  }}
                  className="opacity-0 group-hover:opacity-100 text-surface-300 hover:text-red-500 p-2 rounded-lg hover:bg-red-50 transition"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Empty */}
      {items.length === 0 && (
        <div className="bg-white rounded-3xl p-14 border border-surface-200 text-center shadow-sm">
          <div className="text-5xl mb-3">🎒</div>
          <p className="text-surface-400 text-sm">Your packing list is empty</p>
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add Packing Item"
      >
        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-3xl p-6 border border-surface-200 shadow-sm space-y-6">
            <FloatingInput
              label="Item Name *"
              required
              value={form.item_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, item_name: e.target.value }))
              }
            />

            <FloatingSelect
              label="Category"
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
              options={CATS}
            />

            <FloatingInput
              label="Quantity"
              type="number"
              min="1"
              value={form.quantity}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  quantity: parseInt(e.target.value || 1),
                }))
              }
            />

            <FloatingTextarea
              label="Notes"
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
            />

            <div className="flex gap-4 pt-2">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-xl py-2.5 text-sm font-medium shadow-sm hover:shadow-md transition-all"
              >
                {saving ? "Adding…" : "Add Item"}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="flex-1 border border-surface-200 rounded-2xl hover:bg-surface-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}

/* ---------- Floating Inputs ---------- */

function FloatingInput({ label, ...props }) {
  return (
    <div className="relative">
      <input
        {...props}
        placeholder={label}
        className="peer w-full px-4 pt-5 pb-2 text-sm bg-white border border-surface-200 rounded-2xl outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-200 placeholder-transparent"
      />
      <label className="absolute left-4 top-2 text-xs text-surface-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary-500 transition-all">
        {label}
      </label>
    </div>
  );
}

function FloatingTextarea({ label, ...props }) {
  return (
    <div className="relative">
      <textarea
        {...props}
        rows={2}
        placeholder={label}
        className="peer w-full px-4 pt-5 pb-2 text-sm bg-white border border-surface-200 rounded-2xl outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-200 placeholder-transparent resize-none"
      />
      <label className="absolute left-4 top-2 text-xs text-surface-400 peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-focus:top-2 peer-focus:text-xs peer-focus:text-primary-500 transition-all">
        {label}
      </label>
    </div>
  );
}

function FloatingSelect({ label, options, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className="w-full px-4 pt-5 pb-2 text-sm bg-white border border-surface-200 rounded-2xl outline-none transition focus:border-primary-400 focus:ring-1 focus:ring-primary-200"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <label className="absolute left-4 top-2 text-xs text-primary-500">
        {label}
      </label>
    </div>
  );
}
