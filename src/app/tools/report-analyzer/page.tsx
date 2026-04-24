'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

interface AnalysisResult {
  language: string;
  translationFallback: boolean;
  translationNote: string;
  summary: string;
  riskLevel: 'low' | 'moderate' | 'high';
  doctorPreference: string;
  doctorSuggestion: string;
  possibilities: Array<{
    disease: string;
    confidence: number;
    reason: string;
  }>;
  recommendedTests: string[];
  redFlags: string[];
  suggestions: string[];
  prescription: string[];
  matchedDoctors: Array<{
    id: string;
    name: string;
    specialist: string;
    city: string;
    availability: string;
  }>;
}

export default function ReportAnalyzerPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    reportTitle: '',
    reportText: '',
    preferredLanguage: 'en',
    doctorPreference: 'General Physician'
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Analysis failed');
      }

      const data = await response.json() as AnalysisResult;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze report');
    } finally {
      setLoading(false);
    }
  }

  const riskColors = {
    low: '#22c55e',
    moderate: '#f59e0b',
    high: '#ef4444'
  };

  return (
    <div className="tool-page">
      <header className="tool-header">
        <div className="tool-header-content">
          <div>
            <Link href="/dashboard" className="back-link">← Back to Dashboard</Link>
            <h1>📄 Report Analyzer</h1>
            <p>Upload and analyze medical reports with advanced processing</p>
          </div>
        </div>
      </header>

      <main className="tool-main">
        <div className="tool-container">
          {!result ? (
            <form onSubmit={handleSubmit} className="analysis-form">
              <div className="form-section">
                <h2>Medical Report</h2>

                <div className="form-group">
                  <label>Report Title (Optional)</label>
                  <input
                    type="text"
                    value={formData.reportTitle}
                    onChange={(e) => setFormData({ ...formData, reportTitle: e.target.value })}
                    placeholder="e.g., Blood Test Report"
                  />
                </div>

                <div className="form-group">
                  <label>Report Content</label>
                  <textarea
                    required
                    value={formData.reportText}
                    onChange={(e) => setFormData({ ...formData, reportText: e.target.value })}
                    placeholder="Paste your medical report content here..."
                    rows={8}
                  />
                </div>

                <div className="info-box">
                  <span>💡</span>
                  <p>You can paste text from your medical reports, lab results, or medical documents</p>
                </div>
              </div>

              <div className="form-section">
                <h2>Preferences</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>Preferred Language</label>
                    <select
                      value={formData.preferredLanguage}
                      onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                    >
                      <option value="auto">Auto-detect</option>
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="ur">Urdu</option>
                      <option value="bn">Bengali</option>
                      <option value="ta">Tamil</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Doctor Type</label>
                    <select
                      value={formData.doctorPreference}
                      onChange={(e) => setFormData({ ...formData, doctorPreference: e.target.value })}
                    >
                      <option value="General Physician">General Physician</option>
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Pathologist">Pathologist</option>
                      <option value="Radiologist">Radiologist</option>
                    </select>
                  </div>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" disabled={loading} className="submit-button">
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing Report...
                  </>
                ) : (
                  'Analyze Report'
                )}
              </button>
            </form>
          ) : (
            <div className="analysis-result">
              <div className="result-header">
                <h2>Report Analysis Results</h2>
                <button onClick={() => setResult(null)} className="new-analysis-btn">
                  New Analysis
                </button>
              </div>

              <div className="result-card risk-card">
                <div className="risk-badge" style={{ borderColor: riskColors[result.riskLevel] }}>
                  <span className="risk-level" style={{ color: riskColors[result.riskLevel] }}>
                    {result.riskLevel.toUpperCase()}
                  </span>
                  <span className="risk-label">Risk Level</span>
                </div>
                <div>
                  <h3>Summary</h3>
                  <p>{result.summary}</p>
                </div>
              </div>

              {result.translationFallback && (
                <div className="warning-card">
                  <span className="warning-icon">⚠️</span>
                  <div>
                    <h4>Translation Note</h4>
                    <p>{result.translationNote}</p>
                  </div>
                </div>
              )}

              <div className="result-card">
                <h3>Key Findings</h3>
                <div className="possibilities-list">
                  {result.possibilities.map((p, i) => (
                    <div key={i} className="possibility-item">
                      <div className="possibility-header">
                        <span className="disease-name">{p.disease}</span>
                        <span className="confidence-badge" style={{
                          backgroundColor: `rgba(34, 197, 94, ${p.confidence / 100})`
                        }}>
                          {Math.round(p.confidence)}%
                        </span>
                      </div>
                      <p>{p.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              {result.redFlags.length > 0 && (
                <div className="result-card alert-card">
                  <h3>⚠️ Critical Findings</h3>
                  <ul>
                    {result.redFlags.map((flag, i) => (
                      <li key={i}>{flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="result-card">
                <h3>Recommendations</h3>
                <ul className="suggestions-list">
                  {result.suggestions.map((suggestion, i) => (
                    <li key={i}>{suggestion}</li>
                  ))}
                </ul>
              </div>

              {result.matchedDoctors.length > 0 && (
                <div className="result-card">
                  <h3>👨‍⚕️ Specialist Recommendations</h3>
                  <div className="doctors-list">
                    {result.matchedDoctors.map((doctor) => (
                      <div key={doctor.id} className="doctor-item">
                        <div className="doctor-info">
                          <h4>{doctor.name}</h4>
                          <p>{doctor.specialist} • {doctor.city}</p>
                        </div>
                        <span className="availability-badge">{doctor.availability}</span>
                      </div>
                    ))}
                  </div>
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
          max-width: 1000px;
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
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px;
        }

        .tool-container {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 16px;
          padding: 30px;
        }

        .analysis-form {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .form-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .form-section h2 {
          font-size: 18px;
          font-weight: 600;
          color: #e2e8f0;
          margin: 0;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
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
        .form-group select,
        .form-group textarea {
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
        .form-group select:focus,
        .form-group textarea:focus {
          background: rgba(15, 23, 42, 0.9);
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        .form-group textarea {
          resize: vertical;
          font-family: inherit;
        }

        .info-box {
          display: flex;
          gap: 12px;
          background: rgba(34, 197, 94, 0.05);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 8px;
          padding: 12px;
          align-items: flex-start;
        }

        .info-box span {
          font-size: 18px;
          flex-shrink: 0;
        }

        .info-box p {
          margin: 0;
          color: #cbd5e1;
          font-size: 13px;
        }

        .error-message {
          padding: 12px;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 8px;
          color: #fca5a5;
          font-size: 13px;
        }

        .submit-button {
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
          margin-top: 20px;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(34, 197, 94, 0.3);
        }

        .submit-button:disabled {
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

        .analysis-result {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .result-header h2 {
          margin: 0;
          font-size: 24px;
        }

        .new-analysis-btn {
          padding: 10px 16px;
          background: transparent;
          border: 1.5px solid rgba(34, 197, 94, 0.5);
          color: #22c55e;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .new-analysis-btn:hover {
          background: rgba(34, 197, 94, 0.1);
          border-color: #22c55e;
        }

        .result-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 12px;
          padding: 20px;
        }

        .result-card h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          color: #22c55e;
        }

        .risk-card {
          display: flex;
          gap: 20px;
          align-items: flex-start;
        }

        .risk-badge {
          border: 2px solid;
          border-radius: 12px;
          padding: 16px;
          text-align: center;
          min-width: 120px;
          flex-shrink: 0;
        }

        .risk-level {
          display: block;
          font-weight: 700;
          font-size: 18px;
        }

        .risk-label {
          display: block;
          color: #94a3b8;
          font-size: 12px;
          margin-top: 4px;
        }

        .warning-card {
          display: flex;
          gap: 12px;
          background: rgba(245, 158, 11, 0.05);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 12px;
          padding: 16px;
        }

        .warning-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .warning-card h4 {
          margin: 0 0 4px 0;
          color: #fbbf24;
        }

        .warning-card p {
          margin: 0;
          color: #d97706;
          font-size: 13px;
        }

        .possibilities-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .possibility-item {
          background: rgba(30, 41, 59, 0.8);
          border-left: 3px solid #22c55e;
          padding: 12px;
          border-radius: 6px;
        }

        .possibility-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .disease-name {
          font-weight: 600;
          color: #e2e8f0;
        }

        .confidence-badge {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          color: white;
        }

        .possibility-item p {
          margin: 0;
          color: #cbd5e1;
          font-size: 13px;
        }

        .alert-card {
          background: rgba(239, 68, 68, 0.05);
          border-color: rgba(239, 68, 68, 0.2);
        }

        .alert-card ul {
          margin: 0;
          padding-left: 20px;
          color: #fca5a5;
        }

        .alert-card li {
          margin: 8px 0;
        }

        .suggestions-list {
          margin: 0;
          padding-left: 20px;
          color: #cbd5e1;
        }

        .suggestions-list li {
          margin: 8px 0;
        }

        .doctors-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .doctor-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(15, 23, 42, 0.8);
          padding: 12px;
          border-radius: 8px;
          border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .doctor-info h4 {
          margin: 0 0 4px 0;
          color: #e2e8f0;
        }

        .doctor-info p {
          margin: 0;
          color: #94a3b8;
          font-size: 12px;
        }

        .availability-badge {
          background: rgba(34, 197, 94, 0.2);
          color: #86efac;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .tool-header h1 {
            font-size: 24px;
          }

          .result-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;
          }

          .risk-card {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
