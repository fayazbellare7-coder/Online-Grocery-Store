import { z } from 'zod';
import { config } from '../config/index.js';
import db from '../db/index.js';

export const addToCartSchema = z.object({
  body: z.object({
    productId: z.number().int().positive('Product ID is required'),
    quantity: z.number().int().positive('Quantity must be at least 1').default(1),
  })
});

export const updateCartItemSchema = z.object({
  body: z.object({
    quantity: z.number().int().min(0, 'Quantity cannot be negative'),
  })
});

export const mergeCartSchema = z.object({
  body: z.object({
    items: z.array(
      z.object({
        productId: z.number().int().positive(),
        quantity: z.number().int().positive(),
      })
    ).default([]),
  })
});

export function computeCartSummary(userId) {
  const items = db.prepare(`
    SELECT 
      ci.id as cart_item_id,
      ci.quantity,
      p.id as product_id,
      p.name,
      p.unit,
      p.image_url,
      p.price as original_price,
      p.discount_percent,
      p.stock,
      p.is_active,
      ROUND(p.price * (1 - p.discount_percent / 100.0), 2) as unit_price
    FROM cart_items ci
    JOIN products p ON p.id = ci.product_id
    WHERE ci.user_id = ?
    ORDER BY ci.created_at DESC
  `).all(userId);

  let subtotal = 0;
  let originalSubtotal = 0;
  let totalItemsCount = 0;

  const formattedItems = items.map((item) => {
    const itemTotal = Math.round(item.unit_price * item.quantity * 100) / 100;
    const originalItemTotal = Math.round(item.original_price * item.quantity * 100) / 100;

    subtotal += itemTotal;
    originalSubtotal += originalItemTotal;
    totalItemsCount += item.quantity;

    return {
      id: item.cart_item_id,
      productId: item.product_id,
      name: item.name,
      unit: item.unit,
      imageUrl: item.image_url,
      originalPrice: item.original_price,
      discountPercent: item.discount_percent,
      unitPrice: item.unit_price,
      quantity: item.quantity,
      itemTotal,
      stock: item.stock,
      isActive: item.is_active === 1,
      isOutOfStock: item.stock <= 0 || item.is_active !== 1,
      exceedsStock: item.quantity > item.stock
    };
  });

  subtotal = Math.round(subtotal * 100) / 100;
  originalSubtotal = Math.round(originalSubtotal * 100) / 100;
  const savings = Math.round((originalSubtotal - subtotal) * 100) / 100;

  const freeDeliveryThreshold = config.freeDeliveryThreshold;
  const deliveryFee = subtotal === 0 || subtotal >= freeDeliveryThreshold ? 0.0 : config.standardDeliveryFee;
  const amountNeededForFreeDelivery = subtotal === 0 ? freeDeliveryThreshold : Math.max(0, Math.round((freeDeliveryThreshold - subtotal) * 100) / 100);

  const tax = Math.round(subtotal * config.taxRate * 100) / 100;
  const total = Math.round((subtotal + deliveryFee + tax) * 100) / 100;

  return {
    items: formattedItems,
    summary: {
      subtotal,
      originalSubtotal,
      savings,
      deliveryFee,
      freeDeliveryThreshold,
      amountNeededForFreeDelivery,
      isFreeDelivery: deliveryFee === 0 && subtotal > 0,
      tax,
      taxRate: config.taxRate,
      total,
      itemCount: totalItemsCount
    }
  };
}

export async function getCart(req, res, next) {
  try {
    const cartData = computeCartSummary(req.user.id);
    res.json({
      success: true,
      ...cartData
    });
  } catch (err) {
    next(err);
  }
}

export async function addToCart(req, res, next) {
  try {
    const { productId, quantity = 1 } = req.body;
    const userId = req.user.id;

    // Check product
    const product = db.prepare('SELECT id, name, stock, is_active FROM products WHERE id = ?').get(productId);
    if (!product || product.is_active !== 1) {
      return res.status(404).json({ success: false, message: 'Product not found or is inactive' });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ success: false, message: `${product.name} is currently out of stock.` });
    }

    const existingCartItem = db.prepare('SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?').get(userId, productId);

    let newQuantity = quantity;
    if (existingCartItem) {
      newQuantity = existingCartItem.quantity + quantity;
      if (newQuantity > product.stock) {
        newQuantity = product.stock; // Cap at max available stock
      }
      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(newQuantity, existingCartItem.id);
    } else {
      if (newQuantity > product.stock) {
        newQuantity = product.stock;
      }
      db.prepare('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)').run(userId, productId, newQuantity);
    }

    const cartData = computeCartSummary(userId);
    res.json({
      success: true,
      message: `Added ${product.name} to cart!`,
      ...cartData
    });
  } catch (err) {
    next(err);
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const userId = req.user.id;

    // Check item belongs to user
    const cartItem = db.prepare(`
      SELECT ci.id, ci.product_id, p.name, p.stock, p.is_active
      FROM cart_items ci
      JOIN products p ON p.id = ci.product_id
      WHERE ci.id = ? AND ci.user_id = ?
    `).get(itemId, userId);

    if (!cartItem) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    if (quantity <= 0) {
      db.prepare('DELETE FROM cart_items WHERE id = ?').run(itemId);
    } else {
      if (quantity > cartItem.stock) {
        return res.status(400).json({
          success: false,
          message: `Only ${cartItem.stock} units of ${cartItem.name} are available in stock.`
        });
      }
      db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(quantity, itemId);
    }

    const cartData = computeCartSummary(userId);
    res.json({
      success: true,
      message: 'Cart updated',
      ...cartData
    });
  } catch (err) {
    next(err);
  }
}

export async function removeCartItem(req, res, next) {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;

    const result = db.prepare('DELETE FROM cart_items WHERE id = ? AND user_id = ?').run(itemId, userId);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Cart item not found' });
    }

    const cartData = computeCartSummary(userId);
    res.json({
      success: true,
      message: 'Item removed from cart',
      ...cartData
    });
  } catch (err) {
    next(err);
  }
}

export async function clearCart(req, res, next) {
  try {
    const userId = req.user.id;
    db.prepare('DELETE FROM cart_items WHERE user_id = ?').run(userId);

    const cartData = computeCartSummary(userId);
    res.json({
      success: true,
      message: 'Cart cleared successfully',
      ...cartData
    });
  } catch (err) {
    next(err);
  }
}

export async function mergeCart(req, res, next) {
  try {
    const { items = [] } = req.body;
    const userId = req.user.id;

    const upsert = db.transaction((guestItems) => {
      for (const item of guestItems) {
        const product = db.prepare('SELECT id, stock, is_active FROM products WHERE id = ?').get(item.productId);
        if (!product || product.is_active !== 1 || product.stock <= 0) continue;

        const existing = db.prepare('SELECT id, quantity FROM cart_items WHERE user_id = ? AND product_id = ?').get(userId, item.productId);
        if (existing) {
          const mergedQty = Math.min(product.stock, existing.quantity + item.quantity);
          db.prepare('UPDATE cart_items SET quantity = ? WHERE id = ?').run(mergedQty, existing.id);
        } else {
          const qty = Math.min(product.stock, item.quantity);
          db.prepare('INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)').run(userId, item.productId, qty);
        }
      }
    });

    upsert(items);

    const cartData = computeCartSummary(userId);
    res.json({
      success: true,
      message: 'Cart synced successfully',
      ...cartData
    });
  } catch (err) {
    next(err);
  }
}
