import { z } from 'zod';
import db from '../db/index.js';

export const updateOrderStatusSchema = z.object({
  body: z.object({
    status: z.enum(['Placed', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'], {
      errorMap: () => ({ message: 'Invalid order status' })
    }),
    notes: z.string().optional(),
  })
});

export async function getAdminStats(req, res, next) {
  try {
    const todayStr = new Date().toISOString().split('T')[0];

    // Overall Totals
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    const totalRevenueRow = db.prepare("SELECT SUM(total) as revenue FROM orders WHERE status != 'Cancelled'").get();
    const totalRevenue = Math.round((totalRevenueRow.revenue || 0) * 100) / 100;

    // Today's Stats
    const todayOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE date(created_at) = ?").get(todayStr).count;
    const todayRevenueRow = db.prepare("SELECT SUM(total) as revenue FROM orders WHERE date(created_at) = ? AND status != 'Cancelled'").get(todayStr);
    const todayRevenue = Math.round((todayRevenueRow.revenue || 0) * 100) / 100;

    // Counts
    const totalUsers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'customer'").get().count;
    const totalProducts = db.prepare('SELECT COUNT(*) as count FROM products WHERE is_active = 1').get().count;
    const totalCategories = db.prepare('SELECT COUNT(*) as count FROM categories').get().count;

    // Low stock alerts (stock <= 10)
    const lowStockProducts = db.prepare(`
      SELECT p.id, p.name, p.stock, p.unit, p.price, c.name as category_name
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.stock <= 10 AND p.is_active = 1
      ORDER BY p.stock ASC
      LIMIT 10
    `).all();
    const lowStockCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE stock <= 10 AND is_active = 1').get().count;

    // Status breakdown
    const statusCountsRaw = db.prepare(`
      SELECT status, COUNT(*) as count
      FROM orders
      GROUP BY status
    `).all();

    const orderStatuses = ['Placed', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered', 'Cancelled'];
    const ordersByStatus = orderStatuses.map((st) => {
      const match = statusCountsRaw.find((r) => r.status === st);
      return { status: st, count: match ? match.count : 0 };
    });

    // Category Sales breakdown
    const categorySales = db.prepare(`
      SELECT 
        c.name as category,
        c.slug,
        COUNT(DISTINCT p.id) as product_count,
        COALESCE(SUM(oi.quantity), 0) as items_sold,
        COALESCE(ROUND(SUM(oi.price_snapshot * oi.quantity), 2), 0) as total_sales
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      LEFT JOIN order_items oi ON oi.product_id = p.id
      LEFT JOIN orders o ON o.id = oi.order_id AND o.status != 'Cancelled'
      GROUP BY c.id
      ORDER BY total_sales DESC
    `).all();

    // 7-day revenue trend for chart
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

      const dayStats = db.prepare(`
        SELECT 
          COUNT(*) as orders_count,
          COALESCE(SUM(total), 0) as revenue
        FROM orders
        WHERE date(created_at) = ? AND status != 'Cancelled'
      `).get(dateStr);

      last7Days.push({
        date: dateStr,
        label: dayLabel,
        revenue: Math.round((dayStats.revenue || 0) * 100) / 100,
        orders: dayStats.orders_count || 0
      });
    }

    // Recent orders
    const recentOrdersRaw = db.prepare(`
      SELECT 
        o.id,
        o.user_id,
        u.name as customer_name,
        u.email as customer_email,
        o.total,
        o.status,
        o.payment_method,
        o.payment_status,
        o.slot_snapshot,
        o.created_at
      FROM orders o
      JOIN users u ON u.id = o.user_id
      ORDER BY o.created_at DESC
      LIMIT 8
    `).all();

    const recentOrders = recentOrdersRaw.map((o) => {
      let parsedSlot = {};
      try { parsedSlot = JSON.parse(o.slot_snapshot); } catch {}
      return {
        ...o,
        slot: parsedSlot
      };
    });

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders,
        todayRevenue,
        todayOrders,
        totalUsers,
        totalProducts,
        totalCategories,
        lowStockCount,
        lowStockProducts,
        ordersByStatus,
        categorySales,
        last7Days,
        recentOrders
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getAllOrders(req, res, next) {
  try {
    const { status, search, date, page = 1, limit = 15 } = req.query;

    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 15));
    const offset = (parsedPage - 1) * parsedLimit;

    const conditions = [];
    const params = [];

    if (status && status !== 'all') {
      conditions.push('o.status = ?');
      params.push(status);
    }

    if (date) {
      conditions.push('date(o.created_at) = ?');
      params.push(date);
    }

    if (search && search.trim()) {
      conditions.push('(o.id = ? OR u.name LIKE ? OR u.email LIKE ?)');
      const term = `%${search.trim()}%`;
      params.push(search.trim(), term, term);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(o.id) as total
      FROM orders o
      JOIN users u ON u.id = o.user_id
      ${whereClause}
    `;
    const totalCount = db.prepare(countQuery).get(...params).total;

    const ordersQuery = `
      SELECT 
        o.*,
        u.name as customer_name,
        u.email as customer_email,
        u.phone as customer_phone,
        COUNT(oi.id) as item_count
      FROM orders o
      JOIN users u ON u.id = o.user_id
      LEFT JOIN order_items oi ON oi.order_id = o.id
      ${whereClause}
      GROUP BY o.id
      ORDER BY o.created_at DESC
      LIMIT ? OFFSET ?
    `;

    const orders = db.prepare(ordersQuery).all(...params, parsedLimit, offset);

    const formattedOrders = orders.map((order) => {
      let parsedAddress = {};
      let parsedSlot = {};
      try { parsedAddress = JSON.parse(order.address_snapshot); } catch {}
      try { parsedSlot = JSON.parse(order.slot_snapshot); } catch {}

      const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(order.id);

      return {
        id: order.id,
        userId: order.user_id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        status: order.status,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        subtotal: order.subtotal,
        deliveryFee: order.delivery_fee,
        tax: order.tax,
        total: order.total,
        address: parsedAddress,
        slot: parsedSlot,
        createdAt: order.created_at,
        itemCount: order.item_count,
        items
      };
    });

    res.json({
      success: true,
      orders: formattedOrders,
      pagination: {
        total: totalCount,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(totalCount / parsedLimit) || 1
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function updateOrderStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const order = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const previousStatus = order.status;
    if (previousStatus === status) {
      return res.json({ success: true, message: 'Order status unchanged', order });
    }

    const statusTx = db.transaction(() => {
      // 1. If transitioning to Delivered and was COD pending, mark as paid
      let newPaymentStatus = order.payment_status;
      if (status === 'Delivered' && order.payment_method === 'cod') {
        newPaymentStatus = 'paid';
      }

      // 2. If transitioning to Cancelled from non-cancelled, restore stock
      if (status === 'Cancelled' && previousStatus !== 'Cancelled') {
        const items = db.prepare('SELECT product_id, quantity FROM order_items WHERE order_id = ?').all(id);
        const restoreStock = db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?');
        for (const it of items) {
          if (it.product_id) restoreStock.run(it.quantity, it.product_id);
        }
        if (order.slot_id) {
          db.prepare('UPDATE delivery_slots SET booked = MAX(0, booked - 1) WHERE id = ?').run(order.slot_id);
        }
        if (newPaymentStatus === 'paid') {
          newPaymentStatus = 'refunded';
        }
      }

      // 3. Update order
      db.prepare(`
        UPDATE orders
        SET status = ?, payment_status = ?
        WHERE id = ?
      `).run(status, newPaymentStatus, id);

      // 4. Insert history entry
      const defaultNote = `Status updated from ${previousStatus} to ${status} by Admin`;
      db.prepare(`
        INSERT INTO order_status_history (order_id, status, notes)
        VALUES (?, ?, ?)
      `).run(id, status, notes ? notes.trim() : defaultNote);
    });

    statusTx();

    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);
    const history = db.prepare('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY timestamp ASC').all(id);

    res.json({
      success: true,
      message: `Order #${id} status updated to "${status}"!`,
      order: updated,
      history
    });
  } catch (err) {
    next(err);
  }
}
