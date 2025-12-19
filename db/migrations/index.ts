// db/migrations/index.ts
import { SQL_001_INIT } from './sql';

// export const MIGRATION_SQL: Record<string, string> = {
//   '001_init.sql': init,
//   '002_add_tags.sql': addTags,
//   '003_add_indexes.sql': addIndexes,
// };


export const MIGRATION_SQL: Record<string, string> = {
  '001_init.sql': SQL_001_INIT,
};
