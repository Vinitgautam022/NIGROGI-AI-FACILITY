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

            {/* Doctor Finder */}
            <Link href="/tools/doctor-finder" className="tool-card">
              <div className="tool-icon">👨‍⚕️</div>
              <h4>Doctor Finder</h4>
              <p>Find doctors based on specialty, location, and availability in your area.</p>
              <span className="tool-arrow">→</span>
            </Link>

            {/* Appointments */}
            <Link href="/tools/appointments" className="tool-card">
              <div className="tool-icon">📅</div>
              <h4>Book Appointments</h4>
              <p>Schedule and manage your doctor appointments with ease and get reminders.</p>
              <span className="tool-arrow">→</span>
            </Link>

            {/* Medical Records */}
            <Link href="/tools/medical-records" className="tool-card">
              <div className="tool-icon">📋</div>
              <h4>Medical Records</h4>
              <p>Access your complete medical history, lab reports, and past treatments.</p>
              <span className="tool-arrow">→</span>
            </Link>

            {/* Prescriptions */}
            <Link href="/tools/prescriptions" className="tool-card">
              <div className="tool-icon">💊</div>
              <h4>Prescriptions</h4>
              <p>View active prescriptions, refill medicines, and track medication schedules.</p>
              <span className="tool-arrow">→</span>
            </Link>

            {/* Health Dashboard */}
            <Link href="/tools/health-dashboard" className="tool-card">
              <div className="tool-icon">📊</div>
              <h4>Health Dashboard</h4>
              <p>Monitor vital signs, health metrics, and track your wellness progress daily.</p>
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
          background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 25%, #f5f3ff 50%, #f0f9ff 75%, #ffffff 100%);
          color: #0f172a;
          position: relative;
          overflow-x: hidden;
        }

        /* Animated background orbs */
        .dashboard-container::before {
          content: '';
          position: fixed;
          top: -50%;
          right: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.08), transparent);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .dashboard-container::after {
          content: '';
          position: fixed;
          bottom: -30%;
          left: -5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(22, 163, 74, 0.06), transparent);
          border-radius: 50%;
          pointer-events: none;
          z-index: 0;
        }

        .loading-spinner {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          gap: 20px;
          position: relative;
          z-index: 1;
        }

        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(22, 163, 74, 0.2);
          border-top-color: #16a34a;
          border-right-color: #22c55e;
          border-radius: 50%;
          animation: spin 1s linear infinite;
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
          position: relative;
          z-index: 1;
        }

        .error-card p {
          color: #dc2626;
          font-size: 16px;
        }

        /* ===== HEADER SECTION ===== */
        .dashboard-header {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.95) 100%);
          backdrop-filter: blur(20px);
          border-bottom: 2px solid rgba(59, 130, 246, 0.2);
          padding: 24px 0;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.08);
        }

        .header-content {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 30px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo {
          font-size: 28px;
          font-weight: 800;
          background: linear-gradient(135deg, #16a34a 0%, #0891b2 50%, #0066cc 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0;
          letter-spacing: -0.5px;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .user-info {
          color: #475569;
          font-size: 14px;
          font-weight: 500;
        }

        .user-info strong {
          color: #16a34a;
          font-weight: 700;
          display: block;
          margin-top: 4px;
        }

        .btn-logout {
          padding: 10px 20px;
          background: linear-gradient(135deg, rgba(220, 38, 38, 0.08), rgba(220, 38, 38, 0.05));
          border: 1.5px solid rgba(220, 38, 38, 0.4);
          color: #dc2626;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-logout:hover {
          background: rgba(220, 38, 38, 0.12);
          border-color: #dc2626;
          color: #991b1b;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
        }

        /* ===== MAIN CONTENT ===== */
        .dashboard-main {
          max-width: 1400px;
          margin: 0 auto;
          padding: 50px 24px;
          position: relative;
          z-index: 1;
        }

        /* ===== WELCOME SECTION ===== */
        .welcome-section {
          margin-bottom: 60px;
        }

        .welcome-card {
          background: linear-gradient(135deg, rgba(22, 163, 74, 0.08) 0%, rgba(8, 145, 178, 0.06) 100%);
          border: 2px solid rgba(59, 130, 246, 0.3);
          border-radius: 20px;
          padding: 50px 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .welcome-card::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -10%;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.1), transparent);
          border-radius: 50%;
          pointer-events: none;
        }

        .welcome-card h2 {
          font-size: 36px;
          font-weight: 800;
          background: linear-gradient(135deg, #16a34a 0%, #0891b2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 16px 0;
          position: relative;
          z-index: 1;
        }

        .welcome-subtitle {
          color: #475569;
          font-size: 16px;
          margin: 0;
          position: relative;
          z-index: 1;
          line-height: 1.6;
        }

        /* ===== TOOLS SECTION ===== */
        .tools-section {
          margin-bottom: 70px;
          padding: 40px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(8, 145, 178, 0.03) 100%);
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }

        .tools-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent);
        }

        .section-title {
          font-size: 22px;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 32px 0;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .section-title::before {
          content: '';
          width: 4px;
          height: 24px;
          background: linear-gradient(135deg, #16a34a, #0891b2);
          border-radius: 2px;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 28px;
          position: relative;
          z-index: 1;
        }

        .tool-card {
          position: relative;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 249, 255, 0.8) 100%);
          border: 2px solid rgba(59, 130, 246, 0.25);
          border-radius: 16px;
          padding: 32px;
          text-decoration: none;
          color: inherit;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          gap: 16px;
          cursor: pointer;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.1);
        }

        .tool-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #16a34a, #0891b2, transparent);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.3s ease;
        }

        .tool-card:hover::before {
          transform: scaleX(1);
        }

        .tool-card:hover {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(224, 242, 254, 0.9) 100%);
          border-color: #0891b2;
          transform: translateY(-8px);
          box-shadow: 0 20px 48px rgba(59, 130, 246, 0.25);
        }

        .tool-icon {
          font-size: 48px;
          height: 70px;
          display: flex;
          align-items: center;
          filter: drop-shadow(0 2px 4px rgba(22, 163, 74, 0.15));
        }

        .tool-card h4 {
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .tool-card p {
          font-size: 14px;
          color: #475569;
          margin: 0;
          flex: 1;
          line-height: 1.5;
        }

        .tool-arrow {
          color: #16a34a;
          font-size: 24px;
          transition: all 0.3s ease;
          font-weight: 700;
        }

        .tool-card:hover .tool-arrow {
          transform: translateX(8px);
        }

        /* ===== STATS SECTION ===== */
        .stats-section {
          margin-bottom: 40px;
          padding: 40px;
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(8, 145, 178, 0.03) 100%);
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 20px;
          position: relative;
          overflow: hidden;
        }

        .stats-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.4), transparent);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          position: relative;
          z-index: 1;
        }

        .stat-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(240, 249, 255, 0.8) 100%);
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 14px;
          padding: 28px;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);
        }

        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          right: -100px;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(22, 163, 74, 0.1), transparent);
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          border-color: #0891b2;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(224, 242, 254, 0.9) 100%);
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.15);
        }

        .stat-card:hover::before {
          right: -50px;
        }

        .stat-label {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 12px;
          font-weight: 700;
          position: relative;
          z-index: 1;
        }

        .stat-value {
          font-size: 20px;
          font-weight: 800;
          color: #16a34a;
          word-break: break-all;
          position: relative;
          z-index: 1;
        }

        .btn-secondary {
          padding: 10px 20px;
          background: linear-gradient(135deg, rgba(22, 163, 74, 0.08), rgba(22, 163, 74, 0.05));
          border: 1.5px solid rgba(22, 163, 74, 0.4);
          color: #16a34a;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          text-decoration: none;
          transition: all 0.3s ease;
          display: inline-block;
        }

        .btn-secondary:hover {
          background: rgba(22, 163, 74, 0.15);
          border-color: #16a34a;
          color: #15803d;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.15);
        }

        /* ===== RESPONSIVE ===== */
        @media (max-width: 1024px) {
          .dashboard-main {
            padding: 40px 16px;
          }

          .tools-section,
          .stats-section {
            padding: 32px;
          }

          .tools-grid {
            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
            gap: 20px;
          }
        }

        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            gap: 20px;
            align-items: flex-start;
          }

          .header-actions {
            width: 100%;
            justify-content: space-between;
          }

          .logo {
            font-size: 22px;
          }

          .dashboard-main {
            padding: 30px 16px;
          }

          .welcome-section {
            margin-bottom: 40px;
          }

          .welcome-card {
            padding: 32px 20px;
          }

          .welcome-card h2 {
            font-size: 24px;
          }

          .welcome-subtitle {
            font-size: 14px;
          }

          .tools-section,
          .stats-section {
            padding: 24px;
            margin-bottom: 40px;
          }

          .section-title {
            font-size: 18px;
            margin-bottom: 24px;
          }

          .tools-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .tool-card {
            padding: 24px;
          }

          .tool-icon {
            font-size: 40px;
            height: 50px;
          }

          .tool-card h4 {
            font-size: 16px;
          }

          .tool-card p {
            font-size: 13px;
          }

          .stats-grid {
            grid-template-columns: 1fr;
            gap: 16px;
          }

          .stat-card {
            padding: 20px;
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
