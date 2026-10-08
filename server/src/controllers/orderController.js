import { z } from 'zod';
import { config } from '../config/index.js';
import db from '../db/index.js';
import { computeCartSummary } from './cartController.js';

export const placeOrderSchema = z.object({
  body: z.object({
    addressId: z.number().int().positive('Delivery address is required'),
    slotId: z.number().int().positive('Delivery slot is required'),
    paymentMethod: z.enum(['cod', 'online'], {
      errorMap: () => ({ message: 'Payment method must be Cash on Delivery (cod) or Online (online)' })
    }),
    paymentSuccess: z.boolean().optional().default(true), // Mock online payment simulator toggle
  })
});

export const cancelOrderSchema = z.object({
  body: z.object({
    reason: z.string().optional().default('Cancelled by customer'),
  })
});

export const rescheduleOrderSchema = z.object({
  body: z.object({
    newSlotId: z.number().int().positive('New delivery slot ID is required'),
  })
});

export async function placeOrder(req, res, next) {
  try {
    const { addressId, slotId, paymentMethod, paymentSuccess = true } = req.body;
    const userId = req.user.id;

    // Check online payment mock failure
    if (paymentMethod === 'online' && !paymentSuccess) {
      return res.status(400).json({
        success: false,
        message: 'Mock Payment Failed! The simulated card/UPI transaction was declined by bank.'
      });
    }

    // 1. Fetch address
    const address = db.prepare('SELECT * FROM addresses WHERE id = ? AND user_id = ?').get(addressId, userId);
    if (!address) {
      return res.status(400).json({ success: false, message: 'Invalid delivery address selected' });
    }

    // 2. Fetch and validate delivery slot
    const slot = db.prepare('SELECT * FROM delivery_slots WHERE id = ?').get(slotId);
    if (!slot) {
      return res.status(400).json({ success: false, message: 'Invalid delivery slot selected' });
    }
    if (slot.booked >= slot.capacity) {
      return res.status(400).json({ success: false, message: 'Selected delivery slot is fully booked. Please choose another time.' });
    }

    // 3. Compute cart items and verify stock
    const cartData = computeCartSummary(userId);
    if (cartData.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty. Please add products before checking out.' });
    }

    // Check for stock insufficiency or inactive products
    for (const item of cartData.items) {
      if (item.isOutOfStock || item.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Cannot place order: "${item.name}" only has ${item.stock} in stock (you requested ${item.quantity}). Please adjust your cart.`
        });
      }
    }

    const { subtotal, deliveryFee, tax, total } = cartData.summary;

    const addressSnapshot = JSON.stringify({
      id: address.id,
      label: address.label,
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      pincode: address.pincode
    });

    const slotSnapshot = JSON.stringify({
      id: slot.id,
      date: slot.date,
      startTime: slot.start_time,
      endTime: slot.end_time,
      window: `${slot.start_time} - ${slot.end_time}`
    });

    const paymentStatus = paymentMethod === 'online' ? 'paid' : 'pending';

    // Execute atomic transaction for placing order
    const orderTx = db.transaction(() => {
      // 1. Insert order
      const orderInsert = db.prepare(`
        INSERT INTO orders (
          user_id, address_snapshot, slot_id, slot_snapshot,
          payment_method, payment_status, subtotal, delivery_fee, tax, total, status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Placed')
      `).run(
        userId,
        addressSnapshot,
        slot.id,
        slotSnapshot,
        paymentMethod,
        paymentStatus,
        subtotal,
        deliveryFee,
        tax,
        total
      );

      const orderId = orderInsert.lastInsertRowid;

      // 2. Insert order items & decrement product stock
      const insertOrderItem = db.prepare(`
        INSERT INTO order_items (
          order_id, product_id, name_snapshot, price_snapshot, unit_snapshot, image_snapshot, quantity
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `);

      const decrementStock = db.prepare(`
        UPDATE products
        SET stock = stock - ?
        WHERE id = ?
      `);

      for (const item of cartData.items) {
        insertOrderItem.run(
          orderId,
          item.productId,
          item.name,
          item.unitPrice,
          item.unit,
          item.imageUrl,
          item.quantity
        );

        decrementStock.run(item.quantity, item.productId);
      }

      // 3. Increment slot booked count
      db.prepare('UPDATE delivery_slots SET booked = booked + 1 WHERE id = ?').run(slot.id);

      // 4. Record status history
      db.prepare(`
        INSERT INTO order_status_history (order_id, status, notes)
        VALUES (?, 'Placed', ?)
      `).run(orderId, paymentMethod === 'online' ? 'Prepaid online via instant payment' : 'Order placed with Cash on Delivery');

      // 5. Clear user cart
      db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);

      return orderId;
    });

    const orderId = orderTx();

    const createdOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(orderId);
    const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(orderId);

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! 🎉',
      order: {
        ...createdOrder,
        addressSnapshot: JSON.parse(createdOrder.address_snapshot),
        slotSnapshot: JSON.parse(createdOrder.slot_snapshot),
        items: orderItems
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function getMyOrders(req, res, next) {
  try {
    const userId = req.user.id;

    const orders = db.prepare(`
      SELECT 
        o.*,
        COUNT(oi.id) as item_count
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.user_id = ?
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `).all(userId);

    const formattedOrders = orders.map((order) => {
      let parsedAddress = {};
      let parsedSlot = {};
      try {
        parsedAddress = JSON.parse(order.address_snapshot);
      } catch {}
      try {
        parsedSlot = JSON.parse(order.slot_snapshot);
      } catch {}

      // Get brief preview items
      const previewItems = db.prepare(`
        SELECT name_snapshot, quantity, price_snapshot, image_snapshot, unit_snapshot
        FROM order_items
        WHERE order_id = ?
        LIMIT 4
      `).all(order.id);

      return {
        id: order.id,
        status: order.status,
        total: order.total,
        subtotal: order.subtotal,
        deliveryFee: order.delivery_fee,
        tax: order.tax,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        address: parsedAddress,
        slot: parsedSlot,
        createdAt: order.created_at,
        itemCount: order.item_count,
        previewItems
      };
    });

    res.json({
      success: true,
      orders: formattedOrders
    });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    let orderQuery = 'SELECT o.*, u.name as customer_name, u.email as customer_email, u.phone as customer_phone FROM orders o JOIN users u ON u.id = o.user_id WHERE o.id = ?';
    const params = [id];

    if (!isAdmin) {
      orderQuery += ' AND o.user_id = ?';
      params.push(userId);
    }

    const order = db.prepare(orderQuery).get(...params);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const items = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(id);
    const history = db.prepare('SELECT * FROM order_status_history WHERE order_id = ? ORDER BY timestamp ASC, id ASC').all(id);

    let parsedAddress = {};
    let parsedSlot = {};
    try {
      parsedAddress = JSON.parse(order.address_snapshot);
    } catch {}
    try {
      parsedSlot = JSON.parse(order.slot_snapshot);
    } catch {}

    // Compute active timeline index: Placed (0) -> Confirmed (1) -> Packed (2) -> Out for Delivery (3) -> Delivered (4)
    const timelineStages = ['Placed', 'Confirmed', 'Packed', 'Out for Delivery', 'Delivered'];
    const currentStageIndex = timelineStages.indexOf(order.status);

    const isCancellable = ['Placed', 'Confirmed'].includes(order.status);
    const isReschedulable = ['Placed', 'Confirmed', 'Packed'].includes(order.status);

    res.json({
      success: true,
      order: {
        id: order.id,
        userId: order.user_id,
        customerName: order.customer_name,
        customerEmail: order.customer_email,
        customerPhone: order.customer_phone,
        status: order.status,
        currentStageIndex,
        isCancellable,
        isReschedulable,
        paymentMethod: order.payment_method,
        paymentStatus: order.payment_status,
        subtotal: order.subtotal,
        deliveryFee: order.delivery_fee,
        tax: order.tax,
        total: order.total,
        address: parsedAddress,
        slot: parsedSlot,
        createdAt: order.created_at,
        items,
        history
      }
    });
  } catch (err) {
    next(err);
  }
}

export async function cancelOrder(req, res, next) {
  try {
    const { id } = req.params;
    const { reason = 'Customer requested cancellation' } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    let orderQuery = 'SELECT * FROM orders WHERE id = ?';
    const params = [id];
    if (!isAdmin) {
      orderQuery += ' AND user_id = ?';
      params.push(userId);
    }

    const order = db.prepare(orderQuery).get(...params);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status === 'Cancelled') {
      return res.status(400).json({ success: false, message: 'Order is already cancelled' });
    }

    if (!['Placed', 'Confirmed'].includes(order.status) && !isAdmin) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled in "${order.status}" status. Orders can only be cancelled before packing.`
      });
    }

    const cancelTx = db.transaction(() => {
      // 1. Update order status
      db.prepare("UPDATE orders SET status = 'Cancelled', payment_status = CASE WHEN payment_status = 'paid' THEN 'refunded' ELSE payment_status END WHERE id = ?").run(id);

      // 2. Restore product stock
      const items = db.prepare('SELECT product_id, quantity FROM order_items WHERE order_id = ?').all(id);
      const restoreStock = db.prepare('UPDATE products SET stock = stock + ? WHERE id = ?');

      for (const item of items) {
        if (item.product_id) {
          restoreStock.run(item.quantity, item.product_id);
        }
      }

      // 3. Decrement slot booked count
      if (order.slot_id) {
        db.prepare('UPDATE delivery_slots SET booked = MAX(0, booked - 1) WHERE id = ?').run(order.slot_id);
      }

      // 4. Add cancellation to history
      db.prepare(`
        INSERT INTO order_status_history (order_id, status, notes)
        VALUES (?, 'Cancelled', ?)
      `).run(id, reason);
    });

    cancelTx();

    res.json({
      success: true,
      message: 'Order has been successfully cancelled and stock restored.'
    });
  } catch (err) {
    next(err);
  }
}

export async function rescheduleOrder(req, res, next) {
  try {
    const { id } = req.params;
    const { newSlotId } = req.body;
    const userId = req.user.id;
    const isAdmin = req.user.role === 'admin';

    let orderQuery = 'SELECT * FROM orders WHERE id = ?';
    const params = [id];
    if (!isAdmin) {
      orderQuery += ' AND user_id = ?';
      params.push(userId);
    }

    const order = db.prepare(orderQuery).get(...params);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!['Placed', 'Confirmed', 'Packed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot reschedule delivery when order is already "${order.status}".`
      });
    }

    const newSlot = db.prepare('SELECT * FROM delivery_slots WHERE id = ?').get(newSlotId);
    if (!newSlot) {
      return res.status(400).json({ success: false, message: 'Invalid delivery slot selected' });
    }

    if (newSlot.booked >= newSlot.capacity) {
      return res.status(400).json({ success: false, message: 'The selected delivery slot is full. Please pick another slot.' });
    }

    const newSlotSnapshot = JSON.stringify({
      id: newSlot.id,
      date: newSlot.date,
      startTime: newSlot.start_time,
      endTime: newSlot.end_time,
      window: `${newSlot.start_time} - ${newSlot.end_time}`
    });

    const rescheduleTx = db.transaction(() => {
      // 1. Release old slot
      if (order.slot_id) {
        db.prepare('UPDATE delivery_slots SET booked = MAX(0, booked - 1) WHERE id = ?').run(order.slot_id);
      }
      // 2. Book new slot
      db.prepare('UPDATE delivery_slots SET booked = booked + 1 WHERE id = ?').run(newSlotId);

      // 3. Update order
      db.prepare('UPDATE orders SET slot_id = ?, slot_snapshot = ? WHERE id = ?').run(newSlotId, newSlotSnapshot, id);

      // 4. History entry
      db.prepare(`
        INSERT INTO order_status_history (order_id, status, notes)
        VALUES (?, ?, ?)
      `).run(id, order.status, `Delivery rescheduled to ${newSlot.date} (${newSlot.start_time} - ${newSlot.end_time})`);
    });

    rescheduleTx();

    res.json({
      success: true,
      message: `Delivery rescheduled to ${newSlot.date} (${newSlot.start_time} - ${newSlot.end_time})!`,
      slotSnapshot: JSON.parse(newSlotSnapshot)
    });
  } catch (err) {
    next(err);
  }
}

export async function reorder(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = db.prepare('SELECT id FROM orders WHERE id = ? AND user_id = ?').get(id, userId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const items = db.prepare('SELECT product_id, quantity FROM order_items WHERE order_id = ?').all(id);
    let addedCount = 0;

    const reorderTx = db.transaction(() => {
      for (const item of items) {
        if (!item.product_id) continue;

        const product = db.prepare('SELECT id, stock, is_active FROM products WHERE id = ?').get(item.product_id);
        if (!product || product.is_active !== 1 || product.stock <= 0) continue;

        const existing = db.prepare('SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?').get(userId, item.product_id);
        if (existing) {
          const newQty = Math.min(product.stock, existing.quantity + item.quantity);
          db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(newQty, existing.id);
        } else {
          const newQty = Math.min(product.stock, item.quantity);
          db.prepare('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)').run(userId, item.product_id, newQty);
        }
        addedCount++;
      }
    });

    reorderTx();

    const cartData = computeCartSummary(userId);

    res.json({
      success: true,
      message: `Added ${addedCount} items from past order to your cart!`,
      ...cartData
    });
  } catch (err) {
    next(err);
  }
}
