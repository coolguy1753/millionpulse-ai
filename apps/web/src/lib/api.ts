// API client layer — replaces the prototype's window.MP / window.CLIENTS mocks.
// Holds the access token in memory + localStorage, auto-refreshes on 401.

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
const BASE = `${API_URL}/api`;

const ACCESS_KEY = 'mp_access';
const REFRESH_KEY = 'mp_refresh';

export const tokenStore = {
  get access() {
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  set(access: string, refresh: string) {
    localStorage.setItem(ACCESS_KEY, access);
    localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function raw(path: string, options: RequestInit = {}, retry = true): Promise<any> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  const access = tokenStore.access;
  if (access) headers.Authorization = `Bearer ${access}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 401 && retry && tokenStore.refresh) {
    const ok = await tryRefresh();
    if (ok) return raw(path, options, false);
  }

  if (!res.ok) {
    let msg = res.statusText;
    try {
      const body = await res.json();
      msg = Array.isArray(body.message) ? body.message.join(', ') : body.message || msg;
    } catch {
      /* ignore */
    }
    throw new ApiError(res.status, msg);
  }
  if (res.status === 204) return null;
  return res.json();
}

async function tryRefresh(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokenStore.refresh }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    tokenStore.set(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

export const api = {
  get: (path: string) => raw(path),
  post: (path: string, body?: unknown) => raw(path, { method: 'POST', body: JSON.stringify(body ?? {}) }),
  patch: (path: string, body?: unknown) => raw(path, { method: 'PATCH', body: JSON.stringify(body ?? {}) }),

  // Auth
  async login(email: string, password: string, totp?: string) {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, totp }),
    });
    if (!res.ok) {
      let msg = 'Invalid email or password';
      try {
        const b = await res.json();
        msg = Array.isArray(b.message) ? b.message.join(', ') : b.message || msg;
      } catch {
        /* ignore */
      }
      throw new ApiError(res.status, msg);
    }
    const data = await res.json();
    tokenStore.set(data.accessToken, data.refreshToken);
    return data.user;
  },
  me: () => raw('/auth/me'),

  // Multipart upload (files) — lets the browser set the multipart boundary.
  async uploadFiles(path: string, files: File[]) {
    const fd = new FormData();
    files.forEach((f) => fd.append('files', f));
    const headers: Record<string, string> = {};
    const access = tokenStore.access;
    if (access) headers.Authorization = `Bearer ${access}`;
    const res = await fetch(`${BASE}${path}`, { method: 'POST', headers, body: fd });
    if (!res.ok) throw new ApiError(res.status, res.statusText);
    return res.json();
  },
};
