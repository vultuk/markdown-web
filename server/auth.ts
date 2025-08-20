import express from 'express';
import crypto from 'crypto';

type Nullable<T> = T | null;

interface AuthOptions {
  disabled?: boolean;
  password?: string;
  // session lifetime in seconds (default 24h)
  sessionTtlSec?: number;
}

interface AuthState {
  enabled: boolean;
  // scrypt params and derived password
  salt: Buffer;
  derivedKey: Buffer;
  N: number;
  r: number;
  p: number;
  keyLen: number;
  // HMAC secret for signing session tokens
  sessionSecret: Buffer;
  sessionTtlSec: number;
  // simple in-memory login attempt tracking per IP
  attempts: Map<string, { count: number; firstAt: number }>;
}

// Internal singleton state
const state: AuthState = {
  enabled: true,
  salt: crypto.randomBytes(16),
  derivedKey: Buffer.alloc(0),
  // Reasonable scrypt params for server-side verification
  N: 1 << 15, // 32768
  r: 8,
  p: 1,
  keyLen: 32,
  sessionSecret: crypto.randomBytes(32),
  sessionTtlSec: 24 * 60 * 60,
  attempts: new Map(),
};

function base64url(input: Buffer | string): string {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return b
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function parseCookies(header: string | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  const parts = header.split(';');
  for (const part of parts) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const k = part.slice(0, idx).trim();
    const v = decodeURIComponent(part.slice(idx + 1).trim());
    if (!k) continue;
    out[k] = v;
  }
  return out;
}

async function scrypt(password: string, salt: Buffer, N: number, r: number, p: number, keyLen: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // Compute a safe maxmem per Node.js docs: should exceed 128*N*r plus overhead
    const required = 128 * N * r + keyLen + salt.length;
    const maxmem = Math.max(64 * 1024 * 1024, required * 2); // at least 64MB or 2x requirement
    crypto.scrypt(password, salt, keyLen, { N, r, p, maxmem }, (err, dk) => {
      if (err) return reject(err);
      resolve(dk as Buffer);
    });
  });
}

function timingSafeEqual(a: Buffer, b: Buffer): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function sign(payload: object): string {
  const header = { alg: 'HS256', typ: 'JWT' };
  const h = base64url(JSON.stringify(header));
  const p = base64url(JSON.stringify(payload));
  const data = `${h}.${p}`;
  const sig = crypto.createHmac('sha256', state.sessionSecret).update(data).digest();
  return `${data}.${base64url(sig)}`;
}

function verify(token: string): Nullable<{ iat: number; exp: number } & Record<string, any>> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [h, p, s] = parts;
  const data = `${h}.${p}`;
  const expected = crypto.createHmac('sha256', state.sessionSecret).update(data).digest();
  const given = Buffer.from(s.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
  if (!timingSafeEqual(expected, given)) return null;
  try {
    const payload = JSON.parse(Buffer.from(p.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
    if (typeof payload.exp === 'number' && Date.now() / 1000 > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

function setSessionCookie(res: express.Response, token: string, secure: boolean, maxAgeSec: number) {
  const cookie = `mw_session=${token}; Path=/; HttpOnly; SameSite=Strict${secure ? '; Secure' : ''}; Max-Age=${maxAgeSec}`;
  res.setHeader('Set-Cookie', cookie);
}

export async function setupAuth(app: express.Application, options?: AuthOptions): Promise<{ enabled: boolean; password?: string } > {
  const disabled = !!options?.disabled;
  state.enabled = !disabled;
  state.sessionTtlSec = options?.sessionTtlSec ?? state.sessionTtlSec;

  let effectivePassword = options?.password;
  if (!disabled) {
    if (!effectivePassword) {
      // Generate strong, URL-safe password
      effectivePassword = base64url(crypto.randomBytes(18)); // ~24 chars
    }
    // Derive and store key
    state.salt = crypto.randomBytes(16);
    state.derivedKey = await scrypt(effectivePassword, state.salt, state.N, state.r, state.p, state.keyLen);
  }

  // Public routes for auth
  const router = express.Router();

  router.get('/status', (req, res) => {
    if (!state.enabled) return res.json({ authenticated: true, disabled: true });
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies['mw_session'];
    if (!token) return res.json({ authenticated: false });
    const payload = verify(token);
    return res.json({ authenticated: !!payload });
  });

  router.post('/login', express.json(), async (req, res) => {
    if (!state.enabled) return res.status(200).json({ ok: true });
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';
    const now = Date.now();
    const windowMs = 10 * 60 * 1000; // 10 minutes
    const rec = state.attempts.get(ip) || { count: 0, firstAt: now };
    if (now - rec.firstAt > windowMs) {
      rec.count = 0;
      rec.firstAt = now;
    }
    if (rec.count >= 20) {
      // Too many attempts in window
      state.attempts.set(ip, rec);
      return res.status(429).json({ error: 'Too many attempts. Try later.' });
    }
    const body = req.body || {};
    const candidate: string = typeof body.password === 'string' ? body.password : '';
    try {
      const dk = await scrypt(candidate, state.salt, state.N, state.r, state.p, state.keyLen);
      const ok = timingSafeEqual(dk, state.derivedKey);
      rec.count += 1;
      state.attempts.set(ip, rec);
      if (!ok) return res.status(401).json({ error: 'Invalid password' });
      const iat = Math.floor(Date.now() / 1000);
      const exp = iat + state.sessionTtlSec;
      const token = sign({ iat, exp });
      const secure = req.secure || (req.headers['x-forwarded-proto'] === 'https');
      setSessionCookie(res, token, !!secure, state.sessionTtlSec);
      return res.json({ ok: true });
    } catch (e) {
      return res.status(500).json({ error: 'Auth failed' });
    }
  });

  router.post('/logout', (req, res) => {
    // Expire cookie
    res.setHeader('Set-Cookie', 'mw_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
    res.json({ ok: true });
  });

  app.use('/auth', router);

  return { enabled: state.enabled, password: effectivePassword };
}

export function requireAuth(): express.RequestHandler {
  return (req, res, next) => {
    if (!state.enabled) return next();
    const cookies = parseCookies(req.headers.cookie);
    const token = cookies['mw_session'];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const payload = verify(token);
    if (!payload) return res.status(401).json({ error: 'Unauthorized' });
    return next();
  };
}
