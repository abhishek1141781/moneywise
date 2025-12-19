// db/repositories/categoryRepo.ts
import { db } from '../db';

export async function createCategory(
  name: string,
  type: string,
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

export async function getCategories() {
  return await db.getAllAsync(
    `SELECT * FROM categories`
  );
}
