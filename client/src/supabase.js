import { createClient } from '@supabase/supabase-js';
import { defaultProducts } from './data.js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://odqelucxdljjtyleiqus.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_kqRiySp96QsOdLN4s_3AbA_rlR0oMzw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Fetch products from Supabase with fallback to local Indian catalog
export async function getProducts() {
  try {
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: true });
    if (error || !data || data.length === 0) {
      return defaultProducts;
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
        category: p.category_slug || p.category || match?.category || 'fruits-vegetables'
      };
    });
  } catch {
    return defaultProducts;
  }
}

// Save order to Supabase & local storage
export async function placeOrder(orderData) {
  const newOrder = {
    id: 'FC-' + Math.floor(100000 + Math.random() * 900000),
    created_at: new Date().toISOString(),
    status: 'Placed',
    ...orderData
  };

  try {
    // Attempt insert into Supabase
    await supabase.from('orders').insert([newOrder]);
  } catch (err) {
    console.warn('Saved order locally:', err);
  }

  // Always save locally
  const savedOrders = JSON.parse(localStorage.getItem('freshcart_orders') || '[]');
  savedOrders.unshift(newOrder);
  localStorage.setItem('freshcart_orders', JSON.stringify(savedOrders));

  return newOrder;
}

// Get user orders from local storage
export function getSavedOrders() {
  return JSON.parse(localStorage.getItem('freshcart_orders') || '[]');
}
