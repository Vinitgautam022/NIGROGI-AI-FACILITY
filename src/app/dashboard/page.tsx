'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface User {
  id: string;
  name: string;
  email: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me');
        if (!response.ok) {
          router.push('/login');
          return;
        }

        const data = (await response.json()) as User;
        setUser(data);
      } catch {
        setError('Failed to load user data');
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  async function handleLogout() {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
    } catch {
      setError('Failed to logout');
    }
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="dashboard-container">
        <div className="error-card">
          <p>{error || 'Authentication failed'}</p>
          <Link href="/login" className="btn-secondary">
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-section">
            <h1 className="logo">🏥 Virtual Hospital</h1>
          </div>
          <div className="header-actions">
            <span className="user-info">Welcome, <strong>{user.name}</strong></span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="dashboard-main">
        {/* Welcome section */}
        <section className="welcome-section">
          <div className="welcome-card">
            <h2>Welcome to Your Dashboard</h2>
            <p className="welcome-subtitle">
              Choose from our healthcare tools to analyze symptoms, upload reports, or generate clinical notes.
            </p>
          </div>
        </section>

        {/* Tools grid */}
        <section className="tools-section">
          <h3 className="section-title">Healthcare Tools</h3>
          <div className="tools-grid">
            {/* Symptom Analyzer */}
            <Link href="/tools/symptom-analyzer" className="tool-card">
              <div className="tool-icon">🔍</div>
              <h4>Symptom Analyzer</h4>
              <p>Analyze symptoms and get AI-powered medical insights with multilingual support.</p>
              <span className="tool-arrow">→</span>
            </Link>

            {/* Report Analyzer */}
            <Link href="/tools/report-analyzer" className="tool-card">
              <div className="tool-icon">📄</div>
              <h4>Report Analyzer</h4>
              <p>Upload and analyze medical reports with advanced OCR and AI processing.</p>
              <span className="tool-arrow">→</span>
            </Link>

            {/* Clinical Note Generator */}
            <Link href="/tools/note-generator" className="tool-card">
              <div className="tool-icon">📋</div>
              <h4>Clinical Notes</h4>
              <p>Generate comprehensive clinical notes and export as PDF for your records.</p>
              <span className="tool-arrow">→</span>
            </Link>

            {/* Doctor Finder */}
            <Link href="/tools/doctor-finder" className="tool-card">
              <div className="tool-icon">👨‍⚕️</div>
              <h4>Doctor Finder</h4>
              <p>Find doctors based on specialty, location, and availability in your area.</p>
              <span className="tool-arrow">→</span>
            </Link>
          </div>
        </section>

        {/* Quick stats */}
        <section className="stats-section">
          <h3 className="section-title">Your Profile</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Email</div>
              <div className="stat-value">{user.email}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Account Status</div>
              <div className="stat-value" style={{ color: '#22c55e' }}>Active</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Member Since</div>
              <div className="stat-value">Today</div>
            </div>
          </div>
        </section>
      </main>

      <style jsx>{`
        .dashboard-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          color: #e2e8f0;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 20px;
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(34, 197, 94, 0.3);
          border-top-color: #22c55e;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .error-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 20px;
          padding: 20px;
        }

        .error-card p {
          color: #fca5a5;
          font-size: 16px;
        }

        /* Header */
        .dashboard-header {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(34, 197, 94, 0.2);
          padding: 20px 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .logo {
          font-size: 24px;
          font-weight: 700;
          background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 20px;
        }

        .user-info {
          color: #cbd5e1;
          font-size: 14px;
        }

        .user-info strong {
          color: #22c55e;
          font-weight: 600;
        }

        .btn-logout {
          padding: 10px 20px;
          background: transparent;
          border: 1.5px solid rgba(239, 68, 68, 0.5);
          color: #ef4444;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-logout:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: #ef4444;
          color: #fca5a5;
        }

        /* Main content */
        .dashboard-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        /* Welcome section */
        .welcome-section {
          margin-bottom: 50px;
        }

        .welcome-card {
          background: rgba(34, 197, 94, 0.05);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 16px;
          padding: 30px;
          text-align: center;
        }

        .welcome-card h2 {
          font-size: 28px;
          background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 12px 0;
        }

        .welcome-subtitle {
          color: #cbd5e1;
          font-size: 15px;
          margin: 0;
        }

        /* Tools section */
        .tools-section {
          margin-bottom: 50px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 700;
          color: #cbd5e1;
          margin: 0 0 24px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }

        .tool-card {
          position: relative;
          background: rgba(30, 41, 59, 0.5);
          border: 1.5px solid rgba(34, 197, 94, 0.3);
          border-radius: 12px;
          padding: 24px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 12px;
          cursor: pointer;
        }

        .tool-card:hover {
          background: rgba(30, 41, 59, 0.8);
          border-color: #22c55e;
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(34, 197, 94, 0.15);
        }

        .tool-icon {
          font-size: 40px;
          height: 60px;
          display: flex;
          align-items: center;
        }

        .tool-card h4 {
          font-size: 16px;
          font-weight: 700;
          color: #e2e8f0;
          margin: 0;
        }

        .tool-card p {
          font-size: 13px;
          color: #94a3b8;
          margin: 0;
          flex: 1;
        }

        .tool-arrow {
          color: #22c55e;
          font-size: 20px;
          transition: all 0.3s ease;
        }

        .tool-card:hover .tool-arrow {
          transform: translateX(4px);
        }

        /* Stats section */
        .stats-section {
          margin-bottom: 30px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .stat-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1.5px solid rgba(34, 197, 94, 0.2);
          border-radius: 12px;
          padding: 20px;
        }

        .stat-label {
          font-size: 12px;
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 700;
          color: #cbd5e1;
          word-break: break-all;
        }

        .btn-secondary {
          padding: 10px 20px;
          background: transparent;
          border: 1.5px solid rgba(34, 197, 94, 0.5);
          color: #22c55e;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .btn-secondary:hover {
          background: rgba(34, 197, 94, 0.1);
          border-color: #22c55e;
          color: #86efac;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 15px;
          }

          .header-actions {
            width: 100%;
            justify-content: space-between;
          }

          .dashboard-main {
            padding: 20px;
          }

          .tools-grid {
            grid-template-columns: 1fr;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .welcome-card {
            padding: 20px;
          }

          .welcome-card h2 {
            font-size: 22px;
          }
        }
      `}</style>
    </div>
  );
}
