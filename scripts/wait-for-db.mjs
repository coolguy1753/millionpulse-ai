// Wait until Postgres accepts connections (used by `pnpm setup` after db:up).
import net from 'node:net';

const host = 'localhost';
const port = 5432;
const timeoutMs = 60000;
const start = Date.now();

function tryConnect() {
  return new Promise((resolve) => {
    const socket = net.connect(port, host);
    socket.on('connect', () => { socket.end(); resolve(true); });
    socket.on('error', () => resolve(false));
    socket.setTimeout(1500, () => { socket.destroy(); resolve(false); });
  });
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

while (Date.now() - start < timeoutMs) {
  if (await tryConnect()) {
    console.log('✓ Postgres is up');
    process.exit(0);
  }
  process.stdout.write('.');
  await wait(1500);
}
console.error('\nPostgres did not become ready in time.');
process.exit(1);
