import db from '../db/index.js';

export async function getWishlist(req, res, next) {
  try {
    const userId = req.user.id;

    const items = db.prepare(`
      SELECT 
        w.id as wishlist_item_id,
        w.created_at as added_at,
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        ROUND(p.price * (1 - p.discount_percent / 100.0), 2) as final_price
      FROM wishlist_items w
      JOIN products p ON p.id = w.product_id
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE w.user_id = ?
      ORDER BY w.created_at DESC
    `).all(userId);

    res.json({
      success: true,
      items
    });
  } catch (err) {
    next(err);
  }
}

export async function toggleWishlist(req, res, next) {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    const product = db.prepare('SELECT id, name FROM products WHERE id = ?').get(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const existing = db.prepare('SELECT id FROM wishlist_items WHERE user_id = ? AND product_id = ?').get(userId, productId);

    let isWishlisted = false;
    if (existing) {
      db.prepare('DELETE FROM wishlist_items WHERE id = ?').run(existing.id);
      isWishlisted = false;
    } else {
      db.prepare('INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)').run(userId, productId);
      isWishlisted = true;
    }

    res.json({
      success: true,
      message: isWishlisted ? `Added ${product.name} to wishlist` : `Removed ${product.name} from wishlist`,
      isWishlisted
    });
  } catch (err) {
    next(err);
  }
}

export async function removeFromWishlist(req, res, next) {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    db.prepare('DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?').run(userId, productId);

    res.json({
      success: true,
      message: 'Item removed from wishlist'
    });
  } catch (err) {
    next(err);
  }
}
