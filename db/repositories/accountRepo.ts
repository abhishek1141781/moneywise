// db/repositories/accountRepo.ts
import { db } from '../db';

export async function createAccount(
  bankName: string,
  type: string,
  currency: string,
  openingBalance: number
) {
  const createdAt = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO accounts 
     (bankName, type, currency, openingBalance, createdAt)
     VALUES (?, ?, ?, ?, ?)`,
    [bankName, type, currency, openingBalance, createdAt]
  );
}

export async function getAccounts() {
  return await db.getAllAsync<{
    id: number;
    bankName: string;
    openingBalance: number;
  }>(
    `SELECT id, bankName, openingBalance FROM accounts`
  );
}
