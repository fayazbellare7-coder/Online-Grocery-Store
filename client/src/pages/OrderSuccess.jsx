import React, { useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, Package, ArrowRight, ShoppingBag, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderSuccess() {
  const { id } = useParams();
  const location = useLocation();
  const order = location.state?.order;

  useEffect(() => {
    // Fire confetti celebration on load
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-lg text-center space-y-8">
        {/* Celebration Icon */}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 ring-8 ring-emerald-50 shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
            Order Confirmed
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Thank You for Your Order!
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Order <strong className="text-slate-800">#{id}</strong> has been received and sent to our Springfield warehouse team.
          </p>
        </div>

        {/* Delivery Details Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-left grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold uppercase tracking-wider text-[11px]">
              <Clock className="w-4 h-4" /> Scheduled Delivery Slot
            </div>
            <p className="font-extrabold text-slate-900 text-sm">
              {order?.slotSnapshot?.date || 'Today / Tomorrow'}
            </p>
            <p className="text-slate-500">
              {order?.slotSnapshot?.window || 'Standard 2-Hour Slot'}
            </p>
          </div>

          <div className="space-y-1.5 border-t sm:border-t-0 sm:border-l border-slate-200 pt-3 sm:pt-0 sm:pl-4">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold uppercase tracking-wider text-[11px]">
              <MapPin className="w-4 h-4" /> Delivering To
            </div>
            <p className="font-extrabold text-slate-900 text-sm">
              {order?.addressSnapshot?.label || 'Home'}: {order?.addressSnapshot?.line1}
            </p>
            <p className="text-slate-500">
              {order?.addressSnapshot?.city}, {order?.addressSnapshot?.state} {order?.addressSnapshot?.pincode}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to={`/orders/${id}`}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" /> Track Live Order Status
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-auto bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm px-6 py-3.5 rounded-2xl transition flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
