// db/initDatabase.ts
import { db } from './db';
import { executeSql } from './executeSql';
import { MIGRATION_SQL } from './migrations';
import { MIGRATIONS } from './schemaVersion';

// // temp
// import { verifyDbInsert, verifyDbRead } from './verifyDb';
// import { runSummaryTests } from './testSummary';




export async function initDatabase() {
  console.log('Initializing database...: from initDatabase.ts');

  // 1️⃣ Ensure appMeta table exists
  await executeSql(`
    CREATE TABLE IF NOT EXISTS appMeta (
      key TEXT PRIMARY KEY,
      value TEXT
    );
  `);

  // 2️⃣ Read current schema version
  const currentVersion = await getCurrentSchemaVersion();
  console.log('Current schema version: from initDatabse.ts:   ', currentVersion);

  // 3️⃣ Apply pending migrations
  for (const migration of MIGRATIONS) {
    if (migration.version > currentVersion) {
      console.log(`Running migration v${migration.version}`);

      const sql = MIGRATION_SQL[migration.file];
      if (!sql) {
        throw new Error(`Migration file not found: ${migration.file}`);
      }

      await executeSql(sql);
      await setSchemaVersion(migration.version);
    }
  }

  console.log('Database ready: from initDatabase.ts');

  const finalVersion = await getCurrentSchemaVersion();
  console.log('Final schema version: from initDatabase:   ', finalVersion);

  // // temp code
  // await verifyDbInsert();

  // await verifyDbRead();


  // // STEP 1️⃣ Verify tables exist (READ-ONLY)         ----TEMP CODE
  // const tables = await db.getAllAsync<{ name: string }>(
  //   "SELECT name FROM sqlite_master WHERE type='table'"
  // );

  // console.log(
  //   'Tables in DB:',
  //   tables.map(t => t.name)
  // );

  // // STEP 5️⃣ (Optional) Insert a test transaction        temp code

  // await db.runAsync(
  //   `INSERT INTO transactions
  //  (amount, transactionType, accountId, timestamp, createdAt)
  //  VALUES (?, ?, ?, ?, ?)`,
  //   [
  //     500,
  //     'debit',
  //     1,
  //     new Date().toISOString(),
  //     new Date().toISOString(),
  //   ]
  // );

  // const txns = await db.getAllAsync(
  //   'SELECT * FROM transactions'
  // );
  // console.log('Transactions:', txns);

  // // 🧪 Testing Summary Queries (Safe & Clean)              --- temp code
  // await runSummaryTests();




}

async function getCurrentSchemaVersion(): Promise<number> {
  const row = await db.getFirstAsync<{
    value: string;
  }>(`SELECT value FROM appMeta WHERE key = 'schemaVersion'`);

  if (!row) return 0; // fresh install
  return Number(row.value);
}


async function setSchemaVersion(version: number) {
  await db.runAsync(
    `INSERT OR REPLACE INTO appMeta (key, value) VALUES (?, ?)`,
    ['schemaVersion', String(version)]
  );
}


// import { executeSql } from './executeSql';
// import { MIGRATIONS } from './schemaVersion';

// export async function initDatabase() {
//   console.log('Initializing database...');

//   // 1️⃣ Ensure appMeta table exists
//   await executeSql(`
//     CREATE TABLE IF NOT EXISTS appMeta (
//       key TEXT PRIMARY KEY,
//       value TEXT
//     );
//   `);

//   // 2️⃣ Read current schema version
//   const currentVersion = await getCurrentSchemaVersion();
//   console.log('Current schema version:', currentVersion);

//   // 3️⃣ Apply pending migrations
//   for (const migration of MIGRATIONS) {
//     if (migration.version > currentVersion) {
//       console.log(`Running migration v${migration.version}`);
//       const sql = await loadMigrationFile(migration.file);
//       await executeSql(sql);
//       await setSchemaVersion(migration.version);
//     }
//   }

//   console.log('Database ready');
// }


// Cannot find name 'getCurrentSchemaVersion'.ts(2304)
// Cannot find name 'loadMigrationFile'.ts(2304)
// Cannot find name 'setSchemaVersion'.ts(2304)