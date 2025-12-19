// // db/testSummary.ts
// import { db } from './db';
// import {
//     getMonthlyExpenseSummary,
//     getCategoryBreakdownForMonth,
//     getQuarterlyExpenseSummary,
//     getYearlyExpenseSummary,
//     getAccountBalances,
// } from './repositories/summaryRepo';
// import { createAccount } from './repositories/accountRepo';
// import { createCategory } from './repositories/categoryRepo';
// import { addTransaction } from './repositories/transactionRepo';

// export async function runSummaryTests() {
//     console.log('--- Running summary query tests ---');

//     // 1️⃣ Seed minimal data (idempotent-ish for dev)
//     await createAccount('Test Bank', 'savings', 'INR', 10000);

//     await createCategory('Groceries', 'debit', '#22C55E');
//     await createCategory('Salary', 'credit', '#3B82F6');

//     // Fetch IDs
//     const accounts = await db.getAllAsync<{ id: number }>(
//         'SELECT id FROM accounts LIMIT 1'
//     );
//     const categories = await db.getAllAsync<{ id: number; name: string }>(
//         'SELECT id, name FROM categories'
//     );

//     const accountId = accounts[0].id;
//     const groceriesId = categories.find(c => c.name === 'Groceries')?.id;
//     const salaryId = categories.find(c => c.name === 'Salary')?.id;

//     const now = new Date().toISOString();

//     // 2️⃣ Transactions
//     await addTransaction(2000, 'credit', accountId, salaryId, 'Salary');
//     await addTransaction(500, 'debit', accountId, groceriesId, 'Veggies');
//     await addTransaction(300, 'debit', accountId, groceriesId, 'Milk');

//     // 3️⃣ Run summaries
//     console.log('Monthly Expense Summary:',
//         await getMonthlyExpenseSummary()
//     );

//     console.log('Category Breakdown (this month):',
//         await getCategoryBreakdownForMonth(now.slice(0, 7))
//     );

//     console.log('Quarterly Expense Summary:',
//         await getQuarterlyExpenseSummary()
//     );

//     console.log('Yearly Expense Summary:',
//         await getYearlyExpenseSummary()
//     );

//     console.log('Account Balances:',
//         await getAccountBalances()
//     );

//     console.log('--- Summary tests complete ---');
// }
