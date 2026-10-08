import React, { useState, useEffect } from 'react';
import { X, MapPin, Building, Home, Briefcase, Check } from 'lucide-react';
import api from '../services/api.js';
import toast from 'react-hot-toast';

export default function AddressModal({ isOpen, onClose, onSuccess, initialAddress = null }) {
  const [formData, setFormData] = useState({
    label: 'Home',
    line1: '',
    line2: '',
    city: 'Springfield',
    state: 'OR',
    pincode: '97477',
    is_default: false,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialAddress) {
      setFormData({
        label: initialAddress.label || 'Home',
        line1: initialAddress.line1 || '',
        line2: initialAddress.line2 || '',
        city: initialAddress.city || 'Springfield',
        state: initialAddress.state || 'OR',
        pincode: initialAddress.pincode || '97477',
        is_default: !!initialAddress.is_default,
      });
    } else {
      setFormData({
        label: 'Home',
        line1: '',
        line2: '',
        city: 'Springfield',
        state: 'OR',
        pincode: '97477',
        is_default: false,
      });
    }
  }, [initialAddress, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.line1.trim() || !formData.city.trim() || !formData.pincode.trim()) {
      toast.error('Please fill all required address fields');
      return;
    }

    try {
      setLoading(true);
      if (initialAddress) {
        const res = await api.put(`/addresses/${initialAddress.id}`, formData);
        if (res.success) {
          toast.success('Address updated successfully!');
          onSuccess(res.address);
          onClose();
        }
      } else {
        const res = await api.post('/addresses', formData);
        if (res.success) {
          toast.success('Address saved successfully!');
          onSuccess(res.address);
          onClose();
        }
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save address');
    } finally {
      setLoading(false);
    }
  };

  const labels = [
    { name: 'Home', icon: Home },
    { name: 'Work', icon: Briefcase },
    { name: 'Other', icon: Building },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {initialAddress ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>
              <p className="text-xs text-slate-500">Provide accurate details for door delivery</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Label selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Address Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              {labels.map((item) => {
                const Icon = item.icon;
                const isSelected = formData.label === item.name;
                return (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, label: item.name })}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-xs font-bold transition ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-800'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Line 1 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Street Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.line1}
              onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
              placeholder="e.g. 742 Evergreen Terrace"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Line 2 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Apartment, Suite, Unit, Landmark (Optional)
            </label>
            <input
              type="text"
              value={formData.line2}
              onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
              placeholder="e.g. Apt 4B, Near Central Park"
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* City, State, ZIP */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                State <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ZIP Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          {/* Default address checkbox */}
          <div className="pt-2">
            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-medium text-slate-700">
              <input
                type="checkbox"
                checked={formData.is_default}
                onChange={(e) => setFormData({ ...formData, is_default: e.target.checked })}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
              />
              <span>Set as default delivery address for future orders</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : initialAddress ? 'Update Address' : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
