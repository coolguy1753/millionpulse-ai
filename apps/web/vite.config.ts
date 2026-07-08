import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// Read env (VITE_*) from the monorepo root so there's a single .env.
const rootDir = fileURLToPath(new URL('../../', import.meta.url));

export default defineConfig({
  plugins: [react()],
  envDir: rootDir,
  server: {
    port: 5173,
  },
});
