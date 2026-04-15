const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.resolve(__dirname, 'timeline.db');
const db = new Database(dbPath);

const createUsersTable = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at INTEGER NOT NULL
);`;

const createEventsTable = `
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  user_id INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);`;

db.exec(createUsersTable);
db.exec(createEventsTable);

const tableInfo = db.prepare('PRAGMA table_info(events)').all();
const hasUserId = tableInfo.some((column) => column.name === 'user_id');
if (!hasUserId) {
  db.exec('ALTER TABLE events ADD COLUMN user_id INTEGER;');
}

module.exports = db;
