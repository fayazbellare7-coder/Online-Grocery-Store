import React from 'react';
import { Heart, ShoppingBag, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Wishlist() {
  const { wishlistItems, loading } = useWishlist();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            My Wishlist <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {wishlistItems.length} favorite grocery items saved for later
          </p>
        </div>

        <Link
          to="/products"
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" /> Explore Groceries
        </Link>
      </div>

      {wishlistItems.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Your Wishlist is Empty"
          description="Click the heart icon on any grocery product card to save your favorite fruits, veggies, and pantry items here."
          actionText="Discover Groceries"
          actionLink="/products"
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {wishlistItems.map((product) => (
            <ProductCard key={product.id || product.product_id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
