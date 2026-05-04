'use client';

import Link from 'next/link';
import { useState } from 'react';

interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  reason: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    doctorName: 'Dr. Rajesh Kumar',
    specialty: 'General Physician',
    date: '2026-05-10',
    time: '10:00 AM',
    reason: 'General Checkup',
    status: 'scheduled'
  },
  {
    id: '2',
    doctorName: 'Dr. Priya Singh',
    specialty: 'Cardiologist',
    date: '2026-04-28',
    time: '02:30 PM',
    reason: 'Cardiac Evaluation',
    status: 'completed'
  }
];

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    date: '',
    time: '',
    reason: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ...formData,
      status: 'scheduled'
    };
    setAppointments([...appointments, newAppointment]);
    setFormData({ doctorName: '', specialty: '', date: '', time: '', reason: '' });
    setShowForm(false);
  };

  const cancelAppointment = (id: string) => {
    setAppointments(appointments.map(app =>
      app.id === id ? { ...app, status: 'cancelled' } : app
    ));
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'scheduled': return '#16a34a';
      case 'completed': return '#0891b2';
      case 'cancelled': return '#dc2626';
      default: return '#64748b';
    }
  };

  return (
    <div className="appointments-page">
      <header className="tool-header">
        <div className="tool-header-content">
          <div>
            <Link href="/dashboard" className="back-link">← Back to Dashboard</Link>
            <h1>📅 Book Appointments</h1>
            <p>Schedule and manage your doctor appointments</p>
          </div>
        </div>
      </header>

      <main className="appointments-main">
        <div className="appointments-container">
          <div className="appointments-header">
            <h2>Your Appointments</h2>
            <button 
              onClick={() => setShowForm(!showForm)}
              className="btn-new-appointment"
            >
              + Book New Appointment
            </button>
          </div>

          {showForm && (
            <div className="appointment-form-card">
              <h3>Book an Appointment</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Doctor Name *</label>
                    <input
                      type="text"
                      value={formData.doctorName}
                      onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                      placeholder="Dr. John Doe"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Specialty *</label>
                    <select
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      required
                    >
                      <option value="">Select Specialty</option>
                      <option value="General Physician">General Physician</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Pediatrician">Pediatrician</option>
                      <option value="Dermatologist">Dermatologist</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Appointment Date *</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Time *</label>
                    <input
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Reason for Visit *</label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    placeholder="Describe your symptoms or reason for visit..."
                    rows={4}
                    required
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-submit">Schedule Appointment</button>
                  <button type="button" onClick={() => setShowForm(false)} className="btn-cancel">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="appointments-list">
            {appointments.length === 0 ? (
              <div className="no-appointments">
                <p>No appointments scheduled yet.</p>
                <button onClick={() => setShowForm(true)} className="btn-new-appointment">
                  Book Your First Appointment
                </button>
              </div>
            ) : (
              appointments.map((appointment) => (
                <div key={appointment.id} className="appointment-card">
                  <div className="appointment-header">
                    <div>
                      <h4>{appointment.doctorName}</h4>
                      <p className="specialty">{appointment.specialty}</p>
                    </div>
                    <span 
                      className="status-badge"
                      style={{ backgroundColor: `${getStatusColor(appointment.status)}22`, color: getStatusColor(appointment.status) }}
                    >
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="appointment-details">
                    <div className="detail-item">
                      <span className="icon">📅</span>
                      <div>
                        <p className="label">Date</p>
                        <p className="value">{new Date(appointment.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="icon">🕐</span>
                      <div>
                        <p className="label">Time</p>
                        <p className="value">{appointment.time}</p>
                      </div>
                    </div>
                    <div className="detail-item">
                      <span className="icon">🏥</span>
                      <div>
                        <p className="label">Reason</p>
                        <p className="value">{appointment.reason}</p>
                      </div>
                    </div>
                  </div>

                  {appointment.status === 'scheduled' && (
                    <div className="appointment-actions">
                      <button className="btn-reschedule">Reschedule</button>
                      <button 
                        onClick={() => cancelAppointment(appointment.id)}
                        className="btn-cancel-appointment"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      <style jsx>{`
        .appointments-page {
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

        .appointments-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 24px;
        }

        .appointments-container {
          background: white;
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.08);
        }

        .appointments-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
        }

        .appointments-header h2 {
          font-size: 24px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .btn-new-appointment {
          padding: 12px 24px;
          background: linear-gradient(135deg, #16a34a, #15803d);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-new-appointment:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(22, 163, 74, 0.25);
        }

        .appointment-form-card {
          background: linear-gradient(135deg, rgba(22, 163, 74, 0.08), rgba(8, 145, 178, 0.06));
          border: 2px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 32px;
        }

        .appointment-form-card h3 {
          font-size: 18px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 20px 0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 700;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px;
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          background: white;
          color: #0f172a;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #0891b2;
          box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .btn-submit {
          flex: 1;
          padding: 12px 24px;
          background: linear-gradient(135deg, #0891b2, #0369a1);
          color: white;
          border: none;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-submit:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(8, 145, 178, 0.25);
        }

        .btn-cancel {
          flex: 1;
          padding: 12px 24px;
          background: white;
          color: #475569;
          border: 1.5px solid #d1d5db;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-cancel:hover {
          border-color: #9ca3af;
          background: #f9fafb;
        }

        .appointments-list {
          display: grid;
          gap: 20px;
        }

        .no-appointments {
          text-align: center;
          padding: 60px 20px;
          color: #475569;
        }

        .no-appointments p {
          font-size: 16px;
          margin-bottom: 20px;
        }

        .appointment-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 249, 255, 0.8));
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .appointment-card:hover {
          border-color: #0891b2;
          box-shadow: 0 12px 32px rgba(59, 130, 246, 0.15);
        }

        .appointment-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }

        .appointment-header h4 {
          font-size: 16px;
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .specialty {
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

        .appointment-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 16px;
          margin-bottom: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
        }

        .detail-item {
          display: flex;
          gap: 12px;
        }

        .detail-item .icon {
          font-size: 20px;
        }

        .detail-item .label {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin: 0;
          font-weight: 700;
        }

        .detail-item .value {
          font-size: 14px;
          color: #0f172a;
          margin: 4px 0 0 0;
          font-weight: 600;
        }

        .appointment-actions {
          display: flex;
          gap: 12px;
        }

        .btn-reschedule {
          flex: 1;
          padding: 10px 16px;
          background: rgba(8, 145, 178, 0.1);
          color: #0891b2;
          border: 1.5px solid rgba(8, 145, 178, 0.3);
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-reschedule:hover {
          background: rgba(8, 145, 178, 0.2);
          border-color: #0891b2;
        }

        .btn-cancel-appointment {
          flex: 1;
          padding: 10px 16px;
          background: rgba(220, 38, 38, 0.1);
          color: #dc2626;
          border: 1.5px solid rgba(220, 38, 38, 0.3);
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .btn-cancel-appointment:hover {
          background: rgba(220, 38, 38, 0.2);
          border-color: #dc2626;
        }

        @media (max-width: 768px) {
          .appointments-main {
            padding: 20px 16px;
          }

          .appointments-container {
            padding: 20px;
          }

          .appointments-header {
            flex-direction: column;
            gap: 16px;
            align-items: flex-start;
          }

          .tool-header h1 {
            font-size: 24px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .appointment-details {
            grid-template-columns: 1fr;
          }

          .appointment-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
