// Load environment variables from the monorepo root .env (and a local one if
// present). Imported first in main.ts so process.env is populated before any
// module/provider reads it.
import { config } from 'dotenv';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const rootEnv = join(process.cwd(), '..', '..', '.env');
const localEnv = join(process.cwd(), '.env');

if (existsSync(rootEnv)) config({ path: rootEnv });
if (existsSync(localEnv)) config({ path: localEnv, override: true });
