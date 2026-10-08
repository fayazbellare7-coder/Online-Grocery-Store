import { z } from 'zod';
import db from '../db/index.js';

export const createCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    slug: z.string().min(2, 'Slug is required'),
    image: z.string().url('Image must be a valid URL').optional().or(z.literal('')),
    description: z.string().optional(),
  })
});

export const updateCategorySchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required').optional(),
    slug: z.string().min(2, 'Slug is required').optional(),
    image: z.string().url('Image must be a valid URL').optional().or(z.literal('')),
    description: z.string().optional(),
  })
});

export async function getAllCategories(req, res, next) {
  try {
    const categories = db.prepare(`
      SELECT c.*, COUNT(p.id) as product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id AND p.is_active = 1
      GROUP BY c.id
      ORDER BY c.name ASC
    `).all();

    res.json({
      success: true,
      categories
    });
  } catch (err) {
    next(err);
  }
}

export async function getCategoryByIdOrSlug(req, res, next) {
  try {
    const { idOrSlug } = req.params;
    let category;

    if (/^\d+$/.test(idOrSlug)) {
      category = db.prepare('SELECT * FROM categories WHERE id = ?').get(idOrSlug);
    } else {
      category = db.prepare('SELECT * FROM categories WHERE slug = ?').get(idOrSlug);
    }

    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({ success: true, category });
  } catch (err) {
    next(err);
  }
}

export async function createCategory(req, res, next) {
  try {
    const { name, slug, image, description } = req.body;

    const existing = db.prepare('SELECT id FROM categories WHERE slug = ? OR name = ?').get(slug, name);
    if (existing) {
      return res.status(409).json({ success: false, message: 'A category with this name or slug already exists' });
    }

    const result = db.prepare(`
      INSERT INTO categories (name, slug, image, description)
      VALUES (?, ?, ?, ?)
    `).run(name.trim(), slug.trim().toLowerCase(), image || null, description || null);

    const category = db.prepare('SELECT * FROM categories WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json({
      success: true,
      message: 'Category created successfully!',
      category
    });
  } catch (err) {
    next(err);
  }
}

export async function updateCategory(req, res, next) {
  try {
    const { id } = req.params;
    const { name, slug, image, description } = req.body;

    const existing = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    db.prepare(`
      UPDATE categories
      SET name = COALESCE(?, name),
          slug = COALESCE(?, slug),
          image = COALESCE(?, image),
          description = COALESCE(?, description)
      WHERE id = ?
    `).run(name || null, slug || null, image || null, description || null, id);

    const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Category updated successfully!',
      category: updated
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteCategory(req, res, next) {
  try {
    const { id } = req.params;

    // Check if category has associated products
    const productCount = db.prepare('SELECT COUNT(*) as count FROM products WHERE category_id = ?').get(id).count;
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category: ${productCount} products are assigned to this category. Please reassign or delete them first.`
      });
    }

    const result = db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    if (result.changes === 0) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    res.json({
      success: true,
      message: 'Category deleted successfully!'
    });
  } catch (err) {
    next(err);
  }
}
