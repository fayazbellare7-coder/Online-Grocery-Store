import { z } from 'zod';
import db from '../db/index.js';

export const createProductSchema = z.object({
  body: z.object({
    category_id: z.number().int().positive('Valid category ID required'),
    name: z.string().min(2, 'Product name is required'),
    description: z.string().optional(),
    price: z.number().positive('Price must be greater than 0'),
    discount_percent: z.number().min(0).max(100).default(0),
    unit: z.string().min(1, 'Unit/weight description is required (e.g. 1 kg, 500 g)'),
    stock: z.number().int().min(0).default(0),
    image_url: z.string().url('Image URL must be valid').optional().or(z.literal('')),
    is_active: z.number().int().min(0).max(1).default(1),
  })
});

export const updateProductSchema = z.object({
  body: z.object({
    category_id: z.number().int().positive().optional(),
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    price: z.number().positive().optional(),
    discount_percent: z.number().min(0).max(100).optional(),
    unit: z.string().min(1).optional(),
    stock: z.number().int().min(0).optional(),
    image_url: z.string().url().optional().or(z.literal('')),
    is_active: z.number().int().min(0).max(1).optional(),
  })
});

export const updateStockSchema = z.object({
  body: z.object({
    stock: z.number().int().min(0, 'Stock cannot be negative'),
  })
});

export async function getAllProducts(req, res, next) {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      inStock,
      deals,
      sort = 'newest',
      page = 1,
      limit = 12,
      includeInactive = false
    } = req.query;

    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
    const offset = (parsedPage - 1) * parsedLimit;

    const conditions = [];
    const params = [];

    // Filter by active status unless admin explicitly requested inactive products
    if (!includeInactive) {
      conditions.push('p.is_active = 1');
    }

    // Search filter
    if (search && search.trim()) {
      conditions.push('(p.name LIKE ? OR p.description LIKE ? OR c.name LIKE ?)');
      const searchTerm = `%${search.trim()}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Category filter
    if (category && category.trim()) {
      if (/^\d+$/.test(category)) {
        conditions.push('p.category_id = ?');
        params.push(parseInt(category, 10));
      } else {
        conditions.push('c.slug = ?');
        params.push(category.trim());
      }
    }

    // Price filter (on final effective discounted price)
    if (minPrice !== undefined && minPrice !== '') {
      conditions.push('(p.price * (1 - p.discount_percent / 100.0)) >= ?');
      params.push(parseFloat(minPrice));
    }
    if (maxPrice !== undefined && maxPrice !== '') {
      conditions.push('(p.price * (1 - p.discount_percent / 100.0)) <= ?');
      params.push(parseFloat(maxPrice));
    }

    // In stock filter
    if (inStock === 'true' || inStock === '1' || inStock === true) {
      conditions.push('p.stock > 0');
    }

    // Deals / Discount filter
    if (deals === 'true' || deals === '1' || deals === true) {
      conditions.push('p.discount_percent > 0');
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sort clause
    let orderByClause = 'ORDER BY p.id DESC';
    switch (sort) {
      case 'price_asc':
        orderByClause = 'ORDER BY (p.price * (1 - p.discount_percent / 100.0)) ASC';
        break;
      case 'price_desc':
        orderByClause = 'ORDER BY (p.price * (1 - p.discount_percent / 100.0)) DESC';
        break;
      case 'name_asc':
        orderByClause = 'ORDER BY p.name ASC';
        break;
      case 'name_desc':
        orderByClause = 'ORDER BY p.name DESC';
        break;
      case 'discount_desc':
        orderByClause = 'ORDER BY p.discount_percent DESC';
        break;
      case 'popular':
        orderByClause = 'ORDER BY p.stock ASC, p.id DESC';
        break;
      case 'newest':
      default:
        orderByClause = 'ORDER BY p.id DESC';
        break;
    }

    // Get total count
    const countQuery = `
      SELECT COUNT(p.id) as total
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ${whereClause}
    `;
    const totalCount = db.prepare(countQuery).get(...params).total;

    // Fetch paginated products
    const productsQuery = `
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        ROUND(p.price * (1 - p.discount_percent / 100.0), 2) as final_price
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      ${whereClause}
      ${orderByClause}
      LIMIT ? OFFSET ?
    `;

    const products = db.prepare(productsQuery).all(...params, parsedLimit, offset);

    res.json({
      success: true,
      products,
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

export async function getProductById(req, res, next) {
  try {
    const { id } = req.params;

    const product = db.prepare(`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        ROUND(p.price * (1 - p.discount_percent / 100.0), 2) as final_price
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = ?
    `).get(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch related products from same category
    const relatedProducts = db.prepare(`
      SELECT 
        p.*,
        c.name as category_name,
        c.slug as category_slug,
        ROUND(p.price * (1 - p.discount_percent / 100.0), 2) as final_price
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.category_id = ? AND p.id != ? AND p.is_active = 1
      ORDER BY RANDOM()
      LIMIT 4
    `).all(product.category_id, product.id);

    res.json({
      success: true,
      product,
      relatedProducts
    });
  } catch (err) {
    next(err);
  }
}

export async function createProduct(req, res, next) {
  try {
    const {
      category_id,
      name,
      description,
      price,
      discount_percent = 0,
      unit,
      stock = 0,
      image_url,
      is_active = 1
    } = req.body;

    // Check category exists
    const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(category_id);
    if (!category) {
      return res.status(400).json({ success: false, message: 'Invalid category ID' });
    }

    const result = db.prepare(`
      INSERT INTO products (category_id, name, description, price, discount_percent, unit, stock, image_url, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      category_id,
      name.trim(),
      description ? description.trim() : null,
      price,
      discount_percent,
      unit.trim(),
      stock,
      image_url ? image_url.trim() : null,
      is_active
    );

    const product = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             ROUND(p.price * (1 - p.discount_percent / 100.0), 2) as final_price
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = ?
    `).get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Product created successfully!',
      product
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const { id } = req.params;
    const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const {
      category_id,
      name,
      description,
      price,
      discount_percent,
      unit,
      stock,
      image_url,
      is_active
    } = req.body;

    if (category_id) {
      const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(category_id);
      if (!category) {
        return res.status(400).json({ success: false, message: 'Invalid category ID' });
      }
    }

    db.prepare(`
      UPDATE products
      SET category_id = COALESCE(?, category_id),
          name = COALESCE(?, name),
          description = COALESCE(?, description),
          price = COALESCE(?, price),
          discount_percent = COALESCE(?, discount_percent),
          unit = COALESCE(?, unit),
          stock = COALESCE(?, stock),
          image_url = COALESCE(?, image_url),
          is_active = COALESCE(?, is_active)
      WHERE id = ?
    `).run(
      category_id || null,
      name ? name.trim() : null,
      description !== undefined ? description : null,
      price !== undefined ? price : null,
      discount_percent !== undefined ? discount_percent : null,
      unit ? unit.trim() : null,
      stock !== undefined ? stock : null,
      image_url !== undefined ? image_url : null,
      is_active !== undefined ? is_active : null,
      id
    );

    const product = db.prepare(`
      SELECT p.*, c.name as category_name, c.slug as category_slug,
             ROUND(p.price * (1 - p.discount_percent / 100.0), 2) as final_price
      FROM products p
      LEFT JOIN categories c ON c.id = p.category_id
      WHERE p.id = ?
    `).get(id);

    res.json({
      success: true,
      message: 'Product updated successfully!',
      product
    });
  } catch (err) {
    next(err);
  }
}

export async function updateProductStock(req, res, next) {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const existing = db.prepare('SELECT id FROM products WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    db.prepare('UPDATE products SET stock = ? WHERE id = ?').run(stock, id);

    const product = db.prepare('SELECT id, name, stock FROM products WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Stock updated successfully!',
      product
    });
  } catch (err) {
    next(err);
  }
}

export async function toggleProductActive(req, res, next) {
  try {
    const { id } = req.params;
    const product = db.prepare('SELECT id, is_active FROM products WHERE id = ?').get(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const nextState = product.is_active === 1 ? 0 : 1;
    db.prepare('UPDATE products SET is_active = ? WHERE id = ?').run(nextState, id);

    res.json({
      success: true,
      message: `Product is now ${nextState === 1 ? 'Active' : 'Inactive'}`,
      is_active: nextState
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM products WHERE id = ?').run(id);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully!'
    });
  } catch (err) {
    next(err);
  }
}
