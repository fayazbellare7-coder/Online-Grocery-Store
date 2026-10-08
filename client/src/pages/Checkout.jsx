import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Plus, 
  Calendar, 
  Clock, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Lock
} from 'lucide-react';
import { getAddresses, getDeliverySlots, createOrder } from '../services/dataService.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import AddressModal from '../components/AddressModal.jsx';
import PaymentModal from '../components/PaymentModal.jsx';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { isAuthenticated, user } = useAuth();
  const { items, summary, clearCart, refreshCart } = useCart();
  const navigate = useNavigate();

  // Address state
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  // Delivery Slot state
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [slotsByDate, setSlotsByDate] = useState({});
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'online'
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
      return;
    }

    if (items.length === 0 && !loading) {
      navigate('/cart');
      return;
    }

    loadCheckoutData();
  }, [isAuthenticated, items.length]);

  const loadCheckoutData = async () => {
    try {
      setLoading(true);
      const [addrs, slots] = await Promise.all([
        getAddresses(user?.id),
        getDeliverySlots(),
      ]);

      if (addrs) {
        setAddresses(addrs);
        const defaultAddr = addrs.find((a) => a.is_default === 1 || a.is_default === true) || addrs[0];
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr.id);
        }
      }

      if (slots) {
        const grouped = {};
        slots.forEach((s) => {
          const d = s.date;
          if (!grouped[d]) grouped[d] = [];
          grouped[d].push({
            ...s,
            isAvailable: (s.booked || 0) < (s.capacity || 10),
            remaining: Math.max(0, (s.capacity || 10) - (s.booked || 0))
          });
        });

        setSlotsByDate(grouped);
        const dateKeys = Object.keys(grouped);
        setDates(dateKeys);
        if (dateKeys.length > 0) {
          setSelectedDate(dateKeys[0]);
          const firstAvail = grouped[dateKeys[0]]?.find((s) => s.isAvailable);
          if (firstAvail) {
            setSelectedSlotId(firstAvail.id);
          }
        }
      }
    } catch (err) {
      toast.error('Failed to load checkout details');
    } finally {
      setLoading(false);
    }
  };

  const handleDateSelect = (dStr) => {
    setSelectedDate(dStr);
    const dateSlots = slotsByDate[dStr] || [];
    const firstAvail = dateSlots.find((s) => s.isAvailable);
    setSelectedSlotId(firstAvail ? firstAvail.id : null);
  };

  const handlePlaceOrder = async (onlinePaymentSuccess = true) => {
    if (!selectedAddressId) {
      toast.error('Please select or add a delivery address');
      return;
    }

    if (!selectedSlotId) {
      toast.error('Please select an available delivery time slot');
      return;
    }

    try {
      setSubmitting(true);
      const selectedAddress = addresses.find(a => String(a.id) === String(selectedAddressId));
      const allSlots = Object.values(slotsByDate).flat();
      const selectedSlot = allSlots.find(s => String(s.id) === String(selectedSlotId));

      const newOrder = await createOrder({
        user_id: user?.id,
        customer_name: user?.name,
        customer_email: user?.email,
        address_snapshot: selectedAddress || { line1: 'Springfield' },
        slot_id: selectedSlotId,
        slot_snapshot: selectedSlot ? { date: selectedSlot.date, window: `${selectedSlot.start_time} - ${selectedSlot.end_time}` } : { window: 'Morning' },
        payment_method: paymentMethod,
        items: items.map(i => ({
          id: i.productId || i.id,
          name: i.name,
          price: i.unitPrice || i.price,
          unit: i.unit,
          image_url: i.imageUrl || i.image_url,
          quantity: i.quantity
        })),
        subtotal: summary.subtotal,
        delivery_fee: summary.deliveryFee,
        tax: summary.tax,
        total: summary.total
      });

      await clearCart();
      navigate(`/order-success/${newOrder.id}`, { state: { order: newOrder } });
    } catch (err) {
      toast.error(err.message || 'Failed to place order');
    } finally {
      setSubmitting(false);
      setIsPaymentModalOpen(false);
    }
  };

  const handleCheckoutSubmit = () => {
    if (!selectedAddressId) {
      toast.error('Please select or add a delivery address');
      return;
    }
    if (!selectedSlotId) {
      toast.error('Please select an available delivery slot');
      return;
    }

    if (paymentMethod === 'online') {
      setIsPaymentModalOpen(true);
    } else {
      handlePlaceOrder(true);
    }
  };

  const currentSlots = slotsByDate[selectedDate] || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Checkout & Delivery
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Confirm your delivery address, select a scheduled slot, and choose payment
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Steps Flow */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Delivery Address */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                  1
                </span>
                <h3 className="font-bold text-base text-slate-900">Delivery Address</h3>
              </div>

              <button
                type="button"
                onClick={() => setIsAddressModalOpen(true)}
                className="text-xs font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-xl transition flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="text-center py-6 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <MapPin className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-600 font-bold">No saved addresses found</p>
                <button
                  onClick={() => setIsAddressModalOpen(true)}
                  className="mt-2 bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-xl"
                >
                  + Add Delivery Address
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-2xl border cursor-pointer transition flex flex-col justify-between ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-sm'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="bg-slate-100 text-slate-800 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md">
                            {addr.label}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        </div>
                        <p className="font-bold text-xs text-slate-900">{addr.line1}</p>
                        {addr.line2 && <p className="text-xs text-slate-500">{addr.line2}</p>}
                        <p className="text-xs text-slate-600 mt-1">
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 2: Delivery Slot (Date + Time Window) */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                2
              </span>
              <div>
                <h3 className="font-bold text-base text-slate-900">Choose Delivery Slot</h3>
                <p className="text-xs text-slate-400">Guaranteed 2-hour delivery window</p>
              </div>
            </div>

            {/* Date Picker Horizontal Bar */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                1. Select Delivery Date
              </label>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {dates.map((dStr) => {
                  const dateObj = new Date(dStr + 'T00:00:00');
                  const isSelected = selectedDate === dStr;
                  const isToday = dStr === new Date().toISOString().split('T')[0];

                  return (
                    <button
                      key={dStr}
                      type="button"
                      onClick={() => handleDateSelect(dStr)}
                      className={`flex-shrink-0 px-4 py-2.5 rounded-2xl text-xs font-bold border text-center transition ${
                        isSelected
                          ? 'border-emerald-600 bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
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
            </div>

            {/* Time Slot Windows Grid */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                2. Select 2-Hour Time Window
              </label>

              {currentSlots.length === 0 ? (
                <p className="text-xs text-slate-400">No delivery slots configured for this date.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentSlots.map((slot) => {
                    const isSelected = selectedSlotId === slot.id;
                    const isAvailable = slot.isAvailable;

                    return (
                      <div
                        key={slot.id}
                        onClick={() => isAvailable && setSelectedSlotId(slot.id)}
                        className={`p-3.5 rounded-2xl border transition flex items-center justify-between ${
                          !isAvailable
                            ? 'border-slate-100 bg-slate-50 text-slate-400 cursor-not-allowed opacity-60'
                            : isSelected
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-500/20 shadow-sm cursor-pointer'
                            : 'border-slate-200 hover:border-emerald-500 bg-white text-slate-800 cursor-pointer'
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
                              ? 'Time Passed'
                              : `${slot.remainingCapacity} slots open`}
                          </p>
                        </div>

                        {isSelected && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <span className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                3
              </span>
              <div>
                <h3 className="font-bold text-base text-slate-900">Payment Option</h3>
                <p className="text-xs text-slate-400">Choose how you'd like to pay</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('cod')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-start justify-between ${
                  paymentMethod === 'cod'
                    ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center flex-shrink-0">
                    <Banknote className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Cash on Delivery (COD)</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Pay cash or UPI directly to delivery agent at your door.
                    </p>
                  </div>
                </div>
                {paymentMethod === 'cod' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>

              {/* Online Payment */}
              <div
                onClick={() => setPaymentMethod('online')}
                className={`p-4 rounded-2xl border cursor-pointer transition flex items-start justify-between ${
                  paymentMethod === 'online'
                    ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500/20 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">Instant Online Payment</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Prepay via Cards, Apple Pay, Google Pay, UPI or NetBanking.
                    </p>
                  </div>
                </div>
                {paymentMethod === 'online' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              </div>
            </div>
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Order Summary</h3>

            {/* Items scroll */}
            <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 pr-1 text-xs">
              {items.map((item) => (
                <div key={item.id} className="py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-bold text-slate-500">{item.quantity}x</span>
                    <span className="text-slate-800 font-medium truncate">{item.name}</span>
                  </div>
                  <span className="font-bold text-slate-900 flex-shrink-0">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">${summary.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Scheduled Delivery Fee</span>
                {summary.deliveryFee === 0 ? (
                  <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">FREE</span>
                ) : (
                  <span className="font-bold text-slate-900">${summary.deliveryFee.toFixed(2)}</span>
                )}
              </div>
              <div className="flex justify-between">
                <span>Estimated Tax (5%)</span>
                <span className="font-bold text-slate-900">${summary.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-slate-200 text-base font-black text-slate-900">
                <span>Total Amount</span>
                <span className="text-emerald-700">${summary.total.toFixed(2)}</span>
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              disabled={submitting || !selectedAddressId || !selectedSlotId}
              onClick={handleCheckoutSubmit}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Placing Order...
                </>
              ) : paymentMethod === 'online' ? (
                <>
                  <Lock className="w-4 h-4" /> Pay & Place Order (${summary.total.toFixed(2)})
                </>
              ) : (
                <>
                  Place Order with COD <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Contactless Delivery Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Address Modal */}
      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSuccess={(newAddr) => {
          setAddresses((prev) => [newAddr, ...prev]);
          setSelectedAddressId(newAddr.id);
        }}
      />

      {/* Mock Payment Gateway Simulator Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        amount={summary.total}
        onConfirmPayment={(success) => handlePlaceOrder(success)}
      />
    </div>
  );
}
