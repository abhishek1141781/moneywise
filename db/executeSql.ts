// db/executeSql.ts
import { db } from './db';

// export function executeSql(sql: string): Promise<void> {
//   return new Promise((resolve, reject) => {
//       db.exec(
//         [{ sql, args: [] }],
//         false,
//         (error) => {
//           if (error) {
//             reject(error);
//           } else {
//             resolve();
//           }
//         }
//       );
//   });
// }

export async function executeSql(sql: string) {
    await db.execAsync(sql);
};
