import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api.js';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const FREE_DELIVERY_THRESHOLD = 35.0;
const STANDARD_DELIVERY_FEE = 4.99;
const TAX_RATE = 0.05;

export function CartProvider({ children }) {
  const { isAuthenticated, token } = useAuth();
  const [items, setItems] = useState([]);
  const [summary, setSummary] = useState({
    subtotal: 0,
    originalSubtotal: 0,
    savings: 0,
    deliveryFee: 0,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
    amountNeededForFreeDelivery: FREE_DELIVERY_THRESHOLD,
    isFreeDelivery: false,
    tax: 0,
    total: 0,
    itemCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Calculate guest cart summary from local items
  const computeGuestSummary = (guestItems) => {
    let subtotal = 0;
    let originalSubtotal = 0;
    let itemCount = 0;

    guestItems.forEach((item) => {
      const itemTotal = Math.round(item.unitPrice * item.quantity * 100) / 100;
      const originalTotal = Math.round(item.originalPrice * item.quantity * 100) / 100;
      subtotal += itemTotal;
      originalSubtotal += originalTotal;
      itemCount += item.quantity;
    });

    subtotal = Math.round(subtotal * 100) / 100;
    originalSubtotal = Math.round(originalSubtotal * 100) / 100;
    const savings = Math.round((originalSubtotal - subtotal) * 100) / 100;
    const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_THRESHOLD ? 0.0 : STANDARD_DELIVERY_FEE;
    const amountNeededForFreeDelivery = subtotal === 0 ? FREE_DELIVERY_THRESHOLD : Math.max(0, Math.round((FREE_DELIVERY_THRESHOLD - subtotal) * 100) / 100);
    const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
    const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

    return {
      subtotal,
      originalSubtotal,
      savings,
      deliveryFee,
      freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
      amountNeededForFreeDelivery,
      isFreeDelivery: deliveryFee === 0 && subtotal > 0,
      tax,
      taxRate: TAX_RATE,
      total,
      itemCount,
    };
  };

  // Fetch cart from backend (if logged in) or localStorage (if guest)
  const fetchCart = useCallback(async () => {
    if (isAuthenticated) {
      try {
        setLoading(true);
        const res = await api.get('/cart');
        if (res.success) {
          setItems(res.items || []);
          setSummary(res.summary || {});
        }
      } catch (err) {
        console.error('Failed to fetch cart:', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Guest cart
      const saved = localStorage.getItem('freshcart_guest_cart');
      try {
        const parsed = saved ? JSON.parse(saved) : [];
        setItems(parsed);
        setSummary(computeGuestSummary(parsed));
      } catch {
        setItems([]);
      }
    }
  }, [isAuthenticated]);

  // Sync / Merge guest cart when user logs in
  useEffect(() => {
    async function syncCartOnAuthChange() {
      if (isAuthenticated) {
        const guestSaved = localStorage.getItem('freshcart_guest_cart');
        if (guestSaved) {
          try {
            const parsedGuest = JSON.parse(guestSaved);
            if (parsedGuest.length > 0) {
              const mergePayload = parsedGuest.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              }));
              const res = await api.post('/cart/merge', { items: mergePayload });
              if (res.success) {
                setItems(res.items || []);
                setSummary(res.summary || {});
                localStorage.removeItem('freshcart_guest_cart');
                toast.success('Your saved cart items have been synced!', { icon: '🛒' });
                return;
              }
            }
          } catch (e) {
            console.error('Error syncing guest cart:', e);
          }
          localStorage.removeItem('freshcart_guest_cart');
        }
        fetchCart();
      } else {
        fetchCart();
      }
    }

    syncCartOnAuthChange();
  }, [isAuthenticated, token, fetchCart]);

  const addToCart = async (product, quantity = 1) => {
    if (isAuthenticated) {
      try {
        const res = await api.post('/cart', {
          productId: product.id,
          quantity,
        });
        if (res.success) {
          setItems(res.items);
          setSummary(res.summary);
          toast.success(`Added ${product.name} to cart!`, { icon: '🛒' });
        }
      } catch (err) {
        toast.error(err.message || 'Failed to add item to cart');
      }
    } else {
      // Guest Cart
      const currentItems = [...items];
      const existingIdx = currentItems.findIndex((i) => i.productId === product.id);

      const effectivePrice = Math.round(product.price * (1 - (product.discount_percent || 0) / 100) * 100) / 100;

      if (existingIdx > -1) {
        const newQty = Math.min(product.stock, currentItems[existingIdx].quantity + quantity);
        currentItems[existingIdx].quantity = newQty;
        currentItems[existingIdx].itemTotal = Math.round(effectivePrice * newQty * 100) / 100;
      } else {
        currentItems.push({
          id: `guest_${product.id}_${Date.now()}`,
          productId: product.id,
          name: product.name,
          unit: product.unit,
          imageUrl: product.image_url,
          originalPrice: product.price,
          discountPercent: product.discount_percent || 0,
          unitPrice: effectivePrice,
          quantity: Math.min(product.stock, quantity),
          itemTotal: Math.round(effectivePrice * quantity * 100) / 100,
          stock: product.stock,
          isActive: true,
          isOutOfStock: product.stock <= 0,
        });
      }

      setItems(currentItems);
      setSummary(computeGuestSummary(currentItems));
      localStorage.setItem('freshcart_guest_cart', JSON.stringify(currentItems));
      toast.success(`Added ${product.name} to cart!`, { icon: '🛒' });
    }
  };

  const updateQuantity = async (itemId, productId, newQty) => {
    if (isAuthenticated) {
      try {
        const res = await api.patch(`/cart/${itemId}`, { quantity: newQty });
        if (res.success) {
          setItems(res.items);
          setSummary(res.summary);
        }
      } catch (err) {
        toast.error(err.message || 'Failed to update quantity');
      }
    } else {
      let currentItems = [...items];
      if (newQty <= 0) {
        currentItems = currentItems.filter((i) => i.productId !== productId && i.id !== itemId);
      } else {
        const idx = currentItems.findIndex((i) => i.productId === productId || i.id === itemId);
        if (idx > -1) {
          const item = currentItems[idx];
          if (newQty > item.stock) {
            toast.error(`Only ${item.stock} units available in stock`);
            return;
          }
          item.quantity = newQty;
          item.itemTotal = Math.round(item.unitPrice * newQty * 100) / 100;
        }
      }

      setItems(currentItems);
      setSummary(computeGuestSummary(currentItems));
      localStorage.setItem('freshcart_guest_cart', JSON.stringify(currentItems));
    }
  };

  const removeFromCart = async (itemId, productId) => {
    if (isAuthenticated) {
      try {
        const res = await api.delete(`/cart/${itemId}`);
        if (res.success) {
          setItems(res.items);
          setSummary(res.summary);
          toast.success('Item removed from cart');
        }
      } catch (err) {
        toast.error(err.message || 'Failed to remove item');
      }
    } else {
      const filtered = items.filter((i) => i.productId !== productId && i.id !== itemId);
      setItems(filtered);
      setSummary(computeGuestSummary(filtered));
      localStorage.setItem('freshcart_guest_cart', JSON.stringify(filtered));
      toast.success('Item removed from cart');
    }
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        const res = await api.delete('/cart');
        if (res.success) {
          setItems([]);
          setSummary(res.summary);
        }
      } catch (err) {
        toast.error(err.message || 'Failed to clear cart');
      }
    } else {
      setItems([]);
      setSummary(computeGuestSummary([]));
      localStorage.removeItem('freshcart_guest_cart');
    }
  };

  // Helper to get current quantity of a product in the cart
  const getItemQuantity = (productId) => {
    const item = items.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

  const value = {
    items,
    summary,
    loading,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getItemQuantity,
    refreshCart: fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
