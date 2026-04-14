const express = require('express');
const db = require('../db');

const router = express.Router();

const selectByDate = db.prepare(
  'SELECT id, date, time, title, description, created_at FROM events WHERE date = ? ORDER BY time ASC'
);
const insertEvent = db.prepare(
  'INSERT INTO events (date, time, title, description, created_at) VALUES (?, ?, ?, ?, ?)'
);
const updateEvent = db.prepare(
  'UPDATE events SET date = ?, time = ?, title = ?, description = ? WHERE id = ?'
);
const deleteEvent = db.prepare(
  'DELETE FROM events WHERE id = ?'
);
const selectById = db.prepare(
  'SELECT id, date, time, title, description, created_at FROM events WHERE id = ?'
);

router.get('/', (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: 'Missing required query parameter: date' });
  }

  try {
    const events = selectByDate.all(date);
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
    const result = insertEvent.run(date, time, title, description || null, createdAt);
    const event = selectById.get(result.lastInsertRowid);
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
    const existing = selectById.get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Event not found' });
    }

    updateEvent.run(date, time, title, description || null, id);
    const updated = selectById.get(id);
    res.json(updated);
  } catch (error) {
    console.error('Failed to update event', error);
    res.status(500).json({ error: 'Failed to update event' });
  }
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  try {
    const existing = selectById.get(id);
    if (!existing) {
      return res.status(404).json({ error: 'Event not found' });
    }

    deleteEvent.run(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete event', error);
    res.status(500).json({ error: 'Failed to delete event' });
  }
});

module.exports = router;
