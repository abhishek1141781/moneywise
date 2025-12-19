// import { db } from './db';

// export async function verifyDbInsert() {
//     console.log('Inserting test account...');

//     await db.runAsync(
//         `INSERT INTO accounts 
//      (bankName, type, currency, openingBalance, createdAt)
//      VALUES (?, ?, ?, ?, ?)`,
//         [
//             'Test Bank',
//             'savings',
//             'INR',
//             10000,
//             new Date().toISOString(),
//         ]
//     );

//     console.log('Test account inserted');
// }

// export async function verifyDbRead() {
//     const rows = await db.getAllAsync<{
//         id: number;
//         bankName: string;
//         openingBalance: number;
//     }>('SELECT id, bankName, openingBalance FROM accounts');

//     console.log('Accounts in DB:', rows);
// }
