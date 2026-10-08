import { createClient } from '@supabase/supabase-js';
import { defaultProducts } from './data.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://odqelucxdljjtyleiqus.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_kqRiySp96QsOdLN4s_3AbA_rlR0oMzw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Check if Supabase connection is healthy
export async function testSupabaseConnection() {
  try {
    const { data, error } = await supabase.from('products').select('id').limit(1);
    if (!error) {
      return { connected: true, message: 'Live connected to Supabase' };
    }
    return { connected: false, message: error.message };
  } catch (err) {
    return { connected: false, message: err.message };
  }
}

// Fetch products with fallback
export async function getProducts() {
  try {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
    if (error || !data || data.length === 0) {
      const local = JSON.parse(localStorage.getItem('freshcart_custom_products') || 'null');
      return local || defaultProducts;
    }
    // Normalize and ensure prices are in INR
    return data.map(p => {
      const match = defaultProducts.find(dp => String(dp.id) === String(p.id) || dp.name.toLowerCase() === p.name.toLowerCase());
      const isOldDollar = Number(p.price) < ((match?.price || 50) * 0.45);
      return {
        ...p,
        price: isOldDollar && match ? match.price : Number(p.price),
        discount_percent: p.discount_percent !== undefined ? Number(p.discount_percent) : (match?.discount_percent || 0),
        unit: p.unit || match?.unit || '1 pack',
        image_url: p.image_url || match?.image_url,
        category: p.category_slug || p.category || match?.category || 'fruits-vegetables',
        stock: p.stock !== undefined ? p.stock : (match?.stock || 30)
      };
    });
  } catch {
    const local = JSON.parse(localStorage.getItem('freshcart_custom_products') || 'null');
    return local || defaultProducts;
  }
}

// Update a product's stock or price (Admin Action)
export async function updateProduct(id, updates) {
  try {
    await supabase.from('products').update(updates).eq('id', id);
  } catch (e) {
    console.warn('Local product update:', e);
  }
}

// Save customer order
export async function placeOrder(orderData) {
  const newOrder = {
    id: 'FC-' + Math.floor(100000 + Math.random() * 900000),
    created_at: new Date().toISOString(),
    status: 'Placed',
    ...orderData
  };

  try {
    await supabase.from('orders').insert([newOrder]);
  } catch (err) {
    console.warn('Saved order locally:', err);
  }

  // Save in local storage
  const savedOrders = JSON.parse(localStorage.getItem('freshcart_orders') || '[]');
  savedOrders.unshift(newOrder);
  localStorage.setItem('freshcart_orders', JSON.stringify(savedOrders));

  return newOrder;
}

// Update order status (Admin Action)
export async function updateOrderStatus(orderId, newStatus) {
  try {
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
  } catch (e) {
    console.warn('Local order status update:', e);
  }

  const savedOrders = JSON.parse(localStorage.getItem('freshcart_orders') || '[]');
  const updated = savedOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
  localStorage.setItem('freshcart_orders', JSON.stringify(updated));
  return updated;
}

// Get user/admin orders
export function getSavedOrders() {
  const local = JSON.parse(localStorage.getItem('freshcart_orders') || '[]');
  if (local.length === 0) {
    // Initial sample orders for demo
    const initialOrders = [
      {
        id: 'FC-849201',
        created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
        customer_name: 'Sarah Connor',
        customer_phone: '+91 98765 43210',
        customer_address: 'Flat 402, Green Valley Apts, Springfield',
        delivery_slot: 'Morning Slot (8:00 AM - 11:00 AM)',
        payment_method: 'COD',
        item_count: 3,
        total: 420.00,
        status: 'Out for Delivery',
        items: [
          { name: 'Crisp Shimla Royal Apples', quantity: 1, finalPrice: 153.00, unit: '1 kg' },
          { name: 'Farm Fresh Pure Toned Cow Milk', quantity: 2, finalPrice: 68.00, unit: '1 L' },
          { name: 'Fresh Soft Malai Paneer', quantity: 1, finalPrice: 93.10, unit: '200 g' }
        ]
      },
      {
        id: 'FC-721094',
        created_at: new Date(Date.now() - 86400000).toISOString(),
        customer_name: 'Rahul Sharma',
        customer_phone: '+91 91234 56789',
        customer_address: '12, Sunrise Enclave, Springfield',
        delivery_slot: 'Evening Slot (6:00 PM - 9:00 PM)',
        payment_method: 'UPI',
        item_count: 2,
        total: 310.00,
        status: 'Delivered',
        items: [
          { name: 'Royal Aged Kohinoor Basmati Rice', quantity: 1, finalPrice: 220.80, unit: '1 kg' },
          { name: 'Fresh Organic Robusta Bananas', quantity: 1, finalPrice: 46.80, unit: '1 kg' }
        ]
      }
    ];
    localStorage.setItem('freshcart_orders', JSON.stringify(initialOrders));
    return initialOrders;
  }
  return local;
}
