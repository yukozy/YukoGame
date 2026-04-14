const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'timeline.db');
const db = new Database(dbPath);

const createTableSQL = `
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at INTEGER NOT NULL
);`;

db.exec(createTableSQL);

module.exports = db;
