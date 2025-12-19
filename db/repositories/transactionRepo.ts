// db/repositories/transactionRepo.ts
import { db } from '../db';

export async function addTransaction(
  amount: number,
  transactionType: 'debit' | 'credit',
  accountId: number,
  categoryId?: number,
  note?: string
) {
  const now = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO transactions
     (amount, transactionType, accountId, categoryId, timestamp, createdAt, note)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      amount,
      transactionType,
      accountId,
      categoryId ?? null,
      now,
      now,
      note ?? null,
    ]
  );
}

export async function getTransactions() {
  return await db.getAllAsync(
    `SELECT * FROM transactions ORDER BY timestamp DESC`
  );
}
