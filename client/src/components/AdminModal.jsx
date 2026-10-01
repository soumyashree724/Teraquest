import React, { useState, useEffect } from 'react';
import { X, Check, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { modalVariant } from '../animations/variants';

export const AdminModal = ({
  isOpen,
  onClose,
  title,
  type = 'destination', // 'destination' | 'hotel' | 'attraction' | 'travelInfo'
  initialData = null,
  destinationsList = [],
  onSubmit,
}) => {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      // Set sane defaults based on modal type
      if (type === 'destination') {
        setFormData({
          name: '',
          country: '',
          region: '',
          continent: 'Europe',
          latitude: 48.8566,
          longitude: 2.3522,
          tagline: '',
          description: '',
          imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80',
          rating: 4.8,
        });
      } else if (type === 'hotel') {
        setFormData({
          destinationId: destinationsList[0]?.id || '',
          name: '',
          address: '',
          rating: 4.8,
          priceRange: '$$$$',
          pricePerNight: 250,
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
          amenities: 'WiFi, Breakfast, Pool, AC, Spa',
        });
      } else if (type === 'attraction') {
        setFormData({
          destinationId: destinationsList[0]?.id || '',
          name: '',
          category: 'Historic Monument',
          description: '',
          imageUrl: 'https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?auto=format&fit=crop&w=800&q=80',
          rating: 4.9,
          bestTimeOfDay: 'Morning & Afternoon',
        });
      } else if (type === 'travelInfo') {
        setFormData({
          destinationId: destinationsList[0]?.id || '',
          bestTimeToVisit: '',
          currency: '',
          language: '',
          safetyNotes: '',
          localTips: '',
          timeZone: 'UTC+0',
          emergencyContact: '112 / 911',
        });
      }
    }
    setError('');
  }, [isOpen, initialData, type, destinationsList]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type: inputType } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: inputType === 'number' ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Operation failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          variants={modalVariant}
          initial="initial"
          animate="animate"
          exit="exit"
          className="bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-xl font-bold font-display text-white">{title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">Admin Management Form</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4 max-h-[65vh] overflow-y-auto pr-1">
            
            {/* DESTINATION FORM */}
            {type === 'destination' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Destination Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name || ''}
                      onChange={handleChange}
                      placeholder="e.g. Kyoto"
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Country *</label>
                    <input
                      type="text"
                      name="country"
                      required
                      value={formData.country || ''}
                      onChange={handleChange}
                      placeholder="e.g. Japan"
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Region / Province *</label>
                    <input
                      type="text"
                      name="region"
                      required
                      value={formData.region || ''}
                      onChange={handleChange}
                      placeholder="e.g. Kansai"
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Continent *</label>
                    <select
                      name="continent"
                      value={formData.continent || 'Europe'}
                      onChange={handleChange}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm bg-slate-900"
                    >
                      <option value="Europe">Europe</option>
                      <option value="Asia">Asia</option>
                      <option value="Americas">Americas</option>
                      <option value="Africa">Africa</option>
                      <option value="Oceania">Oceania</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Latitude *</label>
                    <input
                      type="number"
                      step="any"
                      name="latitude"
                      required
                      value={formData.latitude ?? ''}
                      onChange={handleChange}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Longitude *</label>
                    <input
                      type="number"
                      step="any"
                      name="longitude"
                      required
                      value={formData.longitude ?? ''}
                      onChange={handleChange}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Rating (1-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      name="rating"
                      value={formData.rating ?? 4.8}
                      onChange={handleChange}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tagline</label>
                  <input
                    type="text"
                    name="tagline"
                    value={formData.tagline || ''}
                    onChange={handleChange}
                    placeholder="Short catchy phrase"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL *</label>
                  <input
                    type="url"
                    name="imageUrl"
                    required
                    value={formData.imageUrl || ''}
                    onChange={handleChange}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description *</label>
                  <textarea
                    name="description"
                    rows={3}
                    required
                    value={formData.description || ''}
                    onChange={handleChange}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </>
            )}

            {/* HOTEL FORM */}
            {type === 'hotel' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Destination *</label>
                  <select
                    name="destinationId"
                    value={formData.destinationId || ''}
                    onChange={handleChange}
                    required
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm bg-slate-900"
                  >
                    {destinationsList.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}, {d.country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Hotel Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name || ''}
                      onChange={handleChange}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Price / Night ($ USD) *</label>
                    <input
                      type="number"
                      name="pricePerNight"
                      required
                      min="1"
                      value={formData.pricePerNight || 150}
                      onChange={handleChange}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Price Range Symbol</label>
                    <select
                      name="priceRange"
                      value={formData.priceRange || '$$$'}
                      onChange={handleChange}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm bg-slate-900"
                    >
                      <option value="$">$ (Budget)</option>
                      <option value="$$">$$ (Moderate)</option>
                      <option value="$$$">$$$ (Upscale)</option>
                      <option value="$$$$">$$$$ (Luxury)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Rating (1-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="rating"
                      value={formData.rating || 4.5}
                      onChange={handleChange}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address || ''}
                    onChange={handleChange}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Amenities (Comma separated)</label>
                  <input
                    type="text"
                    name="amenities"
                    value={formData.amenities || ''}
                    onChange={handleChange}
                    placeholder="WiFi, Breakfast, Pool, AC, Spa"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL *</label>
                  <input
                    type="url"
                    name="imageUrl"
                    required
                    value={formData.imageUrl || ''}
                    onChange={handleChange}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </>
            )}

            {/* ATTRACTION FORM */}
            {type === 'attraction' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Destination *</label>
                  <select
                    name="destinationId"
                    value={formData.destinationId || ''}
                    onChange={handleChange}
                    required
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm bg-slate-900"
                  >
                    {destinationsList.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}, {d.country}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Attraction Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name || ''}
                      onChange={handleChange}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
                    <input
                      type="text"
                      name="category"
                      required
                      value={formData.category || ''}
                      onChange={handleChange}
                      placeholder="e.g. Historic Monument, Scenic Viewpoint"
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Rating (1-5)</label>
                    <input
                      type="number"
                      step="0.1"
                      name="rating"
                      value={formData.rating || 4.8}
                      onChange={handleChange}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Best Time of Day</label>
                    <input
                      type="text"
                      name="bestTimeOfDay"
                      value={formData.bestTimeOfDay || 'Morning & Afternoon'}
                      onChange={handleChange}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Image URL *</label>
                  <input
                    type="url"
                    name="imageUrl"
                    required
                    value={formData.imageUrl || ''}
                    onChange={handleChange}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Description *</label>
                  <textarea
                    name="description"
                    rows={3}
                    required
                    value={formData.description || ''}
                    onChange={handleChange}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>
              </>
            )}

            {/* TRAVEL INFO FORM */}
            {type === 'travelInfo' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Best Time to Visit *</label>
                  <input
                    type="text"
                    name="bestTimeToVisit"
                    required
                    value={formData.bestTimeToVisit || ''}
                    onChange={handleChange}
                    placeholder="e.g. May to September"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Currency *</label>
                    <input
                      type="text"
                      name="currency"
                      required
                      value={formData.currency || ''}
                      onChange={handleChange}
                      placeholder="e.g. Euro (EUR / €)"
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Spoken Language *</label>
                    <input
                      type="text"
                      name="language"
                      required
                      value={formData.language || ''}
                      onChange={handleChange}
                      placeholder="e.g. French, English"
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Safety Advisory *</label>
                  <textarea
                    name="safetyNotes"
                    rows={2}
                    required
                    value={formData.safetyNotes || ''}
                    onChange={handleChange}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Insider Local Tips *</label>
                  <textarea
                    name="localTips"
                    rows={2}
                    required
                    value={formData.localTips || ''}
                    onChange={handleChange}
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Time Zone</label>
                    <input
                      type="text"
                      name="timeZone"
                      value={formData.timeZone || 'UTC+0'}
                      onChange={handleChange}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Emergency Numbers</label>
                    <input
                      type="text"
                      name="emergencyContact"
                      value={formData.emergencyContact || '112 / 911'}
                      onChange={handleChange}
                      className="w-full glass-input px-3.5 py-2.5 rounded-xl text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 text-xs font-medium"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-glow transition-all"
              >
                <Check className="w-4 h-4" />
                <span>{submitting ? 'Saving...' : 'Save Record'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
