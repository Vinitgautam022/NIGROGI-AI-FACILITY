'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('Enter your credentials to continue.');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
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
        setError(data.error ?? 'Login failed.');
        setStatus('');
        return;
      }

      setStatus('Welcome! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 800);
    } catch {
      setError('Network error while logging in.');
      setStatus('');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Animated background */}
        <div className="auth-bg-blur"></div>
        <div className="auth-bg-gradient"></div>

        {/* Form card */}
        <div className="auth-form-card">
          <div className="auth-form-content">
            <div className="auth-form-header">
              <h1>Welcome Back</h1>
              <p>Sign in to continue to your virtual hospital dashboard</p>
            </div>

            <form onSubmit={onSubmit} className="auth-form">
              {/* Email field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="form-input-wrapper">
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`form-input ${error ? 'error' : ''}`}
                  />
                  <div className="input-icon">✉️</div>
                </div>
              </div>

              {/* Password field */}
              <div className="form-group">
                <div className="password-label-row">
                  <label htmlFor="password" className="form-label">Password</label>
                  <Link href="#" className="forgot-password">Forgot?</Link>
                </div>
                <div className="form-input-wrapper">
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`form-input ${error ? 'error' : ''}`}
                  />
                  <div className="input-icon">🔐</div>
                </div>
              </div>

              {/* Error message */}
              {error && (
                <div className="form-status error">
                  {error}
                </div>
              )}

              {/* Status message */}
              {status && (
                <div className="form-status info">
                  {status}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="form-button"
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>

              {/* Register link */}
              <div className="form-footer">
                <p>Don't have an account? <Link href="/register" className="auth-link">Create one</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .password-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .forgot-password {
          color: var(--accent);
          font-size: 0.85rem;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .forgot-password:hover {
          color: var(--accent2);
          text-decoration: underline;
        }

        .form-footer {
          text-align: center;
          margin-top: 24px;
          padding-top: 20px;
          border-top: 1px solid var(--border);
        }

        .form-footer p {
          color: var(--muted);
          font-size: 0.9rem;
          margin: 0;
        }

        .auth-link {
          color: var(--accent);
          text-decoration: none;
          font-weight: 700;
          transition: color 0.3s ease;
        }

        .auth-link:hover {
          color: var(--accent2);
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
