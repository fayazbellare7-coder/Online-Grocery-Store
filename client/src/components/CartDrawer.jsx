import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function CartDrawer() {
  const { items, summary, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const progressPercent = Math.min(100, Math.round((summary.subtotal / summary.freeDeliveryThreshold) * 100));

  const handleCheckoutClick = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">Your Basket</h2>
              <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded-full">
                {summary.itemCount} items
              </span>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-400 hover:text-rose-500 font-medium transition flex items-center gap-1"
                  title="Clear all items"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-emerald-50/60 p-3.5 border-b border-emerald-100/60">
            {summary.isFreeDelivery ? (
              <div className="flex items-center gap-2 text-xs text-emerald-800 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>Awesome! You have unlocked <strong>FREE Scheduled Delivery</strong></span>
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-xs font-semibold text-emerald-950 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Add <strong>${summary.amountNeededForFreeDelivery.toFixed(2)}</strong> for FREE Delivery
                  </span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-emerald-200/80 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="py-16 text-center flex flex-col items-center">
                <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-bold text-slate-800">Your basket is empty</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Discover fresh fruits, crisp greens, bakery items and daily grocery deals!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-md shadow-emerald-600/20"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-3.5 flex gap-3 items-center justify-between">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-xl border border-slate-100 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-xs truncate leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-400">{item.unit}</p>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-xs font-black text-slate-900">
                        ${Number(item.unitPrice).toFixed(2)}
                      </span>
                      {item.discountPercent > 0 && (
                        <span className="text-[10px] text-slate-400 line-through">
                          ${Number(item.originalPrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center bg-slate-100 border border-slate-200 rounded-lg overflow-hidden text-xs">
                      <button
                        onClick={() => updateQuantity(item.id, item.productId, item.quantity - 1)}
                        className="p-1 hover:bg-slate-200 text-slate-600 transition"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-bold text-slate-900">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className={`p-1 text-slate-600 transition ${
                          item.quantity >= item.stock ? 'opacity-40 cursor-not-allowed' : 'hover:bg-slate-200'
                        }`}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id, item.productId)}
                      className="text-[10px] text-slate-400 hover:text-rose-500 transition"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/50 space-y-3">
              {/* Savings Callout */}
              {summary.savings > 0 && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs text-amber-900 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> You are saving on this order
                  </span>
                  <span className="text-amber-700">${summary.savings.toFixed(2)}</span>
                </div>
              )}

              {/* Bill Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">${summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  {summary.deliveryFee === 0 ? (
                    <span className="font-bold text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-semibold text-slate-900">${summary.deliveryFee.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-semibold text-slate-900">${summary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-sm font-black text-slate-900">
                  <span>Total Payable</span>
                  <span className="text-emerald-700">${summary.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/25 transition-smooth flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="text-center text-xs font-semibold text-slate-500 hover:text-emerald-600 py-1 transition"
                >
                  View Full Cart & Bill Details
                </Link>
              </div>

              <div className="flex items-center justify-center gap-1 text-[11px] text-slate-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Safe & Secure 256-bit Encrypted Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
