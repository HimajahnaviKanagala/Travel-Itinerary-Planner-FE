import React, { useState, useEffect } from "react";
import { Trash2, ShieldCheck } from "lucide-react"; 
import { reviewAPI } from "../../services/api.js";
import Modal from "../Modal.jsx";
import { useToast } from "../ToastProvider.jsx";

const CATS = [
  "Attraction",
  "Restaurant",
  "Hotel",
  "Transport",
  "Experience",
  "Other",
];

const Stars = ({ rating, size = 16, interactive, onRate }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((s) => (
      <span
        key={s}
        onClick={() => interactive && onRate(s)}
        className={`${interactive ? "cursor-pointer hover:scale-125" : ""} transition-transform`}
        style={{ fontSize: size, color: s <= rating ? "#f59e0b" : "#e5e7eb" }}
      >
        ★
      </span>
    ))}
  </div>
);


export default function ReviewsTab({ tripId, canModerate = false }) {
  const toast = useToast();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    place_name: "",
    category: "Attraction",
    rating: 5,
    review_text: "",
    visited_date: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await reviewAPI.getAll(tripId);
        setReviews(data.reviews || []);
      } catch {
        toast("Failed to load reviews", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [tripId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await reviewAPI.add(tripId, form);
      setReviews((r) => [data.review, ...r]);
      toast("Review published! ⭐");
      setShowModal(false);
      setForm({
        place_name: "",
        category: "Attraction",
        rating: 5,
        review_text: "",
        visited_date: "",
      });
    } catch {
      toast("Failed to publish", "error");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    try {
      await reviewAPI.delete(id);
      setReviews((r) => r.filter((x) => x.id !== id));
      toast("Removed", "info");
    } catch {
      toast("Failed to delete", "error");
    }
  };

  // ── ADD: approve handler (calls your backend when you build that endpoint) ──
  const approve = async (id) => {
    try {
      // await reviewAPI.approve(id); ← uncomment when backend is ready
      setReviews((r) =>
        r.map((x) => (x.id === id ? { ...x, approved: true } : x)),
      );
      toast("Review approved! ✓", "success");
    } catch {
      toast("Failed to approve", "error");
    }
  };

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading)
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-2 border-surface-200 border-t-primary-500 rounded-full animate-spin" />
      </div>
    );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── ADD: Moderator banner — only visible to ADMIN/TRAVEL_AGENT ── */}
      {canModerate && (
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-purple-50 border border-purple-200">
          <ShieldCheck size={16} className="text-purple-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-purple-700">Moderator View</p>
            <p className="text-xs text-purple-500 mt-0.5">
              You can approve or delete any review on this trip.
            </p>
          </div>
        </div>
      )}

      {/* Review Summary — unchanged */}
      {reviews.length > 0 && (
        <div className="bg-white border border-surface-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex gap-10 items-center">
          <div className="text-center min-w-[100px]">
            <div className="text-5xl font-bold text-dark-900">{avg}</div>
            <Stars rating={Math.round(avg)} size={20} />
            <div className="text-xs text-surface-400 mt-1">
              {reviews.length} review{reviews.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((n) => {
              const cnt = reviews.filter((r) => r.rating === n).length;
              const pct = reviews.length ? (cnt / reviews.length) * 100 : 0;
              return (
                <div key={n} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-surface-400">{n}</span>
                  <span className="text-amber-500 text-[10px]">★</span>
                  <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-4 text-right text-surface-400">{cnt}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CTA — unchanged */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          ✍️ Write Review
        </button>
      </div>

      {/* Empty State — unchanged */}
      {reviews.length === 0 ? (
        <div className="bg-white border border-surface-200 rounded-2xl p-16 text-center shadow-sm">
          <div className="text-6xl mb-4">⭐</div>
          <p className="font-semibold text-dark-900 mb-1">No reviews yet</p>
          <p className="text-surface-400 text-sm">
            Share your experience from this trip
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="group bg-white border border-surface-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="flex justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-dark-900">
                    {rev.place_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-surface-100 text-surface-500 border border-surface-200">
                      {rev.category}
                    </span>

                    {/* ── ADD: Approved badge ── */}
                    {rev.approved && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-200 flex items-center gap-1">
                        <ShieldCheck size={10} /> Approved
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <Stars rating={rev.rating} size={16} />
                  {rev.visited_date && (
                    <p className="text-xs text-surface-400 mt-1">
                      {rev.visited_date}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-sm text-surface-600 leading-relaxed">
                {rev.review_text}
              </p>

              {/* ── MODIFIED: action row — delete always, approve only for moderators ── */}
              <div className="flex items-center justify-between mt-4">
                <button
                  onClick={() => remove(rev.id)}
                  className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-xs text-red-400 hover:text-red-500 transition-all"
                >
                  <Trash2 size={12} /> Delete
                </button>

                {/* ── ADD: Approve button — only for ADMIN/TRAVEL_AGENT ── */}
                {canModerate && !rev.approved && (
                  <button
                    onClick={() => approve(rev.id)}
                    className="opacity-0 group-hover:opacity-100 flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-green-50 text-green-600 border border-green-200 hover:bg-green-100 transition-all"
                  >
                    <ShieldCheck size={11} /> Approve
                  </button>
                )}

                {/* ── ADD: Already approved label for moderators ── */}
                {canModerate && rev.approved && (
                  <span className="text-xs text-green-500 flex items-center gap-1">
                    <ShieldCheck size={11} /> Approved
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal — unchanged */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Write a Review"
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label">Place Name *</label>
            <input
              required
              value={form.place_name}
              onChange={(e) =>
                setForm((f) => ({ ...f, place_name: e.target.value }))
              }
              placeholder="Where did you go?"
              className="w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm focus:border-primary-400 focus:ring-1 focus:ring-primary-200 outline-none transition-all"
            />
          </div>

          <div>
            <label className="label">Category</label>
            <div className="grid grid-cols-3 gap-3">
              {CATS.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, category: cat }))}
                  className={`py-2.5 px-3 rounded-xl text-xs font-medium border transition-all ${
                    form.category === cat
                      ? "border-primary-400 bg-primary-50 text-primary-700 shadow-sm"
                      : "border-surface-200 text-surface-500 hover:border-primary-300 hover:bg-primary-50/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="label">Rating</label>
            <div className="flex items-center gap-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <span
                  key={s}
                  onClick={() => setForm((f) => ({ ...f, rating: s }))}
                  className="cursor-pointer text-4xl hover:scale-125 transition-transform"
                  style={{ color: s <= form.rating ? "#f59e0b" : "#e5e7eb" }}
                >
                  ★
                </span>
              ))}
              <span className="text-amber-500 font-semibold text-lg">
                {form.rating}/5
              </span>
            </div>
          </div>

          <div>
            <label className="label">Visited Date</label>
            <input
              type="date"
              value={form.visited_date}
              onChange={(e) =>
                setForm((f) => ({ ...f, visited_date: e.target.value }))
              }
              className="w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm focus:border-primary-400 focus:ring-1 focus:ring-primary-200 outline-none transition-all"
            />
          </div>

          <div>
            <label className="label">Your Review</label>
            <textarea
              rows={4}
              value={form.review_text}
              onChange={(e) =>
                setForm((f) => ({ ...f, review_text: e.target.value }))
              }
              placeholder="Share your experience…"
              className="w-full rounded-xl border border-surface-200 px-4 py-2.5 text-sm resize-none focus:border-primary-400 focus:ring-1 focus:ring-primary-200 outline-none transition-all"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-xl py-2.5 text-sm font-medium shadow-sm hover:shadow-md transition-all"
            >
              {saving ? "Publishing…" : "⭐ Publish Review"}
            </button>
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="flex-1 border border-surface-200 rounded-xl py-2.5 text-sm font-medium hover:bg-surface-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
