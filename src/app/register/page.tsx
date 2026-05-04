'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [status, setStatus] = useState('Create your account to get started.');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validateForm() {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required.';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required.';
    } else if (!email.includes('@')) {
      newErrors.email = 'Please enter a valid email.';
    }

    if (!password) {
      newErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateForm()) {
      setStatus('Please fix the errors above.');
      return;
    }

    setLoading(true);
    setStatus('Creating your account...');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email, password })
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        setStatus(data.error ?? 'Registration failed.');
        return;
      }

      setStatus('Account created! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 1000);
    } catch {
      setStatus('Network error while creating account.');
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
              <h1>Create Account</h1>
              <p>Join our virtual hospital for better healthcare management</p>
            </div>

            <form onSubmit={onSubmit} className="auth-form">
              {/* Name field */}
              <div className="form-group">
                <label htmlFor="name" className="form-label">Full Name</label>
                <div className="form-input-wrapper">
                  <input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`form-input ${errors.name ? 'error' : ''}`}
                  />
                  <div className="input-icon">👤</div>
                </div>
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>

              {/* Email field */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className="form-input-wrapper">
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                  />
                  <div className="input-icon">✉️</div>
                </div>
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>

              {/* Password field */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className="form-input-wrapper">
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`form-input ${errors.password ? 'error' : ''}`}
                  />
                  <div className="input-icon">🔐</div>
                </div>
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              {/* Confirm password field */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <div className="form-input-wrapper">
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                  />
                  <div className="input-icon">🔒</div>
                </div>
                {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
              </div>

              {/* Status message */}
              {status && !loading && (
                <div className={`form-status ${Object.keys(errors).length > 0 ? 'error' : 'info'}`}>
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
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>

              {/* Login link */}
              <div className="form-footer">
                <p>Already have an account? <Link href="/login" className="auth-link">Sign in</Link></p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
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
