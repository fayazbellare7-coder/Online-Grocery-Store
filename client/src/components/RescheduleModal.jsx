import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api.js';
import toast from 'react-hot-toast';

export default function RescheduleModal({ isOpen, onClose, orderId, currentSlot, onSuccess }) {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [slotsByDate, setSlotsByDate] = useState({});
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSlots();
    }
  }, [isOpen]);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await api.get('/slots');
      if (res.success) {
        setSlotsByDate(res.slotsByDate || {});
        const dateKeys = Object.keys(res.slotsByDate || {});
        setDates(dateKeys);
        if (dateKeys.length > 0) {
          setSelectedDate(dateKeys[0]);
        }
      }
    } catch (err) {
      toast.error('Failed to load available slots');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentSlots = slotsByDate[selectedDate] || [];

  const handleReschedule = async () => {
    if (!selectedSlotId) {
      toast.error('Please select an available delivery slot');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.patch(`/orders/${orderId}/reschedule`, { newSlotId: selectedSlotId });
      if (res.success) {
        toast.success(res.message || 'Order rescheduled successfully!');
        onSuccess();
        onClose();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to reschedule order');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Reschedule Delivery Slot</h3>
              <p className="text-xs text-slate-500">Pick a new convenient date and time window</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Current Slot Info */}
          {currentSlot && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
              <span>Current Schedule:</span>
              <span className="font-bold text-slate-900">{currentSlot.date} ({currentSlot.window || currentSlot.startTime})</span>
            </div>
          )}

          {/* Date Selector Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select New Date
            </label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              {dates.map((dStr) => {
                const dateObj = new Date(dStr + 'T00:00:00');
                const isSelected = selectedDate === dStr;
                return (
                  <button
                    key={dStr}
                    type="button"
                    onClick={() => {
                      setSelectedDate(dStr);
                      setSelectedSlotId(null);
                    }}
                    className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-bold border text-center transition ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <p className="text-[10px] uppercase">{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                    <p className="text-sm">{dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Slots for Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Time Window
            </label>
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading delivery slots...</div>
            ) : currentSlots.length === 0 ? (
              <p className="text-xs text-slate-400">No available slots for this date.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {currentSlots.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  const isAvailable = slot.isAvailable;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => setSelectedSlotId(slot.id)}
                      className={`p-3 rounded-2xl border text-left transition flex items-center justify-between ${
                        !isAvailable
                          ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed opacity-60'
                          : isSelected
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 shadow-sm'
                          : 'border-slate-200 hover:border-emerald-500 bg-white text-slate-800'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5 font-bold text-xs">
                          <Clock className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{slot.label || slot.formattedWindow}</span>
                        </div>
                        <p className="text-[10px] text-slate-500 mt-1">
                          {slot.isFull
                            ? 'Fully Booked'
                            : slot.isPast
                            ? 'Slot Ended'
                            : `${slot.remainingCapacity} slots left`}
                        </p>
                      </div>

                      {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submitting || !selectedSlotId}
              onClick={handleReschedule}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
            >
              {submitting ? 'Updating...' : 'Confirm Reschedule'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
