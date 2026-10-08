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
    <div className="group relative bg-white border border-slate-200/90 hover:border-emerald-500/50 rounded-2xl p-3.5 shadow-sm hover:shadow-xl hover:shadow-emerald-500/5 transition-smooth flex flex-col justify-between overflow-hidden">
      {/* Top Badges & Wishlist Heart */}
      <div className="relative">
        <div className="absolute top-0 left-0 z-10 flex flex-col gap-1">
          {product.discount_percent > 0 && (
            <span className="bg-amber-500 text-slate-950 font-black text-[10px] uppercase px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-0.5">
              <Sparkles className="w-2.5 h-2.5" />
              {Math.round(product.discount_percent)}% OFF
            </span>
          )}
          {product.stock <= 5 && product.stock > 0 && (
            <span className="bg-rose-50 text-rose-600 border border-rose-200 font-bold text-[10px] px-1.5 py-0.5 rounded-md">
              Only {product.stock} left
            </span>
          )}
        </div>

        <button
          onClick={handleWishlistClick}
          className={`absolute top-0 right-0 z-10 p-2 rounded-xl transition-smooth ${
            isWishlisted 
              ? 'bg-rose-50 text-rose-500 shadow-sm' 
              : 'bg-white/80 backdrop-blur-md text-slate-400 hover:text-rose-500 hover:bg-rose-50'
          }`}
          title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Product Image */}
        <Link to={`/products/${product.id}`} className="block overflow-hidden rounded-xl bg-slate-50 aspect-square mb-3">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&auto=format&fit=crop&q=80'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-smooth"
            loading="lazy"
          />
        </Link>
      </div>

      {/* Product Content */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Unit */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
            <span className="text-emerald-700 font-medium truncate max-w-[120px]">
              {product.category_name || 'Grocery'}
            </span>
            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 font-medium">
              {product.unit}
            </span>
          </div>

          {/* Title */}
          <Link
            to={`/products/${product.id}`}
            className="block font-bold text-slate-900 text-sm hover:text-emerald-600 line-clamp-2 leading-snug transition-colors mb-1.5"
            title={product.name}
          >
            {product.name}
          </Link>
        </div>

        {/* Price and Cart Action */}
        <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-black text-slate-900">
                ${Number(finalPrice).toFixed(2)}
              </span>
              {product.discount_percent > 0 && (
                <span className="text-xs text-slate-400 line-through">
                  ${Number(product.price).toFixed(2)}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Stepper */}
          {product.stock <= 0 ? (
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2.5 py-1.5 rounded-xl cursor-not-allowed">
              Sold Out
            </span>
          ) : currentQty === 0 ? (
            <button
              onClick={handleAdd}
              className="bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white border border-emerald-200 hover:border-emerald-600 font-bold text-xs px-3.5 py-1.5 rounded-xl transition-smooth flex items-center gap-1 shadow-sm active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          ) : (
            <div className="flex items-center bg-emerald-600 text-white rounded-xl overflow-hidden shadow-sm font-bold text-xs">
              <button
                onClick={handleDecrement}
                className="p-1.5 hover:bg-emerald-700 transition active:bg-emerald-800"
                title="Decrease quantity"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-2 font-black text-white text-xs">{currentQty}</span>
              <button
                onClick={handleIncrement}
                disabled={currentQty >= product.stock}
                className={`p-1.5 transition active:bg-emerald-800 ${
                  currentQty >= product.stock ? 'opacity-50 cursor-not-allowed' : 'hover:bg-emerald-700'
                }`}
                title="Increase quantity"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
