'use client';

import Link from 'next/link';
import { useState } from 'react';

interface MedicalRecord {
  id: string;
  type: string;
  title: string;
  date: string;
  doctor: string;
  description: string;
  file?: string;
}

const mockRecords: MedicalRecord[] = [
  {
    id: '1',
    type: 'Blood Test',
    title: 'Complete Blood Count',
    date: '2026-04-15',
    doctor: 'Dr. Rajesh Kumar',
    description: 'Annual health checkup blood work',
    file: 'CBC_Report_2026.pdf'
  },
  {
    id: '2',
    type: 'X-Ray',
    title: 'Chest X-Ray',
    date: '2026-03-20',
    doctor: 'Dr. Priya Singh',
    description: 'Routine chest imaging',
    file: 'XRay_Chest_2026.pdf'
  }
];

export default function MedicalRecordsPage() {
  const [records] = useState<MedicalRecord[]>(mockRecords);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Blood Test': '#16a34a',
      'X-Ray': '#0891b2',
      'Ultrasound': '#7c3aed',
      'CT Scan': '#ea580c',
      'ECG': '#db2777'
    };
    return colors[type] || '#64748b';
  };

  return (
    <div className="records-page">
      <header className="tool-header">
        <div className="tool-header-content">
          <div>
            <Link href="/dashboard" className="back-link">← Back to Dashboard</Link>
            <h1>📋 Medical History</h1>
            <p>View and manage your complete medical records</p>
          </div>
        </div>
      </header>

      <main className="records-main">
        <div className="records-container">
          <div className="records-grid">
            {records.map((record) => (
              <div key={record.id} className="record-card">
                <div className="record-type-badge" style={{ backgroundColor: `${getTypeColor(record.type)}22`, color: getTypeColor(record.type) }}>
                  {record.type}
                </div>
                <h3>{record.title}</h3>
                <div className="record-meta">
                  <div className="meta-item">
                    <span className="meta-label">Date</span>
                    <span className="meta-value">{new Date(record.date).toLocaleDateString()}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Doctor</span>
                    <span className="meta-value">{record.doctor}</span>
                  </div>
                </div>
                <p className="record-description">{record.description}</p>
                {record.file && (
                  <button className="btn-view-file">
                    📥 Download File
                  </button>
                )}
              </div>
            ))}
          </div>

          {records.length === 0 && (
            <div className="no-records">
              <p>No medical records available.</p>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .records-page {
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

        .records-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
        }

        .records-container {
          background: white;
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.08);
        }

        .records-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 24px;
        }

        .record-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 249, 255, 0.8));
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
        }

        .record-card:hover {
          border-color: #0891b2;
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.15);
          transform: translateY(-4px);
        }

        .record-type-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
        }

        .record-card h3 {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 12px 0;
        }

        .record-meta {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 12px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(59, 130, 246, 0.1);
        }

        .meta-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .meta-label {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 700;
        }

        .meta-value {
          font-size: 13px;
          color: #0f172a;
          font-weight: 600;
        }

        .record-description {
          font-size: 13px;
          color: #475569;
          margin: 0 0 16px 0;
          line-height: 1.5;
        }

        .btn-view-file {
          width: 100%;
          padding: 10px 16px;
          background: linear-gradient(135deg, rgba(8, 145, 178, 0.1), rgba(8, 145, 178, 0.05));
          color: #0891b2;
          border: 1.5px solid rgba(8, 145, 178, 0.3);
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-view-file:hover {
          background: rgba(8, 145, 178, 0.2);
          border-color: #0891b2;
        }

        .no-records {
          text-align: center;
          padding: 60px 20px;
          color: #475569;
        }

        @media (max-width: 768px) {
          .records-main {
            padding: 20px 16px;
          }

          .records-container {
            padding: 20px;
          }

          .tool-header h1 {
            font-size: 24px;
          }

          .records-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
