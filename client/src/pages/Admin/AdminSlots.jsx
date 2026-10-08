import React, { useState, useEffect } from 'react';
import { Clock, Calendar, CheckCircle2, AlertCircle, Edit2, X, Plus } from 'lucide-react';
import api from '../../services/api.js';
import toast from 'react-hot-toast';

export default function AdminSlots() {
  const [slotsByDate, setSlotsByDate] = useState({});
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true);

  // Edit Capacity Modal
  const [editingSlot, setEditingSlot] = useState(null);
  const [newCapacity, setNewCapacity] = useState(10);
  const [submitting, setSubmitting] = useState(false);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await api.get('/slots');
      if (res.success) {
        setSlotsByDate(res.slotsByDate || {});
        const dateKeys = Object.keys(res.slotsByDate || {});
        setDates(dateKeys);
        if (dateKeys.length > 0 && !selectedDate) {
          setSelectedDate(dateKeys[0]);
        }
      }
    } catch (e) {
      toast.error('Failed to load slots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleUpdateCapacity = async (e) => {
    e.preventDefault();
    if (!editingSlot) return;

    try {
      setSubmitting(true);
      const res = await api.patch(`/slots/${editingSlot.id}/capacity`, {
        capacity: parseInt(newCapacity, 10)
      });
      if (res.success) {
        toast.success('Slot capacity updated successfully!');
        setEditingSlot(null);
        fetchSlots();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update capacity');
    } finally {
      setSubmitting(false);
    }
  };

  const currentSlots = slotsByDate[selectedDate] || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Delivery Slot Capacity & Schedule
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure vehicle dispatch capacities and monitor customer booking load
        </p>
      </div>

      {/* Date Selector Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {dates.map((dStr) => {
          const dateObj = new Date(dStr + 'T00:00:00');
          const isSelected = selectedDate === dStr;
          const isToday = dStr === new Date().toISOString().split('T')[0];

          return (
            <button
              key={dStr}
              type="button"
              onClick={() => setSelectedDate(dStr)}
              className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold border text-center transition ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
              }`}
            >
              <p className="text-[10px] uppercase opacity-90">
                {isToday ? 'Today' : dateObj.toLocaleDateString('en-US', { weekday: 'short' })}
              </p>
              <p className="text-sm font-black">
                {dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </p>
            </button>
          );
        })}
      </div>

      {/* Slots Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {currentSlots.map((slot) => {
          const percentBooked = Math.min(100, Math.round((slot.booked / slot.capacity) * 100));

          return (
            <div
              key={slot.id}
              className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-bold text-sm text-slate-900">{slot.label || slot.formattedWindow}</h3>
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                    slot.isFull 
                      ? 'bg-rose-50 text-rose-700 border border-rose-200' 
                      : slot.isPast 
                      ? 'bg-slate-100 text-slate-500' 
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {slot.isFull ? 'Full' : slot.isPast ? 'Passed' : 'Available'}
                  </span>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-xs text-slate-600 mb-1 font-semibold">
                    <span>Booked: {slot.booked} / {slot.capacity} orders</span>
                    <span>{percentBooked}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        percentBooked >= 90 ? 'bg-rose-500' : percentBooked >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${percentBooked}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-medium">Slot ID: #{slot.id}</span>
                <button
                  onClick={() => {
                    setEditingSlot(slot);
                    setNewCapacity(slot.capacity);
                  }}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-3 py-1.5 rounded-xl transition flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" /> Adjust Capacity
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Adjust Capacity Modal */}
      {editingSlot && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900">Adjust Slot Capacity</h3>
              <button onClick={() => setEditingSlot(null)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleUpdateCapacity} className="p-6 space-y-4 text-xs">
              <div>
                <p className="font-bold text-slate-900 mb-1">{editingSlot.label}</p>
                <p className="text-slate-500 mb-3">Date: {editingSlot.date}</p>
                <label className="block font-bold text-slate-700 mb-1">Max Order Capacity</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  required
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-sm font-bold focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">Currently booked: {editingSlot.booked} orders</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSlot(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2 rounded-xl"
                >
                  {submitting ? 'Updating...' : 'Save Capacity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
