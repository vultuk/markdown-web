import React, { useEffect, useState } from 'react';

interface Props {
  children: React.ReactNode;
}

export function AuthGate({ children }: Props) {
  const [status, setStatus] = useState<'unknown' | 'ok' | 'need' | 'error'>('unknown');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch('/auth/status', { credentials: 'same-origin' });
        const data = await res.json().catch(() => ({}));
        if (!cancelled) setStatus(data.authenticated ? 'ok' : 'need');
      } catch {
        if (!cancelled) setStatus('error');
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await fetch('/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setStatus('ok');
        setPassword('');
        setMessage(null);
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage(data.error || 'Login failed');
      }
    } catch {
      setMessage('Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (status === 'ok') return <>{children}</>;

  if (status === 'unknown') {
    return (
      <div style={{ display: 'grid', placeItems: 'center', height: '100vh', color: '#ddd', background: '#1e1e1e' }}>
        <div>Loading…</div>
      </div>
    );
  }

  // Login form
  return (
    <div style={{ display: 'grid', placeItems: 'center', height: '100vh', background: '#1e1e1e' }}>
      <form onSubmit={onSubmit} style={{ background: '#252526', padding: 24, borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.5)', width: 320 }}>
        <h2 style={{ margin: 0, marginBottom: 16, color: '#fff', fontSize: 18 }}>Enter Password</h2>
        <p style={{ marginTop: 0, marginBottom: 12, color: '#aaa', fontSize: 13 }}>This instance is protected. Enter the password shown in your terminal.</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.currentTarget.value)}
          placeholder="Password"
          aria-label="Password"
          required
          autoFocus
          style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: '1px solid #3e3e42', background: '#1e1e1e', color: '#fff', marginBottom: 12 }}
        />
        {message && <div style={{ color: '#ff6b6b', marginBottom: 12, fontSize: 13 }}>{message}</div>}
        <button type="submit" disabled={submitting} style={{ width: '100%', padding: '10px 12px', borderRadius: 6, border: 0, background: '#0e639c', color: '#fff', cursor: 'pointer' }}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
