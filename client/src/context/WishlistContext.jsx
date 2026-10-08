import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase.js';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    let items = [];
    const local = localStorage.getItem('freshcart_wishlist_items');
    try {
      items = local ? JSON.parse(local) : [];
    } catch {
      items = [];
    }

    if (isAuthenticated && user?.id) {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('wishlist_items')
          .select('*, products(*)')
          .eq('user_id', user.id);

        if (!error && data && data.length > 0) {
          items = data.map(w => ({
            ...w.products,
            wishlist_id: w.id,
            product_id: w.product_id
          }));
        }
      } catch (err) {
        console.warn('Supabase wishlist fetch fallback:', err.message);
      } finally {
        setLoading(false);
      }
    }

    setWishlistItems(items);
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (product) => {
    let current = [...wishlistItems];
    const exists = current.some((item) => String(item.id) === String(product.id) || String(item.product_id) === String(product.id));

    if (exists) {
      current = current.filter((item) => String(item.id) !== String(product.id) && String(item.product_id) !== String(product.id));
      toast.success(`Removed ${product.name} from wishlist`, { icon: '🤍' });

      if (isAuthenticated && user?.id) {
        try {
          await supabase.from('wishlist_items').delete().match({ user_id: user.id, product_id: product.id });
        } catch (e) {
          // Fallback
        }
      }
    } else {
      current.push({
        ...product,
        product_id: product.id,
        wishlist_id: `wl_${product.id}_${Date.now()}`
      });
      toast.success(`Added ${product.name} to wishlist`, { icon: '❤️' });

      if (isAuthenticated && user?.id) {
        try {
          await supabase.from('wishlist_items').upsert([{ user_id: user.id, product_id: product.id }]);
        } catch (e) {
          // Fallback
        }
      }
    }

    setWishlistItems(current);
    localStorage.setItem('freshcart_wishlist_items', JSON.stringify(current));
    return !exists;
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => String(item.id) === String(productId) || String(item.product_id) === String(productId));
  };

  const value = {
    wishlistItems,
    loading,
    toggleWishlist,
    isInWishlist,
    refreshWishlist: fetchWishlist,
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
