// db/repositories/summaryRepo.ts
import { db } from '../db';

export async function getMonthlyExpenseSummary() {
  return await db.getAllAsync<{
    month: string;
    totalExpense: number;
  }>(`
    SELECT
      strftime('%Y-%m', timestamp) AS month,
      SUM(amount) AS totalExpense
    FROM transactions
    WHERE transactionType = 'debit'
    GROUP BY month
    ORDER BY month DESC
  `);
}

export async function getCategoryBreakdownForMonth(
  yearMonth: string // e.g. "2025-12"
) {
  return await db.getAllAsync<{
    categoryId: number;
    categoryName: string;
    total: number;
  }>(`
    SELECT
      c.id AS categoryId,
      c.name AS categoryName,
      SUM(t.amount) AS total
    FROM transactions t
    JOIN categories c ON t.categoryId = c.id
    WHERE t.transactionType = 'debit'
      AND strftime('%Y-%m', t.timestamp) = ?
    GROUP BY c.id
    ORDER BY total DESC
  `, [yearMonth]);
}

export async function getAccountBalances() {
  return await db.getAllAsync<{
    accountId: number;
    bankName: string;
    currentBalance: number;
  }>(`
    SELECT
      a.id AS accountId,
      a.bankName,
      a.openingBalance
        + IFNULL(SUM(
            CASE
              WHEN t.transactionType = 'credit' THEN t.amount
              WHEN t.transactionType = 'debit' THEN -t.amount
            END
          ), 0) AS currentBalance
    FROM accounts a
    LEFT JOIN transactions t ON a.id = t.accountId
    GROUP BY a.id
  `);
}

export async function getQuarterlyExpenseSummary() {
  return await db.getAllAsync<{
    year: string;
    quarter: number;
    totalExpense: number;
  }>(`
    SELECT
      strftime('%Y', timestamp) AS year,
      ((CAST(strftime('%m', timestamp) AS INTEGER) - 1) / 3 + 1) AS quarter,
      SUM(amount) AS totalExpense
    FROM transactions
    WHERE transactionType = 'debit'
    GROUP BY year, quarter
    ORDER BY year DESC, quarter DESC
  `);
}

export async function getYearlyExpenseSummary() {
  return await db.getAllAsync<{
    year: string;
    totalExpense: number;
  }>(`
    SELECT
      strftime('%Y', timestamp) AS year,
      SUM(amount) AS totalExpense
    FROM transactions
    WHERE transactionType = 'debit'
    GROUP BY year
    ORDER BY year DESC
  `);
}
