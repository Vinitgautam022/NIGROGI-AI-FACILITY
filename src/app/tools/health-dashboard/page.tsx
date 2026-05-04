'use client';

import Link from 'next/link';

export default function HealthDashboardPage() {
  const healthMetrics = [
    { label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'Normal', color: '#16a34a' },
    { label: 'Heart Rate', value: '72', unit: 'bpm', status: 'Normal', color: '#16a34a' },
    { label: 'Blood Glucose', value: '95', unit: 'mg/dL', status: 'Normal', color: '#16a34a' },
    { label: 'BMI', value: '22.5', unit: 'kg/m²', status: 'Healthy', color: '#16a34a' },
    { label: 'Cholesterol', value: '180', unit: 'mg/dL', status: 'Acceptable', color: '#ea580c' },
    { label: 'Oxygen Level', value: '98%', unit: 'SpO2', status: 'Excellent', color: '#16a34a' }
  ];

  const recentVitals = [
    { date: 'Today', time: '08:30 AM', metric: 'Blood Pressure', reading: '119/79', status: 'Normal' },
    { date: 'Yesterday', time: '09:15 AM', metric: 'Heart Rate', reading: '71 bpm', status: 'Normal' },
    { date: '2 days ago', time: '07:45 AM', metric: 'Weight', reading: '72 kg', status: 'Stable' }
  ];

  return (
    <div className="health-page">
      <header className="tool-header">
        <div className="tool-header-content">
          <div>
            <Link href="/dashboard" className="back-link">← Back to Dashboard</Link>
            <h1>📊 Health Dashboard</h1>
            <p>Monitor your health metrics and vital signs</p>
          </div>
        </div>
      </header>

      <main className="health-main">
        <div className="health-container">
          {/* Health Metrics Section */}
          <section className="metrics-section">
            <h2>Current Health Metrics</h2>
            <div className="metrics-grid">
              {healthMetrics.map((metric, index) => (
                <div key={index} className="metric-card" style={{ borderTopColor: metric.color }}>
                  <div className="metric-header">
                    <h4>{metric.label}</h4>
                    <span className="status-badge" style={{ color: metric.color }}>
                      {metric.status}
                    </span>
                  </div>
                  <div className="metric-value">
                    <span className="number">{metric.value}</span>
                    <span className="unit">{metric.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recent Vitals Section */}
          <section className="vitals-section">
            <h2>Recent Vital Readings</h2>
            <div className="vitals-list">
              {recentVitals.map((vital, index) => (
                <div key={index} className="vital-item">
                  <div className="vital-date-time">
                    <p className="date">{vital.date}</p>
                    <p className="time">{vital.time}</p>
                  </div>
                  <div className="vital-details">
                    <p className="metric">{vital.metric}</p>
                    <p className="reading">{vital.reading}</p>
                  </div>
                  <span className="status" style={{ color: vital.status === 'Normal' ? '#16a34a' : '#0891b2' }}>
                    {vital.status}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Health Tips Section */}
          <section className="tips-section">
            <h2>Health Tips</h2>
            <div className="tips-grid">
              <div className="tip-card">
                <div className="tip-icon">💧</div>
                <h4>Stay Hydrated</h4>
                <p>Drink at least 8 glasses of water daily to maintain optimal hydration.</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🏃</div>
                <h4>Regular Exercise</h4>
                <p>Aim for 30 minutes of moderate exercise most days of the week.</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">😴</div>
                <h4>Quality Sleep</h4>
                <p>Get 7-9 hours of quality sleep every night for better health.</p>
              </div>
              <div className="tip-card">
                <div className="tip-icon">🥗</div>
                <h4>Healthy Diet</h4>
                <p>Eat a balanced diet rich in fruits, vegetables, and whole grains.</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <style jsx>{`
        .health-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 25%, #f5f3ff 50%, #f0f9ff 75%, #ffffff 100%);
          padding-bottom: 40px;
        }

        .tool-header {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.95) 100%);
          border-bottom: 2px solid rgba(59, 130, 246, 0.2);
          padding: 30px 0;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.08);
        }

        .tool-header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(22, 163, 74, 0.1);
          border: 1.5px solid rgba(22, 163, 74, 0.4);
          border-radius: 8px;
          color: #16a34a;
          text-decoration: none;
          font-size: 0.95rem;
          font-weight: 600;
          transition: all 0.3s ease;
          cursor: pointer;
          margin-bottom: 16px;
        }

        .back-link:hover {
          background: rgba(22, 163, 74, 0.2);
          border-color: #16a34a;
          transform: translateX(-4px);
        }

        .tool-header h1 {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          margin: 12px 0 8px 0;
          background: linear-gradient(135deg, #16a34a, #0891b2);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tool-header p {
          color: #475569;
          font-size: 16px;
          margin: 0;
        }

        .health-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
        }

        .health-container {
          display: grid;
          gap: 32px;
        }

        section h2 {
          font-size: 22px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 24px 0;
          display: flex;
          align-items: center;
          gap: 12px;
        }

        section h2::before {
          content: '';
          width: 4px;
          height: 24px;
          background: linear-gradient(135deg, #16a34a, #0891b2);
          border-radius: 2px;
        }

        /* Metrics Section */
        .metrics-section {
          background: white;
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.08);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }

        .metric-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 249, 255, 0.8));
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-top: 3px solid;
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.15);
          transform: translateY(-4px);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 16px;
        }

        .metric-header h4 {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0;
        }

        .status-badge {
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .metric-value {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .metric-value .number {
          font-size: 28px;
          font-weight: 800;
          color: #0f172a;
        }

        .metric-value .unit {
          font-size: 12px;
          color: #64748b;
          font-weight: 600;
        }

        /* Vitals Section */
        .vitals-section {
          background: white;
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.08);
        }

        .vitals-list {
          display: grid;
          gap: 16px;
        }

        .vital-item {
          display: grid;
          grid-template-columns: 120px 1fr auto;
          gap: 20px;
          align-items: center;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 249, 255, 0.8));
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 16px 20px;
          transition: all 0.3s ease;
        }

        .vital-item:hover {
          border-color: #0891b2;
          box-shadow: 0 8px 20px rgba(59, 130, 246, 0.1);
        }

        .vital-date-time {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .vital-date-time .date {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .vital-date-time .time {
          font-size: 11px;
          color: #64748b;
          margin: 0;
        }

        .vital-details .metric {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .vital-details .reading {
          font-size: 14px;
          font-weight: 700;
          color: #16a34a;
          margin: 4px 0 0 0;
        }

        .vital-item .status {
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        /* Tips Section */
        .tips-section {
          background: white;
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.08);
        }

        .tips-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }

        .tip-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 249, 255, 0.8));
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          transition: all 0.3s ease;
        }

        .tip-card:hover {
          border-color: #0891b2;
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.15);
          transform: translateY(-4px);
        }

        .tip-icon {
          font-size: 36px;
          margin-bottom: 12px;
          display: block;
        }

        .tip-card h4 {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px 0;
        }

        .tip-card p {
          font-size: 13px;
          color: #475569;
          margin: 0;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .health-main {
            padding: 20px 16px;
          }

          .metrics-section,
          .vitals-section,
          .tips-section {
            padding: 20px;
          }

          .tool-header h1 {
            font-size: 24px;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .vital-item {
            grid-template-columns: 1fr;
            gap: 12px;
          }

          .tips-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
