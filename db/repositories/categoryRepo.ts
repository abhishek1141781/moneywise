// db/repositories/categoryRepo.ts
import { db } from '../db';

export type Category = {
  id: number;
  name: string;
  type: 'debit' | 'credit';
  color: string;
  icon?: string
};

export async function createCategory(
  name: string,
  type: 'debit' | 'credit',
  color: string,
  icon?: string
) {
  const createdAt = new Date().toISOString();

  await db.runAsync(
    `INSERT INTO categories
     (name, type, color, icon, createdAt)
     VALUES (?, ?, ?, ?, ?)`,
    [name, type, color, icon ?? null, createdAt]
  );
}

// export async function getCategories() {
//   return await db.getAllAsync(
//     `SELECT * FROM categories`
//   );
// }

export async function getCategories(): Promise<Category[]> {
  return await db.getAllAsync<Category>(
    `SELECT id, name, type, color, icon FROM categories`
  );
}