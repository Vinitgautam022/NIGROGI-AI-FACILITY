'use client';

import { FormEvent, useState, useEffect } from 'react';
import Link from 'next/link';
import jsPDF from 'jspdf';

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

const REPORT_EXAMPLES = {
  blood: {
    title: 'Blood Test Report',
    example: 'Hemoglobin: 14.5 g/dL, WBC: 7500, Platelets: 250000, LDL: 150 mg/dL, Glucose: 95 mg/dL, Creatinine: 0.9',
    description: 'Complete Blood Count (CBC), Lipid Profile, Blood Sugar Tests'
  },
  ct: {
    title: 'CT Scan Report',
    example: 'CT Chest: No focal consolidation. Heart size normal. No acute findings. Aorta and pulmonary vessels normal.',
    description: 'CT Scan, Computed Tomography Imaging'
  },
  mri: {
    title: 'MRI Report',
    example: 'MRI Brain: No abnormal signal intensity. Ventricles and sulci are normal. No mass effect. Normal flow voids.',
    description: 'Magnetic Resonance Imaging'
  },
  xray: {
    title: 'X-Ray Report',
    example: 'Chest X-Ray: Heart size normal. Lung fields clear bilaterally. No evidence of pneumonia or pneumothorax.',
    description: 'Radiographic Imaging (Chest, Abdomen, Extremities)'
  },
  ultrasound: {
    title: 'Ultrasound Report',
    example: 'Abdominal Ultrasound: Liver is homogeneous. Pancreas appears normal. No free fluid. Kidneys normal.',
    description: 'Sonography, Doppler Ultrasound'
  },
  ecg: {
    title: 'ECG Report',
    example: 'ECG: Normal sinus rhythm, rate 72/min. PR: 160ms. QRS: 80ms. No ST segment changes. Normal variant.',
    description: 'Electrocardiogram, Cardiac Assessment'
  }
};

export default function ReportAnalyzerPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');
  const [suggestedDoctor, setSuggestedDoctor] = useState('');

  const [formData, setFormData] = useState({
    reportTitle: '',
    reportType: 'blood',
    reportText: '',
    preferredLanguage: 'en',
    doctorPreference: ''
  });

  // Auto-suggest doctor based on report text
  useEffect(() => {
    if (formData.reportText.length > 20) {
      const text = formData.reportText.toLowerCase();
      let suggested = 'General Physician';
      
      if (text.includes('heart') || text.includes('cardiac') || text.includes('ecg') || text.includes('cholesterol')) {
        suggested = 'Cardiologist';
      } else if (text.includes('brain') || text.includes('neural') || text.includes('ct') || text.includes('mri')) {
        suggested = 'Neurologist';
      } else if (text.includes('kidney') || text.includes('renal') || text.includes('creatinine')) {
        suggested = 'Nephrologist';
      } else if (text.includes('liver') || text.includes('hepatic') || text.includes('bilirubin')) {
        suggested = 'Gastroenterologist';
      } else if (text.includes('lung') || text.includes('chest') || text.includes('respiratory')) {
        suggested = 'Pulmonologist';
      } else if (text.includes('blood') || text.includes('hemoglobin') || text.includes('anemia')) {
        suggested = 'Hematologist';
      }
      
      setSuggestedDoctor(suggested);
      if (!formData.doctorPreference) {
        setFormData(prev => ({ ...prev, doctorPreference: suggested }));
      }
    }
  }, [formData.reportText, formData.doctorPreference]);

  function insertExample(reportType: keyof typeof REPORT_EXAMPLES) {
    const example = REPORT_EXAMPLES[reportType];
    setFormData(prev => ({
      ...prev,
      reportType,
      reportTitle: example.title,
      reportText: example.example
    }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/analyze-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportTitle: formData.reportTitle,
          reportText: formData.reportText,
          preferredLanguage: formData.preferredLanguage,
          doctorPreference: formData.doctorPreference || suggestedDoctor
        })
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

  function downloadPDF() {
    if (!result) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;
    const margin = 15;
    const contentWidth = pageWidth - 2 * margin;

    // Title
    doc.setFontSize(20);
    doc.text('Medical Report Analysis', margin, yPosition);
    yPosition += 15;

    // Header info
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Report: ${formData.reportTitle || 'Medical Report'}`, margin, yPosition);
    yPosition += 6;
    doc.text(`Date: ${new Date().toLocaleDateString()}`, margin, yPosition);
    yPosition += 12;

    // Risk level
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text(`Risk Level: ${result.riskLevel.toUpperCase()}`, margin, yPosition);
    yPosition += 10;

    // Summary
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'bold');
    doc.text('Summary', margin, yPosition);
    yPosition += 6;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(result.summary, contentWidth);
    doc.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 5 + 8;

    // Key Findings
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'bold');
    doc.text('Key Findings', margin, yPosition);
    yPosition += 6;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);

    result.possibilities.forEach((p) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${p.disease} (${Math.round(p.confidence)}%)`, margin, yPosition);
      yPosition += 4;
      const reasonLines = doc.splitTextToSize(p.reason, contentWidth - 5);
      doc.setFont('Helvetica', 'normal');
      doc.text(reasonLines, margin + 2, yPosition);
      yPosition += reasonLines.length * 4 + 4;
    });

    // Red Flags
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'bold');
    doc.text('⚠️ Critical Findings', margin, yPosition);
    yPosition += 6;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);

    result.redFlags.forEach((flag) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      const flagLines = doc.splitTextToSize(`• ${flag}`, contentWidth - 5);
      doc.text(flagLines, margin, yPosition);
      yPosition += flagLines.length * 4 + 3;
    });

    // Recommendations
    if (yPosition > pageHeight - 40) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'bold');
    doc.text('Recommendations', margin, yPosition);
    yPosition += 6;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);

    result.suggestions.forEach((suggestion) => {
      if (yPosition > pageHeight - 30) {
        doc.addPage();
        yPosition = 20;
      }
      const suggestionLines = doc.splitTextToSize(`• ${suggestion}`, contentWidth - 5);
      doc.text(suggestionLines, margin, yPosition);
      yPosition += suggestionLines.length * 4 + 3;
    });

    // Doctor suggestion
    if (yPosition > pageHeight - 30) {
      doc.addPage();
      yPosition = 20;
    }
    doc.setFontSize(11);
    doc.setFont('Helvetica', 'bold');
    doc.text('Doctor Recommendation', margin, yPosition);
    yPosition += 6;
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(10);
    const docLines = doc.splitTextToSize(result.doctorSuggestion, contentWidth);
    doc.text(docLines, margin, yPosition);

    doc.save(`report-analysis-${new Date().getTime()}.pdf`);
  }

  const riskColors = {
    low: '#10b981',
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
            <p>Upload and analyze medical reports with smart doctor recommendations</p>
          </div>
        </div>
      </header>

      <main className="tool-main">
        <div className="tool-container">
          {!result ? (
            <form onSubmit={handleSubmit} className="analysis-form">
              <div className="form-section">
                <h2>Medical Report Type</h2>
                <div className="report-templates">
                  {Object.entries(REPORT_EXAMPLES).map(([key, example]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => insertExample(key as keyof typeof REPORT_EXAMPLES)}
                      className={`template-btn ${formData.reportType === key ? 'active' : ''}`}
                    >
                      <div className="template-title">{example.title}</div>
                      <div className="template-desc">{example.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="form-section">
                <h2>Enter Report Details</h2>

                <div className="form-row">
                  <div className="form-group">
                    <label>Upload Report File (PDF or Image)</label>
                    <div className="file-upload-box">
                      <input
                        type="file"
                        id="report-file"
                        accept=".pdf,.jpg,.jpeg,.png,.webp"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              const content = event.target?.result as string;
                              // For text files, use the content
                              if (file.type.includes('text')) {
                                setFormData(prev => ({
                                  ...prev,
                                  reportText: content
                                }));
                              } else {
                                // For PDF/images, show placeholder message
                                setFormData(prev => ({
                                  ...prev,
                                  reportTitle: file.name,
                                  reportText: `[File uploaded: ${file.name}]\n\nPlease paste the extracted text content from your report below for AI analysis.`
                                }));
                              }
                            };
                            reader.onerror = () => {
                              setFormData(prev => ({
                                ...prev,
                                reportTitle: file.name,
                                reportText: `[File: ${file.name}]\nFile uploaded. Please paste the extracted text content below.`
                              }));
                            };
                            reader.readAsText(file);
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                      <label htmlFor="report-file" className="file-upload-label">
                        <div className="upload-icon">📎</div>
                        <div className="upload-text">
                          <p style={{ margin: '0 0 4px 0' }}>Click to upload or drag file</p>
                          <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>PDF, JPG, PNG up to 10MB</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Or Enter Report Title (Optional)</label>
                    <input
                      type="text"
                      value={formData.reportTitle}
                      onChange={(e) => setFormData({ ...formData, reportTitle: e.target.value })}
                      placeholder="e.g., Blood Test Report, CT Scan Results"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Report Content *</label>
                  <textarea
                    required
                    value={formData.reportText}
                    onChange={(e) => setFormData({ ...formData, reportText: e.target.value })}
                    placeholder="Paste your complete medical report content here..."
                    rows={10}
                  />
                  <div className="char-count">{formData.reportText.length} characters</div>
                </div>

                <div className="info-box">
                  <span>💡</span>
                  <p><strong>Tip:</strong> Paste complete lab values, findings, and measurements for better analysis. Include reference ranges if available.</p>
                </div>
              </div>

              <div className="form-section">
                <h2>Preferences & Settings</h2>

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
                    <label>Preferred Doctor Type</label>
                    <div className="doctor-selection">
                      <select
                        value={formData.doctorPreference}
                        onChange={(e) => setFormData({ ...formData, doctorPreference: e.target.value })}
                      >
                        <option value="">Auto-suggest from report</option>
                        <option value="General Physician">General Physician</option>
                        <option value="Cardiologist">Cardiologist (Heart)</option>
                        <option value="Neurologist">Neurologist (Brain)</option>
                        <option value="Pulmonologist">Pulmonologist (Lungs)</option>
                        <option value="Gastroenterologist">Gastroenterologist (Digestive)</option>
                        <option value="Nephrologist">Nephrologist (Kidney)</option>
                        <option value="Hematologist">Hematologist (Blood)</option>
                      </select>
                      {suggestedDoctor && !formData.doctorPreference && (
                        <div className="suggestion-badge">💡 AI suggests: {suggestedDoctor}</div>
                      )}
                    </div>
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
                  '🔍 Analyze Report'
                )}
              </button>
            </form>
          ) : (
            <div className="analysis-result">
              <div className="result-header">
                <div>
                  <h2>Report Analysis Results</h2>
                  <p className="result-subtitle">Complete analysis with doctor recommendations</p>
                </div>
                <div className="result-actions">
                  <button onClick={downloadPDF} className="download-btn">
                    📥 Download PDF
                  </button>
                  <button onClick={() => setResult(null)} className="new-analysis-btn">
                    New Analysis
                  </button>
                </div>
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

              {/* Doctor Recommendation Section */}
              <div className="result-card doctor-recommendation-card">
                <div className="doctor-rec-header">
                  <h3>👨‍⚕️ Recommended Doctor</h3>
                  <span className="doctor-rec-badge">{result.doctorPreference}</span>
                </div>
                <p className="doctor-rec-suggestion">{result.doctorSuggestion}</p>
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
                <h3>Clinical Recommendations</h3>
                <ul className="suggestions-list">
                  {result.suggestions.map((suggestion, i) => (
                    <li key={i}>{suggestion}</li>
                  ))}
                </ul>
              </div>

              <div className="result-card doctor-card">
                <h3>👨‍⚕️ Doctor Recommendation</h3>
                <div className="doctor-suggestion">
                  <div className="specialist-type">{result.doctorPreference}</div>
                  <p>{result.doctorSuggestion}</p>
                </div>
              </div>

              {result.matchedDoctors.length > 0 && (
                <div className="result-card">
                  <h3>Available Specialists</h3>
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
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 12px 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-section h2::before {
          content: '';
          width: 4px;
          height: 20px;
          background: linear-gradient(135deg, #16a34a, #0891b2);
          border-radius: 2px;
        }

        .report-templates {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 12px;
        }

        .template-btn {
          padding: 16px;
          border: 2px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          background: white;
          cursor: pointer;
          transition: all 0.3s ease;
          text-align: left;
        }

        .template-btn:hover {
          border-color: #0891b2;
          box-shadow: 0 4px 12px rgba(8, 145, 178, 0.15);
        }

        .template-btn.active {
          border-color: #0891b2;
          background: rgba(8, 145, 178, 0.08);
        }

        .template-title {
          font-weight: 700;
          color: #0f172a;
          font-size: 14px;
          margin-bottom: 4px;
        }

        .template-desc {
          font-size: 12px;
          color: #64748b;
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
          font-size: 14px;
          font-weight: 700;
          color: #0f172a;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 12px;
          border: 1.5px solid rgba(59, 130, 246, 0.3);
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          background: linear-gradient(135deg, rgba(240, 249, 255, 0.8), rgba(245, 243, 255, 0.8));
          color: #0f172a;
          transition: all 0.3s ease;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #0891b2;
          box-shadow: 0 0 0 3px rgba(8, 145, 178, 0.1);
          background: white;
        }

        .form-group textarea {
          resize: vertical;
          font-family: inherit;
        }

        .char-count {
          font-size: 12px;
          color: #4a7a8a;
          text-align: right;
        }

        .file-upload-box {
          border: 2px dashed rgba(8, 145, 178, 0.5);
          border-radius: 12px;
          padding: 20px;
          background: rgba(8, 145, 178, 0.05);
          transition: all 0.3s ease;
        }

        .file-upload-box:hover {
          background: rgba(8, 145, 178, 0.1);
          border-color: #0891b2;
        }

        .file-upload-label {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 12px;
          cursor: pointer;
        }

        .upload-icon {
          font-size: 32px;
        }

        .upload-text {
          text-align: center;
        }

        .upload-text p {
          color: #0f172a;
          margin: 4px 0;
        }

        .doctor-selection {
          position: relative;
        }

        .suggestion-badge {
          font-size: 12px;
          color: #16a34a;
          margin-top: 6px;
          padding: 8px;
          background: rgba(22, 163, 74, 0.1);
          border-radius: 6px;
          font-weight: 600;
        }

        .info-box {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: rgba(8, 145, 178, 0.08);
          border-left: 4px solid #0891b2;
          border-radius: 8px;
          font-size: 14px;
          color: #0369a1;
        }

        .info-box span {
          font-size: 18px;
          flex-shrink: 0;
        }

        .info-box p {
          margin: 0;
        }

        .error-message {
          padding: 12px;
          background: rgba(220, 38, 38, 0.1);
          border-left: 4px solid #dc2626;
          border-radius: 8px;
          color: #7f1d1d;
          font-size: 14px;
          font-weight: 600;
        }

        .submit-button {
          padding: 14px 24px;
          background: linear-gradient(135deg, #16a34a 0%, #0891b2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-button:hover:not(:disabled) {
          box-shadow: 0 10px 25px rgba(22, 163, 74, 0.3);
          transform: translateY(-2px);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          display: inline-block;
          width: 16px;
          height: 16px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .analysis-result {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .result-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          padding-bottom: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .result-header h2 {
          margin: 0;
          font-size: 24px;
          color: #0f172a;
          font-weight: 700;
        }

        .result-subtitle {
          margin: 4px 0 0;
          color: #64748b;
          font-size: 14px;
        }

        .result-actions {
          display: flex;
          gap: 10px;
        }

        .download-btn,
        .new-analysis-btn {
          padding: 10px 16px;
          border: 1.5px solid rgba(22, 163, 74, 0.4);
          border-radius: 8px;
          background: rgba(22, 163, 74, 0.1);
          color: #16a34a;
          cursor: pointer;
          font-size: 14px;
          font-weight: 700;
          transition: all 0.3s ease;
        }

        .download-btn:hover {
          background: rgba(22, 163, 74, 0.2);
          border-color: #16a34a;
        }

        .new-analysis-btn:hover {
          background: rgba(22, 163, 74, 0.2);
          border-color: #16a34a;
        }

        .result-card {
          padding: 20px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(240, 249, 255, 0.8));
          border: 1.5px solid rgba(59, 130, 246, 0.2);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .result-card h3 {
          margin: 0 0 12px;
          font-size: 16px;
          color: #0f172a;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .result-card h3::before {
          content: '';
          width: 4px;
          height: 16px;
          background: linear-gradient(135deg, #16a34a, #0891b2);
          border-radius: 2px;
        }

        .risk-card {
          display: grid;
          grid-template-columns: auto 1fr;
          gap: 20px;
          align-items: start;
        }

        .risk-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 20px;
          border: 3px solid;
          border-radius: 12px;
          background: linear-gradient(135deg, rgba(240, 249, 255, 0.8), rgba(245, 243, 255, 0.8));
          min-width: 120px;
        }

        .risk-level {
          font-size: 24px;
          font-weight: 800;
        }

        .risk-label {
          font-size: 12px;
          color: #64748b;
          font-weight: 700;
        }

        .warning-card {
          display: flex;
          gap: 12px;
          padding: 16px;
          background: rgba(245, 158, 11, 0.08);
          border-left: 4px solid #ea580c;
          border-radius: 8px;
        }

        .warning-icon {
          font-size: 20px;
          flex-shrink: 0;
        }

        .warning-card h4 {
          margin: 0 0 4px;
          color: #1a3a4a;
        }

        .warning-card p {
          margin: 0;
          font-size: 14px;
          color: #4a7a8a;
        }

        .possibilities-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .possibility-item {
          padding: 12px;
          background: rgba(16, 185, 129, 0.03);
          border-left: 3px solid #10b981;
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
          color: #1a3a4a;
        }

        .confidence-badge {
          font-size: 12px;
          padding: 4px 10px;
          border-radius: 12px;
          color: white;
          font-weight: 600;
        }

        .possibility-item p {
          margin: 0;
          font-size: 14px;
          color: #4a7a8a;
        }

        .alert-card {
          background: rgba(239, 68, 68, 0.05);
          border-left-color: #ef4444;
        }

        .alert-card ul {
          margin: 0;
          padding-left: 20px;
        }

        .alert-card li {
          color: #7f1d1d;
          margin-bottom: 6px;
        }

        .suggestions-list {
          margin: 0;
          padding-left: 20px;
        }

        .suggestions-list li {
          margin-bottom: 8px;
          color: #4a7a8a;
          line-height: 1.5;
        }

        .doctor-card {
          background: linear-gradient(135deg, rgba(0, 102, 204, 0.05) 0%, rgba(6, 182, 212, 0.05) 100%);
          border: 1px solid rgba(0, 102, 204, 0.2);
        }

        .doctor-suggestion {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .specialist-type {
          font-size: 18px;
          font-weight: 700;
          color: #0066cc;
        }

        .doctor-suggestion p {
          margin: 0;
          color: #4a7a8a;
          line-height: 1.6;
        }

        .doctors-list {
          display: grid;
          gap: 12px;
        }

        .doctor-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.5);
          border: 1px solid #e5e7eb;
          border-radius: 8px;
        }

        .doctor-info h4 {
          margin: 0;
          color: #1a3a4a;
          font-size: 15px;
        }

        .doctor-info p {
          margin: 4px 0 0;
          color: #4a7a8a;
          font-size: 13px;
        }

        .availability-badge {
          padding: 6px 12px;
          background: rgba(16, 185, 129, 0.1);
          color: #065f46;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .report-templates {
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          }

          .result-header {
            flex-direction: column;
          }

          .result-actions {
            width: 100%;
            flex-wrap: wrap;
          }

          .risk-card {
            grid-template-columns: 1fr;
          }
          .risk-card {
            grid-template-columns: 1fr;
          }
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

        .doctor-recommendation-card {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.15), rgba(16, 185, 129, 0.1));
          border: 2px solid rgba(34, 197, 94, 0.4);
          position: relative;
          overflow: hidden;
        }

        .doctor-recommendation-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #22c55e, #10b981);
        }

        .doctor-rec-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
        }

        .doctor-rec-header h3 {
          margin: 0;
          font-size: 18px;
          color: #22c55e;
        }

        .doctor-rec-badge {
          display: inline-block;
          background: linear-gradient(135deg, #22c55e, #10b981);
          color: white;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .doctor-rec-suggestion {
          margin: 0;
          color: #cbd5e1;
          font-size: 14px;
          line-height: 1.6;
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
