'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';

interface ClinicalNote {
  language: string;
  translationFallback: boolean;
  translationNote: string;
  clinicalNote: string;
  summary: string;
  recommendations: string[];
  followUpDate: string;
}

export default function NoteGeneratorPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ClinicalNote | null>(null);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    symptoms: '',
    findings: '',
    diagnosis: '',
    treatment: '',
    preferredLanguage: 'en',
    patientName: '',
    doctorName: ''
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to generate note');
      }

      const data = await response.json() as ClinicalNote;
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate clinical note');
    } finally {
      setLoading(false);
    }
  }

  async function handleDownloadPDF() {
    if (!result) return;
    
    try {
      // Simple PDF generation - you can enhance this with jsPDF library
      const element = document.createElement('div');
      element.innerHTML = `
        <h1>${formData.patientName || 'Clinical Note'}</h1>
        <h2>Clinical Assessment</h2>
        ${result.clinicalNote}
        <h2>Summary</h2>
        ${result.summary}
        <h2>Recommendations</h2>
        <ul>${result.recommendations.map(r => `<li>${r}</li>`).join('')}</ul>
      `;
      console.log('PDF Download - Note:', element);
      alert('PDF download feature will be implemented soon. You can copy the content below.');
    } catch (err) {
      setError('Failed to generate PDF');
    }
  }

  return (
    <div className="tool-page">
      <header className="tool-header">
        <div className="tool-header-content">
          <div>
            <Link href="/dashboard" className="back-link">← Back to Dashboard</Link>
            <h1>📋 Clinical Notes</h1>
            <p>Generate comprehensive clinical notes and export as PDF</p>
          </div>
        </div>
      </header>

      <main className="tool-main">
        <div className="tool-container">
          {!result ? (
            <form onSubmit={handleSubmit} className="analysis-form">
              <div className="form-section">
                <h2>Patient & Provider Information</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>Patient Name (Optional)</label>
                    <input
                      type="text"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      placeholder="Enter patient name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Doctor Name (Optional)</label>
                    <input
                      type="text"
                      value={formData.doctorName}
                      onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                      placeholder="Enter doctor name"
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2>Clinical Information</h2>

                <div className="form-group">
                  <label>Chief Complaints / Symptoms</label>
                  <textarea
                    required
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    placeholder="Describe the patient's symptoms..."
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label>Clinical Findings</label>
                  <textarea
                    required
                    value={formData.findings}
                    onChange={(e) => setFormData({ ...formData, findings: e.target.value })}
                    placeholder="Physical examination findings..."
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label>Diagnosis</label>
                  <textarea
                    required
                    value={formData.diagnosis}
                    onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                    placeholder="Clinical diagnosis..."
                    rows={3}
                  />
                </div>

                <div className="form-group">
                  <label>Treatment Plan</label>
                  <textarea
                    required
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    placeholder="Medications, therapy, and follow-up..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="form-section">
                <h2>Preferences</h2>

                <div className="form-group">
                  <label>Preferred Language</label>
                  <select
                    value={formData.preferredLanguage}
                    onChange={(e) => setFormData({ ...formData, preferredLanguage: e.target.value })}
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="ur">Urdu</option>
                    <option value="bn">Bengali</option>
                    <option value="ta">Tamil</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" disabled={loading} className="submit-button">
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Generating Note...
                  </>
                ) : (
                  'Generate Clinical Note'
                )}
              </button>
            </form>
          ) : (
            <div className="analysis-result">
              <div className="result-header">
                <h2>Clinical Note Generated</h2>
                <button onClick={() => setResult(null)} className="new-analysis-btn">
                  New Note
                </button>
              </div>

              <div className="note-card">
                <div className="note-meta">
                  {formData.patientName && <p><strong>Patient:</strong> {formData.patientName}</p>}
                  {formData.doctorName && <p><strong>Provider:</strong> {formData.doctorName}</p>}
                  <p><strong>Language:</strong> {result.language.toUpperCase()}</p>
                  <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              {result.translationFallback && (
                <div className="warning-card">
                  <span className="warning-icon">⚠️</span>
                  <div>
                    <h4>Note</h4>
                    <p>{result.translationNote}</p>
                  </div>
                </div>
              )}

              <div className="note-card">
                <h3>Clinical Assessment</h3>
                <div className="note-content">
                  {result.clinicalNote}
                </div>
              </div>

              <div className="note-card">
                <h3>Summary</h3>
                <div className="note-content">
                  {result.summary}
                </div>
              </div>

              {result.recommendations.length > 0 && (
                <div className="note-card">
                  <h3>Recommendations & Follow-up</h3>
                  <ul className="recommendations-list">
                    {result.recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                  {result.followUpDate && (
                    <p className="follow-up"><strong>Follow-up Date:</strong> {result.followUpDate}</p>
                  )}
                </div>
              )}

              <div className="action-buttons">
                <button onClick={handleDownloadPDF} className="download-btn">
                  📥 Download as PDF
                </button>
                <button onClick={() => {
                  const text = result.clinicalNote + '\n\n' + result.summary + '\n\n' + result.recommendations.join('\n');
                  navigator.clipboard.writeText(text);
                  alert('Note copied to clipboard!');
                }} className="copy-btn">
                  📋 Copy to Clipboard
                </button>
              </div>
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

        .note-card {
          background: rgba(15, 23, 42, 0.6);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 12px;
          padding: 20px;
        }

        .note-card h3 {
          margin: 0 0 16px 0;
          font-size: 16px;
          color: #22c55e;
        }

        .note-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          font-size: 13px;
        }

        .note-meta p {
          margin: 0;
          color: #cbd5e1;
        }

        .note-meta strong {
          color: #22c55e;
        }

        .note-content {
          color: #cbd5e1;
          line-height: 1.6;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .recommendations-list {
          margin: 0;
          padding-left: 20px;
          color: #cbd5e1;
        }

        .recommendations-list li {
          margin: 8px 0;
        }

        .follow-up {
          margin-top: 12px;
          color: #86efac;
          font-size: 14px;
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

        .action-buttons {
          display: flex;
          gap: 12px;
          margin-top: 24px;
        }

        .download-btn,
        .copy-btn {
          flex: 1;
          padding: 12px;
          border: 1.5px solid rgba(34, 197, 94, 0.5);
          background: rgba(34, 197, 94, 0.05);
          color: #22c55e;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .download-btn:hover,
        .copy-btn:hover {
          background: rgba(34, 197, 94, 0.15);
          border-color: #22c55e;
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

          .action-buttons {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
