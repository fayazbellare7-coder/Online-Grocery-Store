import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Minus, Heart, Star, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

export default function ProductCard({ product }) {
  const { addToCart, updateQuantity, getItemQuantity, items } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  if (!product) return null;

  const currentQty = getItemQuantity(product.id);
  const isWishlisted = isInWishlist(product.id);

  // Find cart item ID if already in cart
  const cartItem = items.find((i) => i.productId === product.id);

  const finalPrice = product.final_price !== undefined 
    ? product.final_price 
    : Math.round(product.price * (1 - (product.discount_percent || 0) / 100) * 100) / 100;

  // Derive rating based on ID for consistent rich display
  const rating = (4.7 + ((product.id * 7) % 4) * 0.1).toFixed(1);
  const reviewsCount = 45 + ((product.id * 19) % 180);

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock > 0) {
      addToCart(product, 1);
    }
  };

  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentQty < product.stock) {
      if (cartItem) {
        updateQuantity(cartItem.id, product.id, currentQty + 1);
      } else {
        addToCart(product, 1);
      }
    }
  };

  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cartItem) {
      updateQuantity(cartItem.id, product.id, currentQty - 1);
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-white border border-slate-100 hover:border-emerald-500/40 rounded-3xl p-3.5 sm:p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.16)] transition-all duration-300 flex flex-col justify-between overflow-hidden">
      
      {/* Top Badges & Wishlist Heart */}
      <div className="relative">
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1.5 items-start">
          {product.discount_percent > 0 ? (
            <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-white font-extrabold text-[11px] px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-200" />
              {Math.round(product.discount_percent)}% OFF
            </span>
          ) : (
            <span className="bg-emerald-50/95 text-emerald-700 font-bold text-[10px] px-2 py-0.5 rounded-full border border-emerald-200/60 shadow-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Fresh
            </span>
          )}
        </div>

        <button
          onClick={handleWishlistClick}
          className={`absolute top-2 right-2 z-10 p-2 rounded-2xl backdrop-blur-md transition-all duration-200 ${
            isWishlisted 
              ? 'bg-rose-50 text-rose-500 shadow-sm scale-105' 
              : 'bg-white/80 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:scale-110'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 transition-transform ${isWishlisted ? 'fill-rose-500 scale-110' : ''}`} />
        </button>

        {/* Product Image */}
        <Link 
          to={`/products/${product.id}`} 
          className="block overflow-hidden rounded-2xl bg-gradient-to-b from-slate-50 to-slate-100/60 aspect-[4/3] sm:aspect-square mb-3 relative group"
        >
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 ease-out"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </Link>
      </div>

      {/* Product Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
            <span className="font-semibold text-emerald-700 uppercase tracking-wider text-[10px] bg-emerald-50 px-2 py-0.5 rounded-md truncate max-w-[120px]">
              {product.category_name || 'Organic'}
            </span>
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
              <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              <span>{rating}</span>
              <span className="text-slate-400 font-normal">({reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <Link
            to={`/products/${product.id}`}
            className="block font-display font-bold text-slate-900 text-sm sm:text-[15px] hover:text-emerald-600 line-clamp-2 leading-snug transition-colors mb-1"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Unit */}
          <p className="text-xs text-slate-500 font-medium mb-2">
            Unit: <span className="text-slate-700 font-semibold">{product.unit || '1 pack'}</span>
          </p>

          {/* Stock Scarcity Bar if low */}
          {product.stock <= 8 && product.stock > 0 && (
            <div className="mb-2">
              <div className="flex items-center justify-between text-[10px] font-bold text-rose-600 mb-1">
                <span>Low stock</span>
                <span>Only {product.stock} left</span>
              </div>
              <div className="w-full h-1.5 bg-rose-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-rose-500 rounded-full"
                  style={{ width: `${Math.min(100, (product.stock / 10) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-black text-slate-900 font-display">
                ₹{Number(finalPrice).toFixed(2)}
              </span>
              {product.discount_percent > 0 && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  ₹{Number(product.price).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Stepper */}
          {product.stock <= 0 ? (
            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-xl cursor-not-allowed">
              Sold Out
            </span>
          ) : currentQty === 0 ? (
            <button
              onClick={handleAdd}
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-4 py-2 rounded-2xl transition-all duration-200 flex items-center gap-1.5 shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              Add
            </button>
          ) : (
            <div className="flex items-center bg-emerald-600 text-white rounded-2xl overflow-hidden shadow-md shadow-emerald-600/25 font-black text-xs">
              <button
                onClick={handleDecrement}
                className="p-2 hover:bg-emerald-700 transition active:bg-emerald-800"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
              <span className="px-2 font-black text-white text-xs">{currentQty}</span>
              <button
                onClick={handleIncrement}
                disabled={currentQty >= product.stock}
                className={`p-2 transition active:bg-emerald-800 ${
                  currentQty >= product.stock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700'
                }`}
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

