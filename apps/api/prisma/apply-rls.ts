/* Apply Row-Level Security policies (prisma/rls.sql).
   Run after migrations:  pnpm --filter @millionpulse/api prisma:rls
   Uses a raw pg connection because the SQL contains dollar-quoted
   function/DO blocks that Prisma's prepared-statement path can't run. */
import { Client } from 'pg';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

async function main() {
  const sql = readFileSync(join(__dirname, 'rls.sql'), 'utf8');
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query(sql);
    console.log('✓ Row-Level Security policies applied');
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error('RLS apply failed:', e.message);
  process.exit(1);
});
