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
        .auth-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          position: relative;
          overflow: hidden;
        }

        .auth-wrapper {
          position: relative;
          width: 100%;
          max-width: 450px;
        }

        .auth-bg-blur {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
          pointer-events: none;
        }

        .auth-bg-gradient {
          position: absolute;
          top: 0;
          right: -30%;
          width: 150%;
          height: 100%;
          background: linear-gradient(45deg, rgba(16, 185, 129, 0.05) 0%, transparent 100%);
          border-radius: 50%;
          pointer-events: none;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(30px, -30px); }
        }

        .auth-form-card {
          position: relative;
          z-index: 10;
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3), 0 0 1px rgba(34, 197, 94, 0.1);
          animation: slideUp 0.6s ease-out;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .auth-form-content {
          position: relative;
        }

        .auth-form-header {
          margin-bottom: 32px;
          text-align: center;
        }

        .auth-form-header h1 {
          font-size: 28px;
          font-weight: 700;
          background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 12px 0;
        }

        .auth-form-header p {
          color: #94a3b8;
          font-size: 14px;
          margin: 0;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          color: #cbd5e1;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px 12px 40px;
          background: rgba(30, 41, 59, 0.5);
          border: 1.5px solid rgba(34, 197, 94, 0.3);
          border-radius: 10px;
          color: #e2e8f0;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-input:focus {
          background: rgba(30, 41, 59, 0.8);
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        .form-input.error {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.05);
        }

        .form-input.error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .form-input::placeholder {
          color: #64748b;
        }

        .input-icon {
          position: absolute;
          left: 12px;
          font-size: 16px;
          pointer-events: none;
        }

        .form-error {
          color: #ef4444;
          font-size: 12px;
          font-weight: 500;
        }

        .form-status {
          padding: 12px;
          border-radius: 8px;
          font-size: 13px;
          text-align: center;
        }

        .form-status.info {
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.3);
          color: #86efac;
        }

        .form-status.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #fca5a5;
        }

        .form-button {
          padding: 14px 20px;
          background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
          color: #ffffff;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
        }

        .form-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(34, 197, 94, 0.3);
        }

        .form-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .form-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
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

        .form-footer {
          text-align: center;
          margin-top: 16px;
        }

        .form-footer p {
          color: #94a3b8;
          font-size: 13px;
          margin: 0;
        }

        .auth-link {
          color: #22c55e;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.3s ease;
        }

        .auth-link:hover {
          color: #86efac;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
