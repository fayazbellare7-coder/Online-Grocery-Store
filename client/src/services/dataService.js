import { supabase } from './supabase';
import { defaultCategories, defaultProducts, generateDeliverySlots, defaultAddresses, defaultOrders } from './defaultData';

// Local storage keys for resilient offline/fallback state
const STORAGE_KEYS = {
  CATEGORIES: 'freshcart_categories',
  PRODUCTS: 'freshcart_products',
  SLOTS: 'freshcart_slots',
  ADDRESSES: 'freshcart_addresses',
  ORDERS: 'freshcart_orders',
  WISHLIST: 'freshcart_wishlist',
  CART: 'freshcart_cart',
  SEEDED: 'freshcart_db_seeded_v1'
};

// Initialize Local Fallback Storage if not present
function initLocalStorage() {
  if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(defaultCategories));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(defaultProducts));
  }
  if (!localStorage.getItem(STORAGE_KEYS.SLOTS)) {
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(generateDeliverySlots()));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ADDRESSES)) {
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(defaultAddresses));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(defaultOrders));
  }
}

initLocalStorage();

/**
 * Seed or Sync local default catalog to Supabase
 */
export async function seedSupabaseDatabase() {
  try {
    // 1. Check if Supabase categories table is available
    const { data: existingCats, error: catErr } = await supabase
      .from('categories')
      .select('id')
      .limit(1);

    if (catErr) {
      console.warn('⚠️ Supabase tables not yet created or RLS restricted. Using client-side persistent storage:', catErr.message);
      return { success: false, error: catErr.message };
    }

    if (!existingCats || existingCats.length === 0) {
      // Insert Categories
      const cleanCats = defaultCategories.map(({ id, ...c }) => c);
      const { data: insertedCats } = await supabase.from('categories').insert(cleanCats).select();

      // Create Category Map
      const catMap = {};
      if (insertedCats) {
        insertedCats.forEach(c => { catMap[c.slug] = c.id; });
      }

      // Insert Products
      const cleanProducts = defaultProducts.map(({ id, category_slug, ...p }) => ({
        ...p,
        category_id: catMap[category_slug] || 1
      }));
      await supabase.from('products').insert(cleanProducts);

      // Insert Delivery Slots
      const slots = generateDeliverySlots().map(({ id, ...s }) => s);
      await supabase.from('delivery_slots').insert(slots);

      console.log('✅ Supabase database populated successfully with categories, products, and delivery slots!');
      return { success: true, message: 'Database populated successfully!' };
    }

    return { success: true, message: 'Supabase database is already seeded.' };
  } catch (err) {
    console.warn('Supabase auto-seed warning:', err.message);
    return { success: false, error: err.message };
  }
}

// -------------------------------------------------------------
// CATEGORIES
// -------------------------------------------------------------
export async function getCategories() {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true });

    if (error || !data || data.length === 0) {
      const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
      return local.length ? local : defaultCategories;
    }
    return data;
  } catch (err) {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]') || defaultCategories;
  }
}

export async function createCategory(catData) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert([catData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    const newCat = { id: Date.now(), ...catData };
    local.push(newCat);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(local));
    return newCat;
  }
}

export async function updateCategory(id, catData) {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(catData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    const idx = local.findIndex(c => String(c.id) === String(id));
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...catData };
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(local));
      return local[idx];
    }
    throw new Error('Category not found');
  }
}

export async function deleteCategory(id) {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES) || '[]');
    const filtered = local.filter(c => String(c.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(filtered));
    return { success: true };
  }
}

// -------------------------------------------------------------
// PRODUCTS
// -------------------------------------------------------------
export async function getProducts(params = {}) {
  const { category, search, sort = 'featured', minPrice, maxPrice, onSale, inStock, page = 1, limit = 50 } = params;

  try {
    let query = supabase.from('products').select('*, categories(id, name, slug)', { count: 'exact' });

    if (category && category !== 'all') {
      // Find category id or filter
      query = query.or(`category_id.eq.${category},category_slug.eq.${category}`);
    }
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    if (minPrice !== undefined && minPrice !== '') {
      query = query.gte('price', parseFloat(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      query = query.lte('price', parseFloat(maxPrice));
    }
    if (onSale) {
      query = query.gt('discount_percent', 0);
    }
    if (inStock) {
      query = query.gt('stock', 0);
    }

    // Sorting
    if (sort === 'price_asc') {
      query = query.order('price', { ascending: true });
    } else if (sort === 'price_desc') {
      query = query.order('price', { ascending: false });
    } else if (sort === 'discount') {
      query = query.order('discount_percent', { ascending: false });
    } else if (sort === 'name') {
      query = query.order('name', { ascending: true });
    } else {
      query = query.order('id', { ascending: true });
    }

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error || !data || data.length === 0) {
      return getLocalProducts(params);
    }

    return {
      products: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count || data.length,
        totalPages: Math.ceil((count || data.length) / limit)
      }
    };
  } catch (err) {
    return getLocalProducts(params);
  }
}

function getLocalProducts(params = {}) {
  const { category, search, sort = 'featured', minPrice, maxPrice, onSale, inStock, page = 1, limit = 50 } = params;
  let items = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]') || defaultProducts;

  if (category && category !== 'all') {
    items = items.filter(p => String(p.category_id) === String(category) || p.category_slug === category);
  }
  if (search) {
    const q = search.toLowerCase();
    items = items.filter(p => p.name.toLowerCase().includes(q) || (p.description && p.description.toLowerCase().includes(q)));
  }
  if (minPrice !== undefined && minPrice !== '') {
    items = items.filter(p => p.price >= parseFloat(minPrice));
  }
  if (maxPrice !== undefined && maxPrice !== '') {
    items = items.filter(p => p.price <= parseFloat(maxPrice));
  }
  if (onSale) {
    items = items.filter(p => p.discount_percent > 0);
  }
  if (inStock) {
    items = items.filter(p => p.stock > 0);
  }

  // Sorting
  if (sort === 'price_asc') {
    items.sort((a, b) => a.price - b.price);
  } else if (sort === 'price_desc') {
    items.sort((a, b) => b.price - a.price);
  } else if (sort === 'discount') {
    items.sort((a, b) => (b.discount_percent || 0) - (a.discount_percent || 0));
  } else if (sort === 'name') {
    items.sort((a, b) => a.name.localeCompare(b.name));
  }

  const total = items.length;
  const start = (page - 1) * limit;
  const paginated = items.slice(start, start + limit);

  return {
    products: paginated,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function getProductById(id) {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(id, name, slug)')
      .eq('id', id)
      .single();

    if (error || !data) {
      const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
      const found = local.find(p => String(p.id) === String(id));
      if (!found) throw new Error('Product not found');
      return found;
    }
    return data;
  } catch (err) {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const found = local.find(p => String(p.id) === String(id));
    if (!found) throw new Error('Product not found');
    return found;
  }
}

export async function createProduct(productData) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const newProduct = {
      id: Date.now(),
      ...productData,
      price: parseFloat(productData.price),
      discount_percent: parseFloat(productData.discount_percent || 0),
      stock: parseInt(productData.stock || 0)
    };
    local.unshift(newProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(local));
    return newProduct;
  }
}

export async function updateProduct(id, productData) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const idx = local.findIndex(p => String(p.id) === String(id));
    if (idx !== -1) {
      local[idx] = {
        ...local[idx],
        ...productData,
        price: parseFloat(productData.price ?? local[idx].price),
        discount_percent: parseFloat(productData.discount_percent ?? local[idx].discount_percent),
        stock: parseInt(productData.stock ?? local[idx].stock)
      };
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(local));
      return local[idx];
    }
    throw new Error('Product not found');
  }
}

export async function deleteProduct(id) {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err) {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    const filtered = local.filter(p => String(p.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(filtered));
    return { success: true };
  }
}

// -------------------------------------------------------------
// DELIVERY SLOTS
// -------------------------------------------------------------
export async function getDeliverySlots() {
  try {
    const { data, error } = await supabase
      .from('delivery_slots')
      .select('*')
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error || !data || data.length === 0) {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.SLOTS) || '[]') || generateDeliverySlots();
    }
    return data;
  } catch (err) {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.SLOTS) || '[]') || generateDeliverySlots();
  }
}

export async function createDeliverySlot(slotData) {
  try {
    const { data, error } = await supabase
      .from('delivery_slots')
      .insert([slotData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.SLOTS) || '[]');
    const newSlot = { id: Date.now(), ...slotData, booked: 0 };
    local.push(newSlot);
    localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(local));
    return newSlot;
  }
}

export async function updateDeliverySlot(id, slotData) {
  try {
    const { data, error } = await supabase
      .from('delivery_slots')
      .update(slotData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.SLOTS) || '[]');
    const idx = local.findIndex(s => String(s.id) === String(id));
    if (idx !== -1) {
      local[idx] = { ...local[idx], ...slotData };
      localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(local));
      return local[idx];
    }
    throw new Error('Slot not found');
  }
}

// -------------------------------------------------------------
// ADDRESSES
// -------------------------------------------------------------
export async function getAddresses(userId) {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .order('is_default', { ascending: false });

    if (error || !data || data.length === 0) {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADDRESSES) || '[]') || defaultAddresses;
    }
    return data;
  } catch (err) {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.ADDRESSES) || '[]') || defaultAddresses;
  }
}

export async function saveAddress(addressData, userId) {
  try {
    const payload = { ...addressData, user_id: userId };
    if (payload.id) {
      const { data, error } = await supabase
        .from('addresses')
        .update(payload)
        .eq('id', payload.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('addresses')
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  } catch (err) {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADDRESSES) || '[]');
    if (addressData.id) {
      const idx = local.findIndex(a => String(a.id) === String(addressData.id));
      if (idx !== -1) {
        local[idx] = { ...local[idx], ...addressData };
        localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(local));
        return local[idx];
      }
    }
    const newAddr = { id: Date.now(), user_id: userId, ...addressData };
    if (newAddr.is_default) {
      local.forEach(a => a.is_default = false);
    }
    local.unshift(newAddr);
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(local));
    return newAddr;
  }
}

export async function deleteAddress(id) {
  try {
    const { error } = await supabase.from('addresses').delete().eq('id', id);
    if (error) throw error;
    return { success: true };
  } catch (err) {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.ADDRESSES) || '[]');
    const filtered = local.filter(a => String(a.id) !== String(id));
    localStorage.setItem(STORAGE_KEYS.ADDRESSES, JSON.stringify(filtered));
    return { success: true };
  }
}

// -------------------------------------------------------------
// ORDERS
// -------------------------------------------------------------
export async function createOrder(orderPayload) {
  const {
    user_id,
    customer_name,
    customer_email,
    address_snapshot,
    slot_id,
    slot_snapshot,
    payment_method,
    items,
    subtotal,
    delivery_fee,
    tax,
    total
  } = orderPayload;

  try {
    // 1. Insert order record
    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .insert([{
        user_id: user_id || null,
        customer_name: customer_name || 'Valued Customer',
        customer_email: customer_email || 'customer@freshcart.com',
        address_snapshot,
        slot_id: slot_id || null,
        slot_snapshot,
        payment_method,
        payment_status: payment_method === 'online' ? 'paid' : 'pending',
        subtotal,
        delivery_fee,
        tax,
        total,
        status: 'Placed'
      }])
      .select()
      .single();

    if (orderErr) throw orderErr;

    // 2. Insert order items
    if (items && items.length > 0) {
      const orderItems = items.map(item => ({
        order_id: orderData.id,
        product_id: item.id || null,
        name_snapshot: item.name,
        price_snapshot: item.price,
        unit_snapshot: item.unit || '',
        image_snapshot: item.image_url || '',
        quantity: item.quantity
      }));
      await supabase.from('order_items').insert(orderItems);
    }

    // 3. Insert status history
    await supabase.from('order_status_history').insert([{
      order_id: orderData.id,
      status: 'Placed',
      notes: payment_method === 'online' ? 'Order placed and prepaid online' : 'Order placed with Cash on Delivery'
    }]);

    return { ...orderData, items };
  } catch (err) {
    // Fallback to local persistent orders
    console.warn('Supabase order insert fallback:', err.message);
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const newOrder = {
      id: Math.floor(1000 + Math.random() * 9000),
      user_id: user_id || 'customer-1',
      customer_name: customer_name || 'Sarah Johnson',
      customer_email: customer_email || 'user@freshcart.com',
      address_snapshot,
      slot_id,
      slot_snapshot,
      payment_method,
      payment_status: payment_method === 'online' ? 'paid' : 'pending',
      subtotal,
      delivery_fee,
      tax,
      total,
      status: 'Placed',
      created_at: new Date().toISOString(),
      items: items.map(item => ({
        id: Date.now() + Math.random(),
        product_id: item.id,
        name_snapshot: item.name,
        price_snapshot: item.price,
        unit_snapshot: item.unit,
        image_snapshot: item.image_url,
        quantity: item.quantity
      })),
      status_history: [
        {
          status: 'Placed',
          notes: payment_method === 'online' ? 'Order placed and prepaid online' : 'Order placed with Cash on Delivery',
          timestamp: new Date().toISOString()
        }
      ]
    };
    local.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(local));
    return newOrder;
  }
}

export async function getOrders(userId = null, isAdmin = false) {
  try {
    let query = supabase.from('orders').select('*, order_items(*), order_status_history(*)').order('created_at', { ascending: false });

    if (!isAdmin && userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error || !data || data.length === 0) {
      return getLocalOrders(userId, isAdmin);
    }

    // Format items and status_history for consistency
    return data.map(o => ({
      ...o,
      items: o.order_items || o.items || [],
      status_history: o.order_status_history || o.status_history || []
    }));
  } catch (err) {
    return getLocalOrders(userId, isAdmin);
  }
}

function getLocalOrders(userId, isAdmin) {
  const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]') || defaultOrders;
  if (isAdmin) return local;
  return local;
}

export async function getOrderById(id) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*), order_status_history(*)')
      .eq('id', id)
      .single();

    if (error || !data) {
      const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
      const found = local.find(o => String(o.id) === String(id));
      if (!found) throw new Error('Order not found');
      return found;
    }

    return {
      ...data,
      items: data.order_items || data.items || [],
      status_history: data.order_status_history || data.status_history || []
    };
  } catch (err) {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const found = local.find(o => String(o.id) === String(id));
    if (!found) throw new Error('Order not found');
    return found;
  }
}

export async function updateOrderStatus(orderId, status, notes = '') {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;

    await supabase.from('order_status_history').insert([{
      order_id: orderId,
      status,
      notes: notes || `Status updated to ${status}`
    }]);

    return data;
  } catch (err) {
    const local = JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    const idx = local.findIndex(o => String(o.id) === String(orderId));
    if (idx !== -1) {
      local[idx].status = status;
      if (!local[idx].status_history) local[idx].status_history = [];
      local[idx].status_history.push({
        status,
        notes: notes || `Status updated to ${status}`,
        timestamp: new Date().toISOString()
      });
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(local));
      return local[idx];
    }
    throw new Error('Order not found');
  }
}

export async function cancelOrder(orderId) {
  return updateOrderStatus(orderId, 'Cancelled', 'Order cancelled by customer');
}

// -------------------------------------------------------------
// ADMIN ANALYTICS
// -------------------------------------------------------------
export async function getAdminAnalytics() {
  const orders = await getOrders(null, true);
  const products = (await getProducts({ limit: 100 })).products;

  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + (parseFloat(o.total) || 0), 0);

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => ['Placed', 'Confirmed', 'Packed', 'Out for Delivery'].includes(o.status)).length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;
  const lowStockCount = products.filter(p => p.stock < 15).length;

  const statusBreakdown = {
    Placed: orders.filter(o => o.status === 'Placed').length,
    Confirmed: orders.filter(o => o.status === 'Confirmed').length,
    Packed: orders.filter(o => o.status === 'Packed').length,
    'Out for Delivery': orders.filter(o => o.status === 'Out for Delivery').length,
    Delivered: deliveredOrders,
    Cancelled: orders.filter(o => o.status === 'Cancelled').length
  };

  return {
    totalRevenue,
    totalOrders,
    pendingOrders,
    deliveredOrders,
    lowStockCount,
    statusBreakdown,
    recentOrders: orders.slice(0, 5)
  };
}
