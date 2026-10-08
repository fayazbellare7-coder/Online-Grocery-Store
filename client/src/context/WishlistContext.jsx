import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await api.get('/wishlist');
        if (res.success) {
          setWishlistItems(res.items || []);
        }
      } catch (err) {
        console.error('Failed to fetch wishlist:', err);
      } finally {
        setLoading(false);
      }
    } else {
      const local = localStorage.getItem('freshcart_guest_wishlist');
      try {
        setWishlistItems(local ? JSON.parse(local) : []);
      } catch {
        setWishlistItems([]);
      }
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (product) => {
    if (isAuthenticated) {
      try {
        const res = await api.post('/wishlist/toggle', { productId: product.id });
        if (res.success) {
          toast.success(res.message, { icon: res.isWishlisted ? '❤️' : '🤍' });
          fetchWishlist();
          return res.isWishlisted;
        }
      } catch (err) {
        toast.error(err.message || 'Failed to update wishlist');
      }
    } else {
      let current = [...wishlistItems];
      const exists = current.some((item) => item.id === product.id || item.product_id === product.id);
      if (exists) {
        current = current.filter((item) => item.id !== product.id && item.product_id !== product.id);
        toast.success(`Removed ${product.name} from wishlist`, { icon: '🤍' });
      } else {
        current.push({
          ...product,
          product_id: product.id,
          wishlist_item_id: `guest_${product.id}`,
        });
        toast.success(`Added ${product.name} to wishlist`, { icon: '❤️' });
      }
      setWishlistItems(current);
      localStorage.setItem('freshcart_guest_wishlist', JSON.stringify(current));
      return !exists;
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId || item.product_id === productId);
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
