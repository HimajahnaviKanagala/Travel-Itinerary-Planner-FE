import React, { useState, useEffect } from "react";
import { recommendationAPI } from "../../services/api.js";
import { Sparkles, MapPin, Tag, DollarSign } from "lucide-react";

const CAT_STYLES = {
  Adventure: {
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-200",
    emoji: "🏔️",
  },
  Culture: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
    emoji: "🏛️",
  },
  Food: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    emoji: "🍜",
  },
  Nature: {
    bg: "bg-green-50",
    text: "text-green-600",
    border: "border-green-200",
    emoji: "🌿",
  },
  Nightlife: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    emoji: "🌙",
  },
  Shopping: {
    bg: "bg-pink-50",
    text: "text-pink-600",
    border: "border-pink-200",
    emoji: "🛍️",
  },
  Wellness: {
    bg: "bg-teal-50",
    text: "text-teal-600",
    border: "border-teal-200",
    emoji: "🧘",
  },
  Other: {
    bg: "bg-slate-50",
    text: "text-slate-600",
    border: "border-slate-200",
    emoji: "✨",
  },
};

const PRICE_COLOR = {
  Free: "text-green-600 bg-green-50 border-green-200",
  $: "text-lime-600 bg-lime-50 border-lime-200",
  $$: "text-amber-600 bg-amber-50 border-amber-200",
  $$$: "text-orange-600 bg-orange-50 border-orange-200",
  $$$$: "text-red-600 bg-red-50 border-red-200",
};


export default function RecommendationsPanel({ tripId, refreshKey }) {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  
  useEffect(() => {
    if (!tripId) return;
    setLoading(true);
    setFilter("all"); 
    (async () => {
      try {
        const { data } = await recommendationAPI.getAll(tripId);
        setRecs(data.recommendations || []);
      } catch (err) {
        console.error("RecommendationsPanel error:", err);
        setRecs([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [tripId, refreshKey]); 

  const categories = [
    "all",
    ...new Set(recs.map((r) => r.category).filter(Boolean)),
  ];
  const filtered =
    filter === "all" ? recs : recs.filter((r) => r.category === filter);
  const avgRating = recs.filter((r) => r.rating).length
    ? (
        recs.reduce((s, r) => s + parseFloat(r.rating || 0), 0) /
        recs.filter((r) => r.rating).length
      ).toFixed(1)
    : null;

  return (
    <div>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-sm">
            <Sparkles size={14} className="text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">
              Activity Recommendations
            </h3>
            <p className="text-xs text-slate-400">
              {recs.length} suggestion{recs.length !== 1 ? "s" : ""}
              {avgRating && ` · avg ★ ${avgRating}`}
            </p>
          </div>
        </div>
      </div>

      {/* ── Loading ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="w-8 h-8 border-2 border-slate-200 border-t-purple-500 rounded-full animate-spin" />
          <p className="text-xs text-slate-400">Loading recommendations…</p>
        </div>
      ) : /* ── Empty ── */
      recs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center mb-4">
            <Sparkles size={24} className="text-purple-300" />
          </div>
          <p className="text-sm font-semibold text-slate-600 mb-1">
            No recommendations yet
          </p>
          <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
            Click "+ Add Recommendation" above to suggest activities for this
            destination.
          </p>
        </div>
      ) : (
        <>
          {/* ── Category filter pills ── */}
          {categories.length > 2 && (
            <div className="flex gap-2 flex-wrap mb-5">
              {categories.map((cat) => {
                const style = CAT_STYLES[cat];
                return (
                  <button
                    key={cat}
                    onClick={() => setFilter(cat)}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-all capitalize ${
                      filter === cat
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-sm"
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {cat === "all" ? "✨ All" : `${style?.emoji || ""} ${cat}`}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Cards grid ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filtered.map((rec) => {
              const style = CAT_STYLES[rec.category] || CAT_STYLES.Other;
              const filled = Math.round(parseFloat(rec.rating) || 0);

              return (
                <div
                  key={rec.id}
                  className="group relative bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden"
                >
                  {/* Top accent bar on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* ── Card Header ── */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div
                        className={`w-10 h-10 rounded-xl ${style.bg} border ${style.border} flex items-center justify-center text-xl flex-shrink-0`}
                      >
                        {style.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-slate-800 leading-snug truncate">
                          {rec.title}
                        </h4>
                        {rec.destination && (
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin size={9} /> {rec.destination}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Rating stars */}
                    {rec.rating && (
                      <div className="flex-shrink-0 text-right">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <span
                              key={s}
                              style={{
                                fontSize: 11,
                                color: s <= filled ? "#f59e0b" : "#e5e7eb",
                              }}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <p className="text-xs font-bold text-amber-500 mt-0.5">
                          {parseFloat(rec.rating).toFixed(1)}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* ── Description ── */}
                  {rec.description && (
                    <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-2">
                      {rec.description}
                    </p>
                  )}

                  {/* ── Footer badges ── */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {rec.category && (
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${style.bg} ${style.text} ${style.border}`}
                      >
                        <Tag size={9} /> {rec.category}
                      </span>
                    )}
                    {rec.price_range && (
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium ${PRICE_COLOR[rec.price_range] || "bg-slate-50 text-slate-500 border-slate-200"}`}
                      >
                        <DollarSign size={9} /> {rec.price_range}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Footer count ── */}
          {filtered.length !== recs.length && (
            <p className="text-center text-xs text-slate-400 mt-4">
              Showing {filtered.length} of {recs.length} recommendations
            </p>
          )}
        </>
      )}
    </div>
  );
}
