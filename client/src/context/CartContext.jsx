import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase.js';
import { useAuth } from './AuthContext.jsx';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

const FREE_DELIVERY_THRESHOLD = 299.0;
const STANDARD_DELIVERY_FEE = 40.0;
const TAX_RATE = 0.05;

export function CartProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
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

  // Compute Cart Summary
  const computeSummary = (cartItems) => {
    let subtotal = 0;
    let originalSubtotal = 0;
    let itemCount = 0;

    cartItems.forEach((item) => {
      const itemTotal = Math.round((item.unitPrice || item.price) * item.quantity * 100) / 100;
      const originalTotal = Math.round((item.originalPrice || item.price) * item.quantity * 100) / 100;
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

  // Fetch Cart from Supabase or localStorage
  const fetchCart = useCallback(async () => {
    const saved = localStorage.getItem('freshcart_active_cart');
    let cartList = [];
    try {
      cartList = saved ? JSON.parse(saved) : [];
    } catch {
      cartList = [];
    }

    if (isAuthenticated && user?.id) {
      try {
        setLoading(true);
        // Attempt query Supabase cart_items
        const { data, error } = await supabase
          .from('cart_items')
          .select('*, products(*)')
          .eq('user_id', user.id);

        if (!error && data && data.length > 0) {
          cartList = data.map(ci => ({
            id: ci.id,
            productId: ci.product_id,
            name: ci.products?.name,
            unit: ci.products?.unit,
            imageUrl: ci.products?.image_url,
            originalPrice: ci.products?.price,
            discountPercent: ci.products?.discount_percent || 0,
            unitPrice: Math.round((ci.products?.price || 0) * (1 - (ci.products?.discount_percent || 0) / 100) * 100) / 100,
            quantity: ci.quantity,
            itemTotal: Math.round((ci.products?.price || 0) * (1 - (ci.products?.discount_percent || 0) / 100) * ci.quantity * 100) / 100,
            stock: ci.products?.stock || 50,
            isActive: true
          }));
        }
      } catch (err) {
        console.warn('Supabase cart fetch fallback:', err.message);
      } finally {
        setLoading(false);
      }
    }

    setItems(cartList);
    setSummary(computeSummary(cartList));
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const saveCartState = (newItems) => {
    setItems(newItems);
    setSummary(computeSummary(newItems));
    localStorage.setItem('freshcart_active_cart', JSON.stringify(newItems));
  };

  const addToCart = async (product, quantity = 1) => {
    const effectivePrice = Math.round(product.price * (1 - (product.discount_percent || 0) / 100) * 100) / 100;
    const currentItems = [...items];
    const existingIdx = currentItems.findIndex((i) => i.productId === product.id || i.id === product.id);

    if (existingIdx > -1) {
      const newQty = Math.min(product.stock || 50, currentItems[existingIdx].quantity + quantity);
      currentItems[existingIdx].quantity = newQty;
      currentItems[existingIdx].itemTotal = Math.round(effectivePrice * newQty * 100) / 100;
    } else {
      currentItems.push({
        id: `cart_${product.id}_${Date.now()}`,
        productId: product.id,
        name: product.name,
        unit: product.unit,
        imageUrl: product.image_url,
        originalPrice: product.price,
        discountPercent: product.discount_percent || 0,
        unitPrice: effectivePrice,
        quantity: Math.min(product.stock || 50, quantity),
        itemTotal: Math.round(effectivePrice * quantity * 100) / 100,
        stock: product.stock || 50,
        isActive: true,
        isOutOfStock: (product.stock || 50) <= 0,
      });
    }

    saveCartState(currentItems);
    toast.success(`Added ${product.name} to cart!`, { icon: '🛒' });

    // Sync to Supabase if authenticated
    if (isAuthenticated && user?.id) {
      try {
        await supabase.from('cart_items').upsert([{
          user_id: user.id,
          product_id: product.id,
          quantity: existingIdx > -1 ? currentItems[existingIdx].quantity : quantity
        }]);
      } catch (e) {
        // Fallback already saved locally
      }
    }
  };

  const updateQuantity = async (itemId, productId, newQty) => {
    let currentItems = [...items];
    if (newQty <= 0) {
      currentItems = currentItems.filter((i) => i.productId !== productId && i.id !== itemId);
    } else {
      const idx = currentItems.findIndex((i) => i.productId === productId || i.id === itemId);
      if (idx > -1) {
        const item = currentItems[idx];
        if (item.stock && newQty > item.stock) {
          toast.error(`Only ${item.stock} units available in stock`);
          return;
        }
        item.quantity = newQty;
        item.itemTotal = Math.round(item.unitPrice * newQty * 100) / 100;
      }
    }

    saveCartState(currentItems);

    // Sync to Supabase if authenticated
    if (isAuthenticated && user?.id) {
      try {
        if (newQty <= 0) {
          await supabase.from('cart_items').delete().match({ user_id: user.id, product_id: productId });
        } else {
          await supabase.from('cart_items').upsert([{ user_id: user.id, product_id: productId, quantity: newQty }]);
        }
      } catch (e) {
        // Fallback
      }
    }
  };

  const removeFromCart = async (itemId, productId) => {
    const filtered = items.filter((i) => i.productId !== productId && i.id !== itemId);
    saveCartState(filtered);
    toast.success('Item removed from cart');

    if (isAuthenticated && user?.id) {
      try {
        await supabase.from('cart_items').delete().match({ user_id: user.id, product_id: productId });
      } catch (e) {
        // Fallback
      }
    }
  };

  const clearCart = async () => {
    saveCartState([]);
    if (isAuthenticated && user?.id) {
      try {
        await supabase.from('cart_items').delete().eq('user_id', user.id);
      } catch (e) {
        // Fallback
      }
    }
  };

  const getItemQuantity = (productId) => {
    const item = items.find((i) => i.productId === productId || i.id === productId);
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
