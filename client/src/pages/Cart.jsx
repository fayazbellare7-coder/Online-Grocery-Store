import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Tag,
  ArrowLeft
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import EmptyState from '../components/EmptyState.jsx';
import toast from 'react-hot-toast';

export default function Cart() {
  const { items, summary, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  const progressPercent = Math.min(100, Math.round((summary.subtotal / summary.freeDeliveryThreshold) * 100));

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'FRESH20') {
      setPromoApplied(true);
      toast.success('Promo code FRESH20 applied! Free delivery & bonus perks unlocked!', { icon: '🎉' });
    } else {
      toast.error('Invalid promo code. Try using FRESH20');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your Shopping Basket is Empty"
          description="Looks like you haven't added any fresh vegetables, fruits, or daily groceries to your basket yet."
          actionText="Start Shopping Groceries"
          actionLink="/products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Review Your Basket
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {summary.itemCount} items selected for scheduled home delivery
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-bold text-slate-400 hover:text-rose-600 transition flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear All Items
        </button>
      </div>

      {/* Free Delivery Banner */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
        {summary.isFreeDelivery ? (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-emerald-900 font-bold">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <span>🎉 Congratulations! You qualify for <strong>FREE Scheduled Delivery</strong>.</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm font-semibold text-emerald-950">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Add <strong>${summary.amountNeededForFreeDelivery.toFixed(2)}</strong> more to get FREE Delivery
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full bg-emerald-200/80 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Cart Grid: Items Table on Left + Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Items List */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm divide-y divide-slate-100">
          {items.map((item) => (
            <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src={item.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80'}
                  alt={item.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-2xl border border-slate-100 flex-shrink-0"
                />

                <div className="space-y-1">
                  <Link
                    to={`/products/${item.productId}`}
                    className="font-bold text-sm text-slate-900 hover:text-emerald-600 transition line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-xs text-slate-400 font-medium">{item.unit}</p>

                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-black text-slate-900">
                      ${Number(item.unitPrice).toFixed(2)}
                    </span>
                    {item.discountPercent > 0 && (
                      <span className="text-xs text-slate-400 line-through">
                        ${Number(item.originalPrice).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Stepper and Total */}
              <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                {/* Stepper */}
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs font-bold">
                  <button
                    onClick={() => updateQuantity(item.id, item.productId, item.quantity - 1)}
                    className="p-2 hover:bg-slate-200 text-slate-700 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 font-black text-slate-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.productId, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className={`p-2 text-slate-700 transition ${
                      item.quantity >= item.stock ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-200'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Total */}
                <div className="text-right min-w-[70px]">
                  <span className="text-base font-black text-slate-900 block">
                    ${(Number(item.unitPrice) * item.quantity).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.id, item.productId)}
                    className="text-[11px] text-slate-400 hover:text-rose-500 transition font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 mt-4 border-t border-slate-100">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 hover:text-emerald-700"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right: Bill Breakdown & Checkout CTA */}
        <div className="lg:col-span-4 space-y-4">
          {/* Promo Code Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-3">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Apply Promo Code
            </label>
            <form onSubmit={handleApplyPromo} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="e.g. FRESH20"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono font-bold uppercase focus:outline-none focus:border-emerald-500"
                />
                <Tag className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5" />
              </div>
              <button
                type="submit"
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition"
              >
                Apply
              </button>
            </form>
            {promoApplied && (
              <p className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> FRESH20 promo applied!
              </p>
            )}
          </div>

          {/* Bill Summary */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-slate-900">Bill Summary</h3>

            {/* Savings callout */}
            {summary.savings > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-center justify-between text-xs text-amber-900 font-bold">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" /> You save today:
                </span>
                <span className="text-amber-700">${summary.savings.toFixed(2)}</span>
              </div>
            )}

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-bold text-slate-900">${summary.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Scheduled Delivery Fee</span>
                {summary.deliveryFee === 0 ? (
                  <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">FREE</span>
                ) : (
                  <span className="font-bold text-slate-900">${summary.deliveryFee.toFixed(2)}</span>
                )}
              </div>

              <div className="flex justify-between">
                <span>Estimated Taxes (5%)</span>
                <span className="font-bold text-slate-900">${summary.tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between pt-3 border-t border-slate-200 text-base font-black text-slate-900">
                <span>Total Payable</span>
                <span className="text-emerald-700">${summary.total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-emerald-600/25 transition-smooth flex items-center justify-center gap-2"
            >
              Proceed to Delivery & Slots <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe & Secure 256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
