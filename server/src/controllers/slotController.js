import { z } from 'zod';
import db from '../db/index.js';

export const updateCapacitySchema = z.object({
  body: z.object({
    capacity: z.number().int().min(1, 'Capacity must be at least 1'),
  })
});

const STANDARD_SLOT_WINDOWS = [
  { start_time: '08:00', end_time: '10:00', label: '8:00 AM - 10:00 AM (Morning)' },
  { start_time: '10:00', end_time: '12:00', label: '10:00 AM - 12:00 PM (Midday)' },
  { start_time: '16:00', end_time: '18:00', label: '4:00 PM - 6:00 PM (Evening)' },
  { start_time: '18:00', end_time: '20:00', label: '6:00 PM - 8:00 PM (Night)' }
];

export function ensureSlotsForDate(dateStr) {
  const insertSlot = db.prepare(`
    INSERT OR IGNORE INTO delivery_slots (date, start_time, end_time, capacity, booked)
    VALUES (?, ?, ?, 10, 0)
  `);

  for (const win of STANDARD_SLOT_WINDOWS) {
    insertSlot.run(dateStr, win.start_time, win.end_time);
  }
}

export async function getDeliverySlots(req, res, next) {
  try {
    const { date } = req.query;

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();

    let targetDates = [];

    if (date) {
      targetDates = [date];
      ensureSlotsForDate(date);
    } else {
      // Return next 7 days
      for (let i = 0; i < 7; i++) {
        const d = new Date(now);
        d.setDate(now.getDate() + i);
        const dStr = d.toISOString().split('T')[0];
        targetDates.push(dStr);
        ensureSlotsForDate(dStr);
      }
    }

    const placeholders = targetDates.map(() => '?').join(',');
    const slots = db.prepare(`
      SELECT * FROM delivery_slots
      WHERE date IN (${placeholders})
      ORDER BY date ASC, start_time ASC
    `).all(...targetDates);

    const formattedSlots = slots.map((slot) => {
      const isToday = slot.date === todayStr;
      const [slotEndHour, slotEndMin] = slot.end_time.split(':').map(Number);

      const isPast = isToday && (slotEndHour < currentHour || (slotEndHour === currentHour && slotEndMin <= currentMin));
      const isFull = slot.booked >= slot.capacity;
      const isAvailable = !isPast && !isFull;

      const windowObj = STANDARD_SLOT_WINDOWS.find((w) => w.start_time === slot.start_time) || {};

      return {
        id: slot.id,
        date: slot.date,
        startTime: slot.start_time,
        endTime: slot.end_time,
        formattedWindow: `${slot.start_time} - ${slot.end_time}`,
        label: windowObj.label || `${slot.start_time} - ${slot.end_time}`,
        capacity: slot.capacity,
        booked: slot.booked,
        remainingCapacity: Math.max(0, slot.capacity - slot.booked),
        isPast,
        isFull,
        isAvailable
      };
    });

    // Group by date for frontend UI ease
    const slotsByDate = {};
    for (const slot of formattedSlots) {
      if (!slotsByDate[slot.date]) {
        slotsByDate[slot.date] = [];
      }
      slotsByDate[slot.date].push(slot);
    }

    res.json({
      success: true,
      slots: formattedSlots,
      slotsByDate
    });
  } catch (err) {
    next(err);
  }
}

export async function updateSlotCapacity(req, res, next) {
  try {
    const { id } = req.params;
    const { capacity } = req.body;

    const existing = db.prepare('SELECT id, booked FROM delivery_slots WHERE id = ?').get(id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Delivery slot not found' });
    }

    db.prepare('UPDATE delivery_slots SET capacity = ? WHERE id = ?').run(capacity, id);

    const updated = db.prepare('SELECT * FROM delivery_slots WHERE id = ?').get(id);

    res.json({
      success: true,
      message: 'Slot capacity updated successfully!',
      slot: updated
    });
  } catch (err) {
    next(err);
  }
}
