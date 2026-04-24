'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

interface Doctor {
  id: string;
  name: string;
  specialist: string;
  city: string;
  availability: 'today' | 'tomorrow' | 'week';
  rating?: number;
  experience?: number;
  phone?: string;
}

const DOCTORS_DIRECTORY: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Rajesh Kumar',
    specialist: 'General Physician',
    city: 'Delhi',
    availability: 'today',
    rating: 4.8,
    experience: 15,
    phone: '+91-98765-43210'
  },
  {
    id: '2',
    name: 'Dr. Priya Singh',
    specialist: 'Cardiologist',
    city: 'Mumbai',
    availability: 'tomorrow',
    rating: 4.9,
    experience: 12,
    phone: '+91-98765-43211'
  },
  {
    id: '3',
    name: 'Dr. Amit Patel',
    specialist: 'Neurologist',
    city: 'Delhi',
    availability: 'week',
    rating: 4.7,
    experience: 10,
    phone: '+91-98765-43212'
  },
  {
    id: '4',
    name: 'Dr. Sarah Khan',
    specialist: 'Dermatologist',
    city: 'Bangalore',
    availability: 'today',
    rating: 4.6,
    experience: 8,
    phone: '+91-98765-43213'
  },
  {
    id: '5',
    name: 'Dr. Vivek Sharma',
    specialist: 'ENT Specialist',
    city: 'Hyderabad',
    availability: 'tomorrow',
    rating: 4.5,
    experience: 7,
    phone: '+91-98765-43214'
  },
  {
    id: '6',
    name: 'Dr. Neha Gupta',
    specialist: 'Pediatrician',
    city: 'Delhi',
    availability: 'week',
    rating: 4.9,
    experience: 14,
    phone: '+91-98765-43215'
  }
];

export default function DoctorFinderPage() {
  const [results, setResults] = useState<Doctor[] | null>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    specialty: '',
    city: '',
    availability: 'any'
  });

  async function handleSearch(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    let filtered = DOCTORS_DIRECTORY;

    if (formData.specialty) {
      filtered = filtered.filter(d => 
        d.specialist.toLowerCase().includes(formData.specialty.toLowerCase())
      );
    }

    if (formData.city) {
      filtered = filtered.filter(d => 
        d.city.toLowerCase().includes(formData.city.toLowerCase())
      );
    }

    if (formData.availability !== 'any') {
      filtered = filtered.filter(d => d.availability === formData.availability);
    }

    setResults(filtered);
    setLoading(false);
  }

  const availabilityColors = {
    today: '#22c55e',
    tomorrow: '#3b82f6',
    week: '#f59e0b'
  };

  const availabilityLabels = {
    today: 'Available Today',
    tomorrow: 'Available Tomorrow',
    week: 'Available This Week'
  };

  return (
    <div className="tool-page">
      <header className="tool-header">
        <div className="tool-header-content">
          <div>
            <Link href="/dashboard" className="back-link">← Back to Dashboard</Link>
            <h1>👨‍⚕️ Doctor Finder</h1>
            <p>Find and connect with doctors based on specialty and availability</p>
          </div>
        </div>
      </header>

      <main className="tool-main">
        <div className="tool-container">
          <form onSubmit={handleSearch} className="search-form">
            <div className="form-row">
              <div className="form-group">
                <label>Medical Specialty</label>
                <input
                  type="text"
                  placeholder="e.g., Cardiologist, Neurologist..."
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>City / Location</label>
                <input
                  type="text"
                  placeholder="e.g., Delhi, Mumbai..."
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Availability</label>
                <select
                  value={formData.availability}
                  onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                >
                  <option value="any">Any Time</option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
                  <option value="week">This Week</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="search-button">
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Searching...
                </>
              ) : (
                '🔍 Search Doctors'
              )}
            </button>
          </form>

          {results !== null && (
            <div className="results-section">
              <div className="results-header">
                <h2>
                  {results.length > 0 
                    ? `Found ${results.length} Doctor${results.length !== 1 ? 's' : ''}` 
                    : 'No doctors found matching your criteria'}
                </h2>
                <button onClick={() => setResults(null)} className="clear-btn">
                  Clear Results
                </button>
              </div>

              {results.length > 0 && (
                <div className="doctors-grid">
                  {results.map((doctor) => (
                    <div key={doctor.id} className="doctor-card">
                      <div className="doctor-header">
                        <div>
                          <h3>{doctor.name}</h3>
                          <p className="specialty">{doctor.specialist}</p>
                        </div>
                        {doctor.rating && (
                          <div className="rating">
                            <span className="stars">⭐</span>
                            <span className="rating-value">{doctor.rating}</span>
                          </div>
                        )}
                      </div>

                      <div className="doctor-details">
                        <div className="detail-item">
                          <span className="label">📍 Location</span>
                          <span className="value">{doctor.city}</span>
                        </div>
                        {doctor.experience && (
                          <div className="detail-item">
                            <span className="label">👨‍💼 Experience</span>
                            <span className="value">{doctor.experience} years</span>
                          </div>
                        )}
                        <div className="detail-item">
                          <span className="label">🕐 Availability</span>
                          <span 
                            className="availability-badge"
                            style={{ backgroundColor: availabilityColors[doctor.availability] }}
                          >
                            {availabilityLabels[doctor.availability]}
                          </span>
                        </div>
                      </div>

                      <div className="doctor-actions">
                        {doctor.phone && (
                          <a href={`tel:${doctor.phone}`} className="action-btn call-btn">
                            📞 Call
                          </a>
                        )}
                        <button className="action-btn book-btn">
                          📅 Book Appointment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <style jsx>{`
        .tool-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
          color: #e2e8f0;
        }

        .tool-header {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid rgba(34, 197, 94, 0.2);
          padding: 30px 0;
          position: sticky;
          top: 0;
          z-index: 100;
        }

        .tool-header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }

        .back-link {
          color: #22c55e;
          text-decoration: none;
          font-size: 13px;
          font-weight: 600;
          margin-bottom: 10px;
          display: inline-block;
          transition: all 0.3s ease;
        }

        .back-link:hover {
          color: #86efac;
        }

        .tool-header h1 {
          font-size: 32px;
          margin: 10px 0 8px;
          background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .tool-header p {
          color: #cbd5e1;
          margin: 0;
          font-size: 15px;
        }

        .tool-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .tool-container {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 16px;
          padding: 30px;
        }

        .search-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group label {
          color: #cbd5e1;
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-group input,
        .form-group select {
          padding: 12px;
          background: rgba(15, 23, 42, 0.6);
          border: 1.5px solid rgba(34, 197, 94, 0.3);
          border-radius: 8px;
          color: #e2e8f0;
          font-family: inherit;
          font-size: 14px;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-group input:focus,
        .form-group select:focus {
          background: rgba(15, 23, 42, 0.9);
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        .search-button {
          padding: 14px;
          background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 10px;
        }

        .search-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(34, 197, 94, 0.3);
        }

        .search-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .results-section {
          margin-top: 40px;
        }

        .results-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }

        .results-header h2 {
          margin: 0;
          font-size: 20px;
          color: #e2e8f0;
        }

        .clear-btn {
          padding: 8px 16px;
          background: transparent;
          border: 1.5px solid rgba(34, 197, 94, 0.5);
          color: #22c55e;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .clear-btn:hover {
          background: rgba(34, 197, 94, 0.1);
          border-color: #22c55e;
        }

        .doctors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .doctor-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1.5px solid rgba(34, 197, 94, 0.2);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .doctor-card:hover {
          border-color: #22c55e;
          background: rgba(15, 23, 42, 0.9);
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(34, 197, 94, 0.15);
        }

        .doctor-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .doctor-header h3 {
          margin: 0 0 4px 0;
          font-size: 16px;
          color: #e2e8f0;
        }

        .specialty {
          margin: 0;
          color: #22c55e;
          font-size: 13px;
          font-weight: 600;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(34, 197, 94, 0.1);
          padding: 6px 10px;
          border-radius: 6px;
        }

        .stars {
          font-size: 14px;
        }

        .rating-value {
          color: #86efac;
          font-weight: 700;
          font-size: 13px;
        }

        .doctor-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-top: 1px solid rgba(34, 197, 94, 0.1);
          border-bottom: 1px solid rgba(34, 197, 94, 0.1);
          padding: 12px 0;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }

        .detail-item .label {
          color: #94a3b8;
        }

        .detail-item .value {
          color: #cbd5e1;
          font-weight: 500;
        }

        .availability-badge {
          color: white;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        .doctor-actions {
          display: flex;
          gap: 10px;
        }

        .action-btn {
          flex: 1;
          padding: 10px;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }

        .call-btn {
          background: rgba(59, 130, 246, 0.2);
          color: #3b82f6;
          border: 1.5px solid rgba(59, 130, 246, 0.5);
        }

        .call-btn:hover {
          background: rgba(59, 130, 246, 0.3);
          border-color: #3b82f6;
          transform: translateY(-2px);
        }

        .book-btn {
          background: linear-gradient(135deg, #22c55e 0%, #10b981 100%);
          color: white;
          border: none;
        }

        .book-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(34, 197, 94, 0.3);
        }

        @media (max-width: 1024px) {
          .form-row {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .doctors-grid {
            grid-template-columns: 1fr;
          }

          .tool-header h1 {
            font-size: 24px;
          }

          .results-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .action-btn {
            padding: 8px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
