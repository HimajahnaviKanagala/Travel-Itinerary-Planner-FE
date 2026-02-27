import React, { useState } from "react";
import { reviewAPI } from "../../services/api.js";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { X, Save, Loader2, Star } from "lucide-react";
import { motion } from "framer-motion";

const AddReviewModal = ({ tripId, editingReview, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(editingReview?.rating || 0);
  const [reviewText, setReviewText] = useState(
    editingReview?.review_text || "",
  );
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setLoading(true);

    try {
      if (editingReview) {
        const { error } = await supabase
          .from("reviews")
          .update({
            rating,
            review_text: reviewText,
          })
          .eq("id", editingReview.id);

        if (error) throw error;
        toast.success("Review updated!");
      } else {
        const { error } = await supabase.from("reviews").insert([
          {
            trip_id: tripId,
            user_id: user.id,
            rating,
            review_text: reviewText,
            is_approved: true,
          },
        ]);

        if (error) throw error;
        toast.success("Review added!");
      }
      onClose();
    } catch (error) {
      toast.error("Failed to save review");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
              <Star className="w-5 h-5 text-primary-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              {editingReview ? "Edit Review" : "Write a Review"}
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
          <div className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Your Rating *
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-10 h-10 transition-colors ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-3 text-lg font-semibold text-gray-900">
                    {rating === 1 && "😞 Poor"}
                    {rating === 2 && "😕 Fair"}
                    {rating === 3 && "😊 Good"}
                    {rating === 4 && "😄 Very Good"}
                    {rating === 5 && "🤩 Excellent"}
                  </span>
                )}
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your Review (Optional)
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={6}
                placeholder="Share your experience... What did you enjoy? What could be improved?"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                {reviewText.length} characters
              </p>
            </div>

            {/* Info */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
              <p className="text-sm text-green-900">
                ✨ <span className="font-medium">Your feedback matters!</span>{" "}
                Help other travelers by sharing your honest experience.
              </p>
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
            disabled={loading || rating === 0}
            className="flex-1 flex items-center justify-center space-x-2 py-3 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>{editingReview ? "Update" : "Submit"} Review</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AddReviewModal;
