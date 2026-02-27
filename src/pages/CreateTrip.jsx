import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { tripAPI } from "../services/api";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Save,
  Loader2,
  MapPin,
  Calendar,
  DollarSign,
  FileText,
  Image as ImageIcon,
} from "lucide-react";
import { motion } from "framer-motion";

const CURRENCIES = ["USD", "EUR", "INR", "GBP", "JPY", "AUD", "CAD"];

const inputStyle =
  "w-full px-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 text-gray-800 placeholder-gray-400 shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 focus:bg-white";

const labelStyle = "block text-sm font-semibold text-gray-700 mb-2";

function InputField({ label, icon, ...props }) {
  return (
    <div>
      <label className={labelStyle}>
        <div className="flex items-center gap-2">
          {icon}
          {label}
        </div>
      </label>
      <input className={inputStyle} {...props} />
    </div>
  );
}

function TextareaField({ label, ...props }) {
  return (
    <div>
      <label className={labelStyle}>{label}</label>
      <textarea className={`${inputStyle} resize-none`} {...props} />
    </div>
  );
}

function SelectField({ label, children, ...props }) {
  return (
    <div>
      <label className={labelStyle}>{label}</label>
      <select className={`${inputStyle} bg-white`} {...props}>
        {children}
      </select>
    </div>
  );
}

const CreateTrip = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    destination_country: "",
    start_date: "",
    end_date: "",
    budget: "",
    currency: "USD",
    cover_image: "",
    status: "planning",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (new Date(formData.start_date) > new Date(formData.end_date)) {
      toast.error("End date must be after start date");
      return;
    }

    setLoading(true);

    try {
      const response = await tripAPI.create(formData);
      toast.success("Trip created successfully! 🎉");
      navigate(`/trips/${response.data.trip.id}`);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to create trip");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Back */}
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>

          {/* Title */}
          <h1 className="text-3xl font-bold text-center bg-linear-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Create New Trip
          </h1>
          <p className="text-gray-500  text-center mb-8">
            Plan your next adventure ✈️
          </p>

          {/* Form Card */}
          <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <InputField
                label="Trip Title *"
                icon={<FileText size={16} />}
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Summer Vacation in Paris"
              />

              <TextareaField
                label="Description"
                name="description"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                placeholder="Tell us about your trip..."
              />

              <InputField
                label="Destination *"
                icon={<MapPin size={16} />}
                type="text"
                name="destination_country"
                required
                value={formData.destination_country}
                onChange={handleChange}
                placeholder="France, Japan, Italy..."
              />

              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  label="Start Date *"
                  icon={<Calendar size={16} />}
                  type="date"
                  name="start_date"
                  required
                  value={formData.start_date}
                  onChange={handleChange}
                />

                <InputField
                  label="End Date *"
                  icon={<Calendar size={16} />}
                  type="date"
                  name="end_date"
                  required
                  value={formData.end_date}
                  onChange={handleChange}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <InputField
                  label="Budget"
                  // icon={<DollarSign size={16} />}
                  type="number"
                  name="budget"
                  min="0"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="5000"
                />

                <SelectField
                  label="Currency"
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </SelectField>
              </div>

              <InputField
                label="Cover Image URL"
                icon={<ImageIcon size={16} />}
                type="text"
                name="cover_image"
                value={formData.cover_image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />

              <SelectField
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="planning">Planning</option>
                <option value="upcoming">Confirmed</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </SelectField>

              {/* Buttons */}
              <div className="flex gap-4 pt-6 border-t">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-linear-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl shadow-lg hover:scale-[1.02] transition-all duration-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Create Trip
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-purple-600 transition hover:text-white"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateTrip;
