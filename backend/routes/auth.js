const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

const insertUser = db.prepare(
  'INSERT INTO users (username, password, created_at) VALUES (?, ?, ?)'
);
const findUserByUsername = db.prepare(
  'SELECT id, username, password FROM users WHERE username = ?'
);

router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing required fields: username, password' });
  }

  try {
    const existing = findUserByUsername.get(username);
    if (existing) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashed = bcrypt.hashSync(password, 10);
    const createdAt = Date.now();
    const result = insertUser.run(username, hashed, createdAt);
    const token = jwt.sign({ id: result.lastInsertRowid, username }, JWT_SECRET, {
      expiresIn: '7d',
    });
    res.status(201).json({ token, user: { id: result.lastInsertRowid, username } });
  } catch (error) {
    console.error('Failed to register user', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Missing required fields: username, password' });
  }

  try {
    const user = findUserByUsername.get(username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const passwordMatches = bcrypt.compareSync(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
      expiresIn: '7d',
    });
    res.json({ token, user: { id: user.id, username: user.username } });
  } catch (error) {
    console.error('Failed to login user', error);
    res.status(500).json({ error: 'Failed to login user' });
  }
});

module.exports = router;
