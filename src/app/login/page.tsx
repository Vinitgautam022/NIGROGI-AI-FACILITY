'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('Enter your credentials to continue.');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setStatus('Signing in...');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setStatus(data.error ?? 'Login failed.');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setStatus('Network error while logging in.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-shell">
      <form className="auth-card card-3d" onSubmit={onSubmit}>
        <h1>Welcome Back</h1>
        <p className="muted">Secure login to continue to your triage dashboard.</p>
        <label htmlFor="email">Email</label>
        <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <label htmlFor="password">Password</label>
        <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Login'}</button>
        <p className="muted">{status}</p>
        <p className="muted">New user? <Link href="/register">Create account</Link></p>
      </form>
    </main>
  );
}
