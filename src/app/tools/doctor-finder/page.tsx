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
  // Delhi
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
    id: '6',
    name: 'Dr. Neha Gupta',
    specialist: 'Pediatrician',
    city: 'Delhi',
    availability: 'week',
    rating: 4.9,
    experience: 14,
    phone: '+91-98765-43215'
  },
  {
    id: '7',
    name: 'Dr. Sanjay Malhotra',
    specialist: 'Cardiologist',
    city: 'Delhi',
    availability: 'today',
    rating: 4.8,
    experience: 16,
    phone: '+91-98765-43216'
  },
  {
    id: '8',
    name: 'Dr. Anjali Verma',
    specialist: 'Gastroenterologist',
    city: 'Delhi',
    availability: 'tomorrow',
    rating: 4.7,
    experience: 11,
    phone: '+91-98765-43217'
  },
  // Mumbai
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
    id: '9',
    name: 'Dr. Vikram Deshmukh',
    specialist: 'Orthopedist',
    city: 'Mumbai',
    availability: 'today',
    rating: 4.6,
    experience: 9,
    phone: '+91-98765-43218'
  },
  {
    id: '10',
    name: 'Dr. Riya Menon',
    specialist: 'Psychiatrist',
    city: 'Mumbai',
    availability: 'week',
    rating: 4.8,
    experience: 8,
    phone: '+91-98765-43219'
  },
  // Bangalore
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
    id: '11',
    name: 'Dr. Madhav Kumar',
    specialist: 'Ophthalmologist',
    city: 'Bangalore',
    availability: 'tomorrow',
    rating: 4.7,
    experience: 13,
    phone: '+91-98765-43220'
  },
  {
    id: '12',
    name: 'Dr. Pooja Nair',
    specialist: 'General Physician',
    city: 'Bangalore',
    availability: 'today',
    rating: 4.8,
    experience: 10,
    phone: '+91-98765-43221'
  },
  // Hyderabad
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
    id: '13',
    name: 'Dr. Ramesh Reddy',
    specialist: 'Pulmonologist',
    city: 'Hyderabad',
    availability: 'today',
    rating: 4.7,
    experience: 14,
    phone: '+91-98765-43222'
  },
  {
    id: '14',
    name: 'Dr. Swati Mishra',
    specialist: 'Oncologist',
    city: 'Hyderabad',
    availability: 'week',
    rating: 4.9,
    experience: 12,
    phone: '+91-98765-43223'
  },
  // Kolkata
  {
    id: '15',
    name: 'Dr. Arun Roy',
    specialist: 'Cardiologist',
    city: 'Kolkata',
    availability: 'today',
    rating: 4.6,
    experience: 11,
    phone: '+91-98765-43224'
  },
  {
    id: '16',
    name: 'Dr. Suparna Chatterjee',
    specialist: 'Gynecologist',
    city: 'Kolkata',
    availability: 'tomorrow',
    rating: 4.8,
    experience: 13,
    phone: '+91-98765-43225'
  },
  // Pune
  {
    id: '17',
    name: 'Dr. Sameer Joshi',
    specialist: 'Neurologist',
    city: 'Pune',
    availability: 'week',
    rating: 4.7,
    experience: 10,
    phone: '+91-98765-43226'
  },
  {
    id: '18',
    name: 'Dr. Divya Kulkarni',
    specialist: 'Dentist',
    city: 'Pune',
    availability: 'today',
    rating: 4.8,
    experience: 7,
    phone: '+91-98765-43227'
  },
  // Gurgaon
  {
    id: '19',
    name: 'Dr. Nitin Garg',
    specialist: 'Urology Specialist',
    city: 'Gurgaon',
    availability: 'tomorrow',
    rating: 4.7,
    experience: 12,
    phone: '+91-98765-43228'
  },
  {
    id: '20',
    name: 'Dr. Meera Bansal',
    specialist: 'General Physician',
    city: 'Gurgaon',
    availability: 'today',
    rating: 4.9,
    experience: 9,
    phone: '+91-98765-43229'
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
          background: linear-gradient(135deg, #ffffff 0%, #f0f9ff 25%, #f5f3ff 50%, #f0f9ff 75%, #ffffff 100%);
          padding-bottom: 40px;
        }

        .tool-header {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 249, 255, 0.95) 100%);
          border-bottom: 2px solid rgba(59, 130, 246, 0.2);
          padding: 30px 0;
          position: sticky;
          top: 0;
          z-index: 100;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.08);
        }

        .tool-header-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
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
          margin: 0;
          font-size: 16px;
        }

        .tool-main {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .tool-container {
          background: white;
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 4px 16px rgba(59, 130, 246, 0.08);
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
          color: #0f172a;
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-group input,
        .form-group select {
          padding: 12px;
          background: linear-gradient(135deg, rgba(240, 249, 255, 0.8), rgba(245, 243, 255, 0.8));
          border: 1.5px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          color: #0f172a;
          font-family: inherit;
          font-size: 14px;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-group input:focus,
        .form-group select:focus {
          background: white;
          border-color: #0891b2;
          box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
        }

        .search-button {
          padding: 14px;
          background: linear-gradient(135deg, #16a34a 0%, #0891b2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 700;
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
          box-shadow: 0 10px 20px rgba(22, 163, 74, 0.3);
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
          color: #0f172a;
        }

        .clear-btn {
          padding: 8px 16px;
          background: rgba(22, 163, 74, 0.1);
          border: 1.5px solid rgba(22, 163, 74, 0.4);
          color: #16a34a;
          border-radius: 6px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .clear-btn:hover {
          background: rgba(22, 163, 74, 0.2);
          border-color: #16a34a;
        }

        .doctors-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
        }

        .doctor-card {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 249, 255, 0.8));
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .doctor-card:hover {
          border-color: #0891b2;
          background: white;
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(59, 130, 246, 0.15);
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
          color: #0f172a;
          font-weight: 700;
        }

        .specialty {
          margin: 0;
          color: #16a34a;
          font-size: 13px;
          font-weight: 700;
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(22, 163, 74, 0.15);
          padding: 6px 10px;
          border-radius: 6px;
        }

        .stars {
          font-size: 14px;
        }

        .rating-value {
          color: #16a34a;
          font-weight: 700;
          font-size: 13px;
        }

        .doctor-details {
          display: flex;
          flex-direction: column;
          gap: 12px;
          border-top: 1px solid rgba(59, 130, 246, 0.2);
          border-bottom: 1px solid rgba(59, 130, 246, 0.2);
          padding: 12px 0;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }

        .detail-item .label {
          color: #64748b;
        }

        .detail-item .value {
          color: #0f172a;
          font-weight: 600;
        }

        .availability-badge {
          color: white;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 700;
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
          background: rgba(8, 145, 178, 0.15);
          color: #0891b2;
          border: 1.5px solid rgba(8, 145, 178, 0.3);
        }

        .call-btn:hover {
          background: rgba(8, 145, 178, 0.25);
          border-color: #0891b2;
          transform: translateY(-2px);
        }

        .book-btn {
          background: linear-gradient(135deg, #16a34a 0%, #0891b2 100%);
          color: white;
          border: none;
          font-weight: 700;
        }

        .book-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(22, 163, 74, 0.3);
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
