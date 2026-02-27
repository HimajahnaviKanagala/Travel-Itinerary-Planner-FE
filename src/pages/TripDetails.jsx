import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Share2, Edit2, Trash2, Check, Users } from "lucide-react";
import { tripAPI } from "../services/api.js";
import { useToast } from "../components/ToastProvider.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import ItineraryTab from "../components/tabs/ItineraryTab.jsx";
import ExpensesTab from "../components/tabs/ExpensesTab.jsx";
import PackingTab from "../components/tabs/PackingTab.jsx";
import DocumentsTab from "../components/tabs/DocumentsTab.jsx";
import ReviewsTab from "../components/tabs/ReviewsTab.jsx";
import RemindersTab from "../components/tabs/RemindersTab.jsx";
import WeatherWidget from "../components/widgets/WeatherWidget.jsx";
import MapWidget from "../components/widgets/MapWidget.jsx";
import RecommendationsPanel from "../components/recommendations/RecommendationsPanel.jsx";
import ShareTripModal from "../components/modals/ShareTripModal.jsx";
import { formatDate, tripDuration } from "../utils/dateHelpers.js";
import { formatCurrency } from "../utils/currencyHelpers.js";
import { useRole } from "../hooks/useRole.js";
import RoleGuard from "../components/RoleGuard.jsx";
import { recommendationAPI } from "../services/api.js";

const TABS = [
  { id: "overview", label: "📋 Overview" },
  { id: "itinerary", label: "🧭 Itinerary" },
  { id: "expenses", label: "💰 Expenses" },
  { id: "packing", label: "🎒 Packing" },
  { id: "documents", label: "📄 Documents" },
  { id: "reviews", label: "⭐ Reviews" },
  { id: "reminders", label: "🔔 Reminders" },
];

export default function TripDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { can, isAdmin, isTravelAgent } = useRole();

  const [trip, setTrip] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("overview");
  const [showDel, setShowDel] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [copied, setCopied] = useState(false);
  const [showAddRec, setShowAddRec] = useState(false);
  const [recForm, setRecForm] = useState({
    title: "",
    description: "",
    category: "Adventure",
    price_range: "",
    rating: "",
  });
  const [recSaving, setRecSaving] = useState(false);
  const [recRefreshKey, setRecRefreshKey] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const [{ data: td }, { data: sd }] = await Promise.all([
          tripAPI.getById(id),
          tripAPI.getStats(id),
        ]);
        setTrip(td.trip);
        setStats(sd.stats);
      } catch {
        toast("Failed to load trip", "error");
        navigate("/dashboard");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    try {
      await tripAPI.delete(id);
      toast("Trip deleted", "info");
      navigate("/dashboard");
    } catch {
      toast("Failed to delete", "error");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await tripAPI.update(id, editForm);
      setTrip(data.trip);
      toast("Trip updated!");
      setEditing(false);
    } catch {
      toast("Failed to update", "error");
    }
  };
  const handleAddRec = async (e) => {
    e.preventDefault();
    setRecSaving(true);
    try {
      await recommendationAPI.add(id, recForm);
      toast("Recommendation added! ✨");
      setShowAddRec(false);
      setRecForm({
        title: "",
        description: "",
        category: "Adventure",
        price_range: "",
        rating: "",
      });
      setRecRefreshKey((k) => k + 1);
    } catch {
      toast("Failed to add recommendation", "error");
    } finally {
      setRecSaving(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast("Link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner size="lg" text="Loading trip…" />
      </div>
    );

  if (!trip) return null;

  const days = tripDuration(trip.start_date, trip.end_date);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 pb-16">
      {/* ── HERO ─────────────────────────────────────────── */}
      <div className="relative h-80 md:h-88 overflow-hidden">
        {trip.cover_image ? (
          <img
            src={trip.cover_image}
            alt={trip.title}
            className="w-full h-full object-cover scale-105"
          />
        ) : (
          <div className="w-full h-full bg-linear-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
            <span className="text-8xl">🌍</span>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/40 to-black/80" />

        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">
              {trip.title}
            </h1>
            <p className="text-white/80 mt-2 text-sm">
              📍 {trip.destination_country}
            </p>

            {/* ── ADD: Admin badge visible in hero ── */}
            <RoleGuard roles={["ADMIN"]}>
              <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold px-3 py-1 rounded-full bg-red-500/30 border border-red-400/40 text-red-200">
                👑 Admin View
              </span>
            </RoleGuard>
          </div>

          <div className="flex gap-3">
            <IconButton onClick={copyLink}>
              {copied ? <Check size={16} /> : <Share2 size={16} />}
            </IconButton>

            <IconButton
              onClick={() => {
                setEditForm(trip);
                setEditing(true);
              }}
            >
              <Edit2 size={16} />
            </IconButton>

            <IconButton onClick={() => setShowShare(true)}>
              <Users size={16} />
            </IconButton>

            <IconButton onClick={() => setShowDel(true)} danger>
              <Trash2 size={16} />
            </IconButton>
          </div>
        </div>
      </div>

      {/* ── MAIN GLASS CONTAINER ─────────────────────────── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-16 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl border border-slate-200 p-8">
          {/* QUICK INFO */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            <InfoCard label="Start Date" value={formatDate(trip.start_date)} />
            <InfoCard label="End Date" value={formatDate(trip.end_date)} />
            <InfoCard label="Duration" value={days ? `${days} days` : "—"} />
            <InfoCard
              label="Budget"
              value={formatCurrency(trip.budget, trip.currency)}
            />
          </div>

          {/* TABS */}
          <div className="flex gap-3 mb-10 overflow-x-auto pb-2">
            {TABS.map(({ id: tabId, label }) => (
              <button
                key={tabId}
                onClick={() => setTab(tabId)}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  tab === tabId
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "bg-white border border-slate-300 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── OVERVIEW TAB ─────────────────────────────── */}
          {tab === "overview" && (
            <div className="space-y-8">
              {/* ── ADD: Admin info banner ── */}
              <RoleGuard roles={["ADMIN"]}>
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-red-50 border border-red-200">
                  <span className="text-2xl">👑</span>
                  <div>
                    <p className="text-sm font-bold text-red-700">Admin View</p>
                  </div>
                </div>
              </RoleGuard>

              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-purple-50 border border-purple-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">✨</span>
                  <div>
                    <p className="text-sm font-bold text-purple-700">
                      Have an activity in mind?
                    </p>
                    <p className="text-xs text-purple-500 mt-0.5">
                      Add recommendations for {trip.destination_country}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddRec(true)}
                  className="text-xs font-semibold px-4 py-2 rounded-xl bg-purple-600 text-white hover:bg-purple-700 transition-colors whitespace-nowrap"
                >
                  + Add Recommendation
                </button>
              </div>

              {trip.description && (
                <GlassCard title="About This Trip">
                  <p className="text-slate-600 leading-relaxed">
                    {trip.description}
                  </p>
                </GlassCard>
              )}

              {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <StatCard
                    label="Spent"
                    value={formatCurrency(stats.totalSpent, trip.currency)}
                  />
                  <StatCard
                    label="Remaining"
                    value={formatCurrency(stats.remaining, trip.currency)}
                  />
                  <StatCard label="Activities" value={stats.activityCount} />
                  <StatCard
                    label="Packing"
                    value={`${stats.packingPacked}/${stats.packingTotal}`}
                  />
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <GlassCard>
                  <WeatherWidget destination={trip.destination_country} />
                </GlassCard>
                <GlassCard>
                  <MapWidget destination={trip.destination_country} />
                </GlassCard>
              </div>

              <GlassCard>
                <RecommendationsPanel
                  tripId={id}
                  recRefreshKey={recRefreshKey}
                />
              </GlassCard>
            </div>
          )}

          {/* ── OTHER TABS ───────────────────────────────── */}
          {tab === "itinerary" && <ItineraryTab tripId={id} trip={trip} />}
          {tab === "expenses" && <ExpensesTab tripId={id} trip={trip} />}
          {tab === "packing" && <PackingTab tripId={id} />}
          {tab === "documents" && <DocumentsTab tripId={id} />}

          {/* ── ADD: Pass canModerate prop to ReviewsTab ── */}
          {tab === "reviews" && (
            <ReviewsTab tripId={id} canModerate={can("APPROVE_REVIEWS")} />
          )}

          {tab === "reminders" && <RemindersTab tripId={id} />}
        </div>
      </div>

      {/* ── MODALS ───────────────────────────────────────── */}
      <ConfirmDialog
        isOpen={showDel}
        onClose={() => setShowDel(false)}
        onConfirm={handleDelete}
        title="Delete Trip?"
        message="This action cannot be undone."
        confirmText="Delete"
        type="danger"
      />

      <ShareTripModal
        isOpen={showShare}
        onClose={() => setShowShare(false)}
        trip={trip}
      />

      {/* ── ADD: Edit modal ──────────────────────────────── */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setEditing(false)}
          />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-800 mb-5">Edit Trip</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Title
                </label>
                <input
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  value={editForm.title || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, title: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Description
                </label>
                <textarea
                  rows={2}
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all resize-none"
                  value={editForm.description || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Start Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                    value={editForm.start_date || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, start_date: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    End Date
                  </label>
                  <input
                    type="date"
                    className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                    value={editForm.end_date || ""}
                    onChange={(e) =>
                      setEditForm((f) => ({ ...f, end_date: e.target.value }))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Budget
                </label>
                <input
                  type="number"
                  className="w-full border border-slate-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all"
                  value={editForm.budget || ""}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, budget: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Status
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {["planning", "upcoming", "ongoing", "completed"].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setEditForm((f) => ({ ...f, status: s }))}
                      className={`py-2 rounded-xl text-xs font-bold capitalize border-2 transition-all ${
                        editForm.status === s
                          ? "bg-indigo-600 border-indigo-600 text-white"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ── Add Recommendation Modal ── */}
      {showAddRec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowAddRec(false)}
          />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-800 mb-1">
              Add Recommendation
            </h2>
            <p className="text-xs text-slate-400 mb-5">
              Adding for:{" "}
              <span className="font-medium text-purple-600">
                {trip.destination_country}
              </span>
            </p>

            <form onSubmit={handleAddRec} className="space-y-4">
              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Title *
                </label>
                <input
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  value={recForm.title}
                  onChange={(e) =>
                    setRecForm((f) => ({ ...f, title: e.target.value }))
                  }
                  placeholder="e.g. Visit Senso-ji Temple"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  value={recForm.description}
                  onChange={(e) =>
                    setRecForm((f) => ({ ...f, description: e.target.value }))
                  }
                  placeholder="Describe this activity…"
                />
              </div>

              {/* Category */}
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                  Category
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    "Adventure",
                    "Culture",
                    "Food",
                    "Nature",
                    "Nightlife",
                    "Shopping",
                    "Wellness",
                    "Other",
                  ].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() =>
                        setRecForm((f) => ({ ...f, category: cat }))
                      }
                      className={`py-2 px-2 rounded-xl text-xs font-semibold border-2 transition-all ${
                        recForm.category === cat
                          ? "border-purple-400 bg-purple-50 text-purple-700"
                          : "border-slate-200 text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range + Rating */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">
                    Price Range
                  </label>
                  <select
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-400 transition-all"
                    value={recForm.price_range}
                    onChange={(e) =>
                      setRecForm((f) => ({ ...f, price_range: e.target.value }))
                    }
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
                    value={recForm.rating}
                    onChange={(e) =>
                      setRecForm((f) => ({ ...f, rating: e.target.value }))
                    }
                    placeholder="e.g. 4.5"
                  />
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={recSaving}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl py-2.5 text-sm font-semibold shadow-sm hover:shadow-md transition-all disabled:opacity-50"
                >
                  {recSaving ? "Adding…" : "✨ Add Recommendation"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddRec(false)}
                  className="flex-1 border border-slate-200 rounded-xl py-2.5 text-sm font-medium hover:bg-slate-50 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Unchanged helper components ───────────────────────────
function IconButton({ children, onClick, danger }) {
  return (
    <button
      onClick={onClick}
      className={`p-2.5 rounded-xl backdrop-blur-md border transition-all duration-200 ${
        danger
          ? "bg-red-500/20 text-red-400 border-red-400/30 hover:bg-red-500/30"
          : "bg-white/20 text-white border-white/30 hover:bg-white/30"
      }`}
    >
      {children}
    </button>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition">
      <p className="text-xs text-slate-400 uppercase mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-800">{value}</p>
    </div>
  );
}

function GlassCard({ title, children }) {
  return (
    <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-slate-200 shadow-sm">
      {title && (
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-linear-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 text-center border border-indigo-100 hover:shadow-md transition">
      <p className="text-xs uppercase text-indigo-500 mb-2">{label}</p>
      <p className="text-xl font-bold text-indigo-700">{value}</p>
    </div>
  );
}
