import React, { useState, useEffect } from "react";
import { useToast } from "../components/ToastProvider.jsx";
import api from "../services/api.js";
import { Plus, Trash2, Search, Sparkles } from "lucide-react";

const CATS = [
  "Adventure",
  "Culture",
  "Food",
  "Nature",
  "Nightlife",
  "Shopping",
  "Wellness",
  "Other",
];
const EMPTY = {
  title: "",
  description: "",
  category: "Adventure",
  destination: "",
  price_range: "",
  rating: "",
};

export default function ManageRecommendations() {
  const toast = useToast();
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [catFilter, setCatFilter] = useState("all");

  useEffect(() => {
    (async () => {
      try {
        // fetches all recommendations across all trips
        const { data } = await api.get("/recommendations");
        setRecs(data.recommendations || []);
      } catch {
        toast("Failed to load recommendations", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await api.post("/recommendations", form);
      setRecs((r) => [data.recommendation, ...r]);
      toast("Recommendation added! ✨");
      setShowForm(false);
      setForm(EMPTY);
    } catch {
      toast("Failed to add", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/recommendations/${id}`);
      setRecs((r) => r.filter((x) => x.id !== id));
      toast("Removed", "info");
    } catch {
      toast("Failed to delete", "error");
    }
  };

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const filtered = recs.filter((r) => {
    const matchSearch =
      r.title?.toLowerCase().includes(search.toLowerCase()) ||
      r.destination?.toLowerCase().includes(search.toLowerCase());
    const matchCat = catFilter === "all" || r.category === catFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Recommendations
              </h1>
              <p className="text-slate-400 text-sm">
                Manage activity recommendations for travelers
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-purple-500 to-pink-500 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all"
          >
            <Plus size={15} /> Add New
          </button>
        </div>

        {/* Add Form */}
        {showForm && (
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-purple-100 shadow-xl p-6 mb-8 animate-[scaleIn_.2s_ease]">
            <h2 className="text-lg font-bold text-slate-800 mb-5">
              New Recommendation
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Title *
                  </label>
                  <input
                    required
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                    value={form.title}
                    onChange={(e) => set("title", e.target.value)}
                    placeholder="e.g. Senso-ji Temple Visit"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Destination *
                  </label>
                  <input
                    required
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                    value={form.destination}
                    onChange={(e) => set("destination", e.target.value)}
                    placeholder="e.g. Tokyo, Japan"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Describe this activity…"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Category
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 transition-all"
                    value={form.category}
                    onChange={(e) => set("category", e.target.value)}
                  >
                    {CATS.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Price Range
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 transition-all"
                    value={form.price_range}
                    onChange={(e) => set("price_range", e.target.value)}
                  >
                    <option value="">Select…</option>
                    {["Free", "$", "$$", "$$$", "$$$$"].map((p) => (
                      <option key={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Rating (1–5)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 transition-all"
                    value={form.rating}
                    onChange={(e) => set("rating", e.target.value)}
                    placeholder="e.g. 4.5"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-linear-to-r from-purple-500 to-pink-500 text-white rounded-xl py-2.5 text-sm font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                >
                  {saving ? "Adding…" : "✨ Add Recommendation"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm(EMPTY);
                  }}
                  className="flex-1 border border-slate-200 rounded-xl py-2.5 text-sm font-medium hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search
              size={14}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all shadow-sm"
              placeholder="Search recommendations…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setCatFilter("all")}
              className={`text-xs px-3 py-2 rounded-xl font-semibold transition-all ${catFilter === "all" ? "bg-purple-500 text-white shadow-sm" : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"}`}
            >
              All
            </button>
            {CATS.map((c) => (
              <button
                key={c}
                onClick={() => setCatFilter(c)}
                className={`text-xs px-3 py-2 rounded-xl font-semibold transition-all ${catFilter === c ? "bg-purple-500 text-white shadow-sm" : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-slate-200 border-t-purple-500 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white/60 rounded-3xl border border-slate-200">
            <div className="text-5xl mb-3">✨</div>
            <p className="text-slate-400 text-sm">No recommendations found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((rec) => (
              <div
                key={rec.id}
                className="bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="flex justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-800 truncate">
                      {rec.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      📍 {rec.destination}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDelete(rec.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-all flex-shrink-0"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {rec.description && (
                  <p className="text-xs text-slate-500 leading-relaxed mb-3 line-clamp-2">
                    {rec.description}
                  </p>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                  {rec.category && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 border border-purple-100 font-medium">
                      {rec.category}
                    </span>
                  )}
                  {rec.price_range && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100 font-medium">
                      {rec.price_range}
                    </span>
                  )}
                  {rec.rating && (
                    <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 font-medium">
                      ★ {rec.rating}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
