const express = require('express');
const db = require('../db');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

const selectByDate = db.prepare(
  'SELECT id, date, time, title, description, created_at FROM events WHERE date = ? AND user_id = ? ORDER BY time ASC'
);
const insertEvent = db.prepare(
  'INSERT INTO events (date, time, title, description, user_id, created_at) VALUES (?, ?, ?, ?, ?, ?)'
);
const updateEvent = db.prepare(
  'UPDATE events SET date = ?, time = ?, title = ?, description = ? WHERE id = ? AND user_id = ?'
);
const deleteEvent = db.prepare(
  'DELETE FROM events WHERE id = ? AND user_id = ?'
);
const selectById = db.prepare(
  'SELECT id, date, time, title, description, created_at FROM events WHERE id = ? AND user_id = ?'
);

router.get('/', (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'Missing required query parameter: date' });
  }

  try {
    const events = selectByDate.all(date, req.user.id);
    res.json(events);
  } catch (error) {
    console.error('Failed to query events', error);
    res.status(500).json({ error: 'Failed to query events' });
  }
});

router.post('/', (req, res) => {
  const { date, time, title, description } = req.body;
  if (!date || !time || !title) {
    return res.status(400).json({ error: 'Missing required fields: date, time, title' });
  }

  try {
    const createdAt = Date.now();
    const result = insertEvent.run(date, time, title, description || null, req.user.id, createdAt);
    const event = selectById.get(result.lastInsertRowid, req.user.id);
    res.status(201).json(event);
  } catch (error) {
    console.error('Failed to insert event', error);
    res.status(500).json({ error: 'Failed to insert event' });
  }
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { date, time, title, description } = req.body;
  if (!date || !time || !title) {
    return res.status(400).json({ error: 'Missing required fields: date, time, title' });
  }

  try {
    const existing = selectById.get(id, req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'Event not found' });
    }

    updateEvent.run(date, time, title, description || null, id, req.user.id);
    const updated = selectById.get(id, req.user.id);
    res.json(updated);
  } catch (error) {
    console.error('Failed to update event', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const existing = selectById.get(id, req.user.id);
    if (!existing) {
      return res.status(404).json({ error: 'Event not found' });
    }

    deleteEvent.run(id, req.user.id);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete event', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
