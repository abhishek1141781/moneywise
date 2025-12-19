// db/migrations/sql.ts

export const SQL_001_INIT = `
CREATE TABLE IF NOT EXISTS accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bankName TEXT NOT NULL,
  type TEXT,
  currency TEXT,
  openingBalance REAL,
  createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT,
  color TEXT,
  icon TEXT,
  createdAt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount REAL NOT NULL,
  transactionType TEXT NOT NULL,
  categoryId INTEGER,
  accountId INTEGER,
  timestamp TEXT NOT NULL,
  note TEXT,
  createdAt TEXT NOT NULL,
  FOREIGN KEY (categoryId) REFERENCES categories(id),
  FOREIGN KEY (accountId) REFERENCES accounts(id)
);

CREATE TABLE IF NOT EXISTS appMeta (
  key TEXT PRIMARY KEY,
  value TEXT
);
`;
