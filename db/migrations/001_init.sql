CREATE TABLE accounts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  bankName TEXT NOT NULL,
  type TEXT,
  currency TEXT,
  openingBalance REAL,
  createdAt TEXT NOT NULL
);

CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT,
  color TEXT,
  icon TEXT,
  createdAt TEXT NOT NULL
);

CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  amount REAL NOT NULL,
  transactionType TEXT NOT NULL,
  categoryId INTEGER,
  accountId INTEGER,
  timestamp TEXT NOT NULL,
  note TEXT,
  createdAt TEXT NOT NULL
);

CREATE INDEX idx_txn_date ON transactions(timestamp);
CREATE INDEX idx_txn_category ON transactions(categoryId);
