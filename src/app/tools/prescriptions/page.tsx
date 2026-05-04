'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Prescription {
  id: string;
  medicineNameName: string;
  dosage: string;
  frequency: string;
  duration: string;
  doctor: string;
  date: string;
  status: 'active' | 'completed' | 'expired';
}

const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    medicineNameName: 'Aspirin',
    dosage: '500mg',
    frequency: 'Twice daily',
    duration: '7 days',
    doctor: 'Dr. Rajesh Kumar',
    date: '2026-04-20',
    status: 'active'
  },
  {
    id: '2',
    medicineNameName: 'Metformin',
    dosage: '1000mg',
    frequency: 'Three times daily',
    duration: '30 days',
    doctor: 'Dr. Priya Singh',
    date: '2026-04-10',
    status: 'active'
  }
];

export default function PrescriptionsPage() {
  const [prescriptions] = useState<Prescription[]>(mockPrescriptions);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return '#16a34a';
      case 'completed': return '#0891b2';
      case 'expired': return '#dc2626';
      default: return '#64748b';
    }
  };

  return (
    <div className="prescriptions-page">
      <header className="tool-header">
        <div className="tool-header-content">
          <div>
            <Link href="/dashboard" className="back-link">← Back to Dashboard</Link>
            <h1>💊 Prescriptions</h1>
            <p>View your active prescriptions and medicine details</p>
          </div>
        </div>
      </header>

      <main className="prescriptions-main">
        <div className="prescriptions-container">
          <div className="prescriptions-list">
            {prescriptions.map((prescription) => (
              <div key={prescription.id} className="prescription-card">
                <div className="prescription-header">
                  <div>
                    <h3>{prescription.medicineNameName}</h3>
                    <p className="doctor">Prescribed by {prescription.doctor}</p>
                  </div>
                  <span 
                    className="status-badge"
                    style={{ backgroundColor: `${getStatusColor(prescription.status)}22`, color: getStatusColor(prescription.status) }}
                  >
                    {prescription.status.charAt(0).toUpperCase() + prescription.status.slice(1)}
                  </span>
                </div>

                <div className="prescription-details">
                  <div className="detail-box">
                    <span className="icon">💊</span>
                    <div>
                      <p className="label">Dosage</p>
                      <p className="value">{prescription.dosage}</p>
                    </div>
                  </div>
                  <div className="detail-box">
                    <span className="icon">🕐</span>
                    <div>
                      <p className="label">Frequency</p>
                      <p className="value">{prescription.frequency}</p>
                    </div>
                  </div>
                  <div className="detail-box">
                    <span className="icon">📅</span>
                    <div>
                      <p className="label">Duration</p>
                      <p className="value">{prescription.duration}</p>
                    </div>
                  </div>
                  <div className="detail-box">
                    <span className="icon">📋</span>
                    <div>
                      <p className="label">Date</p>
                      <p className="value">{new Date(prescription.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <div className="prescription-actions">
                  <button className="btn-refill">🔄 Refill</button>
                  <button className="btn-details">📋 Details</button>
                </div>
              </div>
            ))}
          </div>

          {prescriptions.length === 0 && (
            <div className="no-prescriptions">
              <p>No prescriptions found.</p>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .prescriptions-page {
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

        .prescriptions-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
        }

        .prescriptions-container {
          background: white;
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.08);
        }

        .prescriptions-list {
          display: grid;
          gap: 20px;
        }

        .prescription-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 249, 255, 0.8));
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .prescription-card:hover {
          border-color: #0891b2;
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.15);
        }

        .prescription-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .prescription-header h3 {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .doctor {
          font-size: 13px;
          color: #0891b2;
          margin: 4px 0 0 0;
          font-weight: 600;
        }

        .status-badge {
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .prescription-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }

        .detail-box {
          display: flex;
          gap: 12px;
        }

        .detail-box .icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .detail-box .label {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0;
          font-weight: 700;
        }

        .detail-box .value {
          font-size: 13px;
          color: #0f172a;
          margin: 4px 0 0 0;
          font-weight: 600;
        }

        .prescription-actions {
          display: flex;
          gap: 12px;
        }

        .btn-refill {
          flex: 1;
          padding: 10px 16px;
          background: linear-gradient(135deg, rgba(22, 163, 74, 0.1), rgba(22, 163, 74, 0.05));
          color: #16a34a;
          border: 1.5px solid rgba(22, 163, 74, 0.3);
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-refill:hover {
          background: rgba(22, 163, 74, 0.2);
          border-color: #16a34a;
        }

        .btn-details {
          flex: 1;
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

        .btn-details:hover {
          background: rgba(8, 145, 178, 0.2);
          border-color: #0891b2;
        }

        .no-prescriptions {
          text-align: center;
          padding: 60px 20px;
          color: #475569;
        }

        @media (max-width: 768px) {
          .prescriptions-main {
            padding: 20px 16px;
          }

          .prescriptions-container {
            padding: 20px;
          }

          .tool-header h1 {
            font-size: 24px;
          }

          .prescription-details {
            grid-template-columns: repeat(2, 1fr);
          }

          .prescription-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
