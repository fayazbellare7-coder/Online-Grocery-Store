import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
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
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between rounded-l-[32px] overflow-hidden">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-display font-black text-slate-900 leading-tight">Your Fresh Basket</h2>
                <p className="text-[11px] text-slate-500 font-medium">
                  {summary.itemCount} {summary.itemCount === 1 ? 'item' : 'items'} in basket
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={clearCart}
                  className="text-xs text-slate-400 hover:text-rose-500 font-semibold transition flex items-center gap-1 p-1.5 rounded-lg hover:bg-rose-50"
                  title="Clear all items"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear
                </button>
              )}
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Free Shipping Progress Bar */}
          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/80 p-4 border-b border-emerald-100/80">
            {summary.isFreeDelivery ? (
              <div className="flex items-center gap-2 text-xs text-emerald-900 font-bold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>🎉 You unlocked <strong>FREE Scheduled Delivery</strong>!</span>
              </div>
            ) : (
              <div>
                <div className="flex justify-between text-xs font-semibold text-emerald-950 mb-1.5">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-emerald-600" />
                    Add <strong>₹{summary.amountNeededForFreeDelivery.toFixed(2)}</strong> for FREE 2-Hour Delivery
                  </span>
                  <span className="font-bold text-emerald-700">{progressPercent}%</span>
                </div>
                <div className="w-full bg-emerald-200/80 rounded-full h-2 overflow-hidden shadow-inner">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
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
                <div className="w-20 h-20 rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shadow-inner">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="font-display font-black text-slate-900 text-lg">Your basket is empty</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs font-medium leading-relaxed">
                  Discover fresh fruits, crisp greens, bakery loaves, and daily organic grocery deals!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold px-6 py-3 rounded-2xl transition shadow-lg shadow-emerald-600/20"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-3.5 flex gap-3.5 items-center justify-between">
                  <img
                    src={item.imageUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&auto=format&fit=crop&q=80'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-2xl border border-slate-100 flex-shrink-0 bg-slate-50"
                  />

                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-slate-900 text-xs sm:text-sm truncate leading-snug">
                      {item.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">{item.unit}</p>
                    <div className="flex items-baseline gap-1.5 mt-1">
                      <span className="text-xs sm:text-sm font-black text-slate-900 font-display">
                        ₹{Number(item.unitPrice).toFixed(2)}
                      </span>
                      {item.discountPercent > 0 && (
                        <span className="text-[10px] text-slate-400 line-through">
                          ₹{Number(item.originalPrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Stepper & Remove */}
                  <div className="flex flex-col items-end gap-1.5">
                    <div className="flex items-center bg-emerald-600 text-white rounded-xl overflow-hidden shadow-xs text-xs font-black">
                      <button
                        onClick={() => updateQuantity(item.id, item.productId, item.quantity - 1)}
                        className="p-1.5 hover:bg-emerald-700 transition"
                      >
                        <Minus className="w-3 h-3 stroke-[3]" />
                      </button>
                      <span className="px-2 font-black text-white">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.productId, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className={`p-1.5 transition ${
                          item.quantity >= item.stock ? 'opacity-40 cursor-not-allowed' : 'hover:bg-emerald-700'
                        }`}
                      >
                        <Plus className="w-3 h-3 stroke-[3]" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id, item.productId)}
                      className="text-[10px] font-semibold text-slate-400 hover:text-rose-600 transition"
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
            <div className="p-5 border-t border-slate-100 bg-slate-50/80 space-y-3.5">
              {/* Savings Callout */}
              {summary.savings > 0 && (
                <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-2.5 flex items-center justify-between text-xs text-amber-900 font-extrabold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> You are saving on this order
                  </span>
                  <span className="text-amber-800 font-display">₹{summary.savings.toFixed(2)}</span>
                </div>
              )}

              {/* Bill Breakdown */}
              <div className="space-y-1.5 text-xs text-slate-600 font-medium">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-900">₹{summary.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Scheduled Delivery</span>
                  {summary.deliveryFee === 0 ? (
                    <span className="font-black text-emerald-600">FREE</span>
                  ) : (
                    <span className="font-bold text-slate-900">₹{summary.deliveryFee.toFixed(2)}</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-bold text-slate-900">₹{summary.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 text-base font-black text-slate-900 font-display">
                  <span>Total Payable</span>
                  <span className="text-emerald-700 font-black">₹{summary.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={handleCheckoutClick}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-600/25 transition flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  to="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="text-center text-xs font-bold text-slate-500 hover:text-emerald-700 py-1 transition"
                >
                  View Full Cart & Items
                </Link>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-1">
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

