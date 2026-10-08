import { z } from 'zod';
import db from '../db/index.js';

export const createAddressSchema = z.object({
  body: z.object({
    label: z.string().default('Home'),
    line1: z.string().min(3, 'Address line 1 is required'),
    line2: z.string().optional(),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    pincode: z.string().min(3, 'ZIP/Pincode is required'),
    is_default: z.boolean().or(z.number()).default(false),
  })
});

export const updateAddressSchema = z.object({
  body: z.object({
    label: z.string().optional(),
    line1: z.string().min(3).optional(),
    line2: z.string().optional(),
    city: z.string().min(2).optional(),
    state: z.string().min(2).optional(),
    pincode: z.string().min(3).optional(),
    is_default: z.boolean().or(z.number()).optional(),
  })
});

export async function getAddresses(req, res, next) {
  try {
    const addresses = db.prepare(`
      SELECT * FROM addresses
      WHERE user_id = ?
      ORDER BY is_default DESC, created_at DESC
    `).all(req.user.id);

    res.json({
      success: true,
      addresses
    });
  } catch (err) {
    next(err);
  }
}

export async function createAddress(req, res, next) {
  try {
    const { label, line1, line2, city, state, pincode, is_default } = req.body;
    const userId = req.user.id;

    // Check existing addresses count
    const count = db.prepare('SELECT COUNT(*) as count FROM addresses WHERE user_id = ?').get(userId).count;
    const shouldBeDefault = count === 0 || !!is_default;

    const createTx = db.transaction(() => {
      if (shouldBeDefault) {
        db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(userId);
      }

      const result = db.prepare(`
        INSERT INTO addresses (user_id, label, line1, line2, city, state, pincode, is_default)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        userId,
        label || 'Home',
        line1.trim(),
        line2 ? line2.trim() : null,
        city.trim(),
        state.trim(),
        pincode.trim(),
        shouldBeDefault ? 1 : 0
      );

      return db.prepare('SELECT * FROM addresses WHERE id = ?').get(result.lastInsertRowid);
    });

    const newAddress = createTx();

    res.status(201).json({
      success: true,
      message: 'Address saved successfully!',
      address: newAddress
    });
  } catch (err) {
    next(err);
  }
}

export async function updateAddress(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { label, line1, line2, city, state, pincode, is_default } = req.body;

    const existing = db.prepare('SELECT * FROM addresses WHERE id = ? AND user_id = ?').get(id, userId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    const updateTx = db.transaction(() => {
      if (is_default) {
        db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(userId);
      }

      db.prepare(`
        UPDATE addresses
        SET label = COALESCE(?, label),
            line1 = COALESCE(?, line1),
            line2 = COALESCE(?, line2),
            city = COALESCE(?, city),
            state = COALESCE(?, state),
            pincode = COALESCE(?, pincode),
            is_default = COALESCE(?, is_default)
        WHERE id = ? AND user_id = ?
      `).run(
        label || null,
        line1 ? line1.trim() : null,
        line2 !== undefined ? line2 : null,
        city ? city.trim() : null,
        state ? state.trim() : null,
        pincode ? pincode.trim() : null,
        is_default !== undefined ? (is_default ? 1 : 0) : null,
        id,
        userId
      );

      return db.prepare('SELECT * FROM addresses WHERE id = ?').get(id);
    });

    const updated = updateTx();

    res.json({
      success: true,
      message: 'Address updated successfully!',
      address: updated
    });
  } catch (err) {
    next(err);
  }
}

export async function setDefaultAddress(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = db.prepare('SELECT id FROM addresses WHERE id = ? AND user_id = ?').get(id, userId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    const setTx = db.transaction(() => {
      db.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').run(userId);
      db.prepare('UPDATE addresses SET is_default = 1 WHERE id = ? AND user_id = ?').run(id, userId);
    });

    setTx();

    const addresses = db.prepare('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at DESC').all(userId);

    res.json({
      success: true,
      message: 'Default address updated!',
      addresses
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteAddress(req, res, next) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = db.prepare('SELECT * FROM addresses WHERE id = ? AND user_id = ?').get(id, userId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    const deleteTx = db.transaction(() => {
      db.prepare('DELETE FROM addresses WHERE id = ? AND user_id = ?').run(id, userId);

      // If deleted address was default, make the next one default
      if (existing.is_default === 1) {
        const remaining = db.prepare('SELECT id FROM addresses WHERE user_id = ? ORDER BY created_at DESC LIMIT 1').get(userId);
        if (remaining) {
          db.prepare('UPDATE addresses SET is_default = 1 WHERE id = ?').run(remaining.id);
        }
      }
    });

    deleteTx();

    res.json({
      success: true,
      message: 'Address deleted successfully!'
    });
  } catch (err) {
    next(err);
  }
}
