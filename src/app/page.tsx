'use client';

import { FormEvent, memo, useCallback, useMemo, useState, useTransition } from 'react';
import { createWorker } from 'tesseract.js';

type AnalysisResult = {
  summary: string;
  riskLevel: 'low' | 'moderate' | 'high';
  possibilities: Array<{
    disease: string;
    confidence: number;
    reason: string;
  }>;
  recommendedTests: string[];
  redFlags: string[];
};

type SymptomForm = {
  age: string;
  sex: string;
  duration: string;
  severity: string;
  symptoms: string;
};

type ReportBundle = {
  reportTitle: string;
  reportText: string;
};

type ReportAttachment = {
  name: string;
  kind: 'sample' | 'text' | 'image' | 'pdf' | 'other';
};

const initialSymptoms: SymptomForm = {
  age: '34',
  sex: 'Female',
  duration: '3 days',
  severity: 'Moderate',
  symptoms: 'Fever, cough, and fatigue with mild body aches.'
};

const initialReport: ReportBundle = {
  reportTitle: 'Lab summary',
  reportText: 'Hemoglobin slightly low. LDL cholesterol elevated. Glucose at the upper limit of normal.'
};

function isImageFile(file: File) {
  return file.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(file.name);
}

const ResultBlock = memo(function ResultBlock({ title, result }: { title: string; result: AnalysisResult | null }) {
  if (!result) {
    return (
      <div className="result-card">
        <h3>{title}</h3>
        <p>Run the analysis to see model output here.</p>
      </div>
    );
  }

  const primary = result.possibilities[0];

  return (
    <div className="result-card">
      <h3>{title}</h3>
      <p>{result.summary}</p>
      <div className="chip-row" style={{ margin: '14px 0' }}>
        <span className="chip">Risk: {result.riskLevel}</span>
        <span className="chip">Top match: {primary?.disease}</span>
        <span className="chip">Confidence: {Math.round((primary?.confidence ?? 0) * 100)}%</span>
      </div>
      <div className="result-stack">
        <div>
          <h3>Possible conditions</h3>
          <ul className="result-list">
            {result.possibilities.map((item) => (
              <li key={item.disease}>
                <strong>{item.disease}</strong> - {Math.round(item.confidence * 100)}% - {item.reason}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Suggested next tests</h3>
          <ul className="result-list">
            {result.recommendedTests.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Red flags</h3>
          <ul className="result-list">
            {result.redFlags.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
});

export default function Home() {
  const buildLabel = 'GitHub deploy ready';
  const [symptoms, setSymptoms] = useState(initialSymptoms);
  const [report, setReport] = useState(initialReport);
  const [reportAttachment, setReportAttachment] = useState<ReportAttachment>({
    name: initialReport.reportTitle,
    kind: 'sample'
  });
  const [symptomResult, setSymptomResult] = useState<AnalysisResult | null>(null);
  const [reportResult, setReportResult] = useState<AnalysisResult | null>(null);
  const [combinedNote, setCombinedNote] = useState('');
  const [status, setStatus] = useState('Ready for triage input.');
  const [isPending, startTransition] = useTransition();
  const [isReportPending, startReportTransition] = useTransition();
  const [isCombinedPending, startCombinedTransition] = useTransition();

  const clearSymptomOutput = useCallback(() => {
    setSymptomResult(null);
    setCombinedNote('');
  }, []);

  const clearReportOutput = useCallback(() => {
    setReportResult(null);
    setCombinedNote('');
  }, []);

  async function postJson<T>(url: string, payload: unknown): Promise<T> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      cache: 'no-store',
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      let message = `Request failed with ${response.status}`;

      try {
        const body = (await response.json()) as { error?: string };
        if (body.error) {
          message = body.error;
        }
      } catch {
        try {
          const text = await response.text();
          if (text.trim()) {
            message = text;
          }
        } catch {
          // Keep the default message when the response body is unavailable.
        }
      }

      throw new Error(message);
    }

    return response.json() as Promise<T>;
  }

  const updateSymptomField = useCallback((field: keyof SymptomForm, value: string) => {
    clearSymptomOutput();
    setSymptoms((current) => ({ ...current, [field]: value }));
  }, [clearSymptomOutput]);

  const updateReportField = useCallback((field: keyof ReportBundle, value: string) => {
    clearReportOutput();
    setReport((current) => ({ ...current, [field]: value }));
    setReportAttachment({ name: 'Custom report', kind: 'text' });
  }, [clearReportOutput]);

  const handleFileUpload = useCallback(async (file: File | null) => {
    if (!file) {
      return;
    }

    clearReportOutput();

    try {
      if (isImageFile(file)) {
        setReportAttachment({ name: file.name, kind: 'image' });
        setStatus(`Running OCR on ${file.name}...`);

        const worker = await createWorker('eng');
        try {
          const { data } = await worker.recognize(file);
          const extractedText = data.text.trim();

          setReport((current) => ({
            ...current,
            reportTitle: file.name,
            reportText: extractedText || `Uploaded image: ${file.name}`
          }));
          setStatus(extractedText ? `OCR completed for ${file.name}.` : `No readable text was detected in ${file.name}.`);
        } finally {
          await worker.terminate();
        }

        return;
      }

      const text = await file.text();
      setReportAttachment({ name: file.name, kind: file.type === 'application/pdf' ? 'pdf' : 'text' });
      setReport((current) => ({
        ...current,
        reportTitle: file.name,
        reportText: text.trim() || `Uploaded file: ${file.name}`
      }));
      setStatus(`Loaded ${file.name} into the report analysis panel.`);
    } catch {
      setReportAttachment({ name: file.name, kind: 'other' });
      setReport((current) => ({
        ...current,
        reportTitle: file.name,
        reportText: `Uploaded file: ${file.name}. The browser could not extract readable text automatically, so manual review is needed.`
      }));
      setStatus(`Loaded ${file.name}, but the browser could not extract readable text from it.`);
    }
  }, [clearReportOutput]);

  const analyzeSymptoms = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startTransition(async () => {
      try {
        setStatus('Analyzing symptoms...');
        const result = await postJson<AnalysisResult>('/api/analyze-symptoms', symptoms);
        setSymptomResult(result);
        setStatus('Symptom analysis completed.');
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Symptom analysis failed.');
      }
    });
  }, [startTransition, symptoms]);

  const analyzeReport = useCallback((event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    startReportTransition(async () => {
      try {
        setStatus('Analyzing uploaded report...');
        const result = await postJson<AnalysisResult>('/api/analyze-report', report);
        setReportResult(result);
        setStatus('Report analysis completed.');
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Report analysis failed.');
      }
    });
  }, [report, startReportTransition]);

  const hasCurrentAnalyses = useMemo(() => symptomResult !== null && reportResult !== null, [symptomResult, reportResult]);

  const generateCombinedNote = useCallback(() => {
    startCombinedTransition(async () => {
      try {
        setStatus('Generating the combined medical note...');
        const response = await postJson<{ note: string }>('/api/generate-report', {
          patientLabel: `${symptoms.age}-year-old ${symptoms.sex}`,
          symptoms,
          report,
          symptomAnalysis: symptomResult,
          reportAnalysis: reportResult
        });
        setCombinedNote(response.note);
        setStatus('Combined medical note generated.');
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Could not generate the combined note.');
      }
    });
  }, [report, reportResult, startCombinedTransition, symptomResult, symptoms]);

  return (
    <main className="app-shell">
      <div className="page">
        <section className="hero">
          <div className="brand-card">
            <span className="kicker">AI-Powered Virtual Hospital</span>
            <h1 className="title">Intelligent triage for symptoms and medical reports.</h1>
            <p className="lead">
              This starter app simulates an intake desk where patients describe their symptoms,
              upload clinical reports, and receive preliminary analysis, test suggestions, and a
              structured medical summary. The current logic is rule-based and ready to be replaced
              with real ML and NLP services.
            </p>
            <p className="deployment-stamp">Deployment status: {buildLabel} on Render from the GitHub repo root.</p>
            <div className="hero-grid">
              <div className="stat-card">
                <p className="stat-label">Symptom analysis</p>
                <p className="stat-value">Preliminary disease prediction</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Report review</p>
                <p className="stat-value">Secondary findings detector</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Medical report</p>
                <p className="stat-value">AI-generated note</p>
              </div>
              <div className="stat-card">
                <p className="stat-label">Next steps</p>
                <p className="stat-value">Suggested diagnostics</p>
              </div>
            </div>
          </div>

          <aside className="panel">
            <h2 className="section-title">System status</h2>
            <p className="section-copy">
              {status} The interface is built so you can later connect real models, file parsers,
              and a clinician review workflow without redesigning the experience.
            </p>
            <div className="grid-2">
              <div className="metric">
                <h3>Primary model</h3>
                <p>Symptoms to likely conditions and triage signals.</p>
              </div>
              <div className="metric">
                <h3>Secondary model</h3>
                <p>Uploaded report review for hidden health indicators.</p>
              </div>
            </div>
            <div className="notice" style={{ marginTop: 16 }}>
              <h3>Important</h3>
              <p>
                This project is a starter and does not replace professional medical care. Any real
                deployment should include clinical validation, privacy controls, and safety review.
              </p>
            </div>
          </aside>
        </section>

        <section className="panel">
          <h2 className="section-title">Patient symptom intake</h2>
          <p className="section-copy">
            Describe the main symptoms, duration, and severity. The API returns a preliminary
            triage summary, possible conditions, and suggested follow-up tests.
          </p>
          <form className="form-grid" onSubmit={analyzeSymptoms}>
            <div>
              <label className="field-label" htmlFor="age">
                Age
              </label>
              <input id="age" className="field" value={symptoms.age} onChange={(event) => updateSymptomField('age', event.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="sex">
                Sex
              </label>
              <input id="sex" className="field" value={symptoms.sex} onChange={(event) => updateSymptomField('sex', event.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="duration">
                Duration
              </label>
              <input id="duration" className="field" value={symptoms.duration} onChange={(event) => updateSymptomField('duration', event.target.value)} />
            </div>
            <div>
              <label className="field-label" htmlFor="severity">
                Severity
              </label>
              <input id="severity" className="field" value={symptoms.severity} onChange={(event) => updateSymptomField('severity', event.target.value)} />
            </div>
            <div className="full-width">
              <label className="field-label" htmlFor="symptoms">
                Symptoms
              </label>
              <textarea id="symptoms" className="textarea" value={symptoms.symptoms} onChange={(event) => updateSymptomField('symptoms', event.target.value)} />
            </div>
            <div className="full-width actions">
              <button className="button button-primary" type="submit" disabled={isPending}>
                {isPending ? 'Analyzing...' : 'Analyze symptoms'}
              </button>
              <button
                className="button button-secondary"
                type="button"
                onClick={() => {
                  clearSymptomOutput();
                  setSymptoms({
                    age: '34',
                    sex: 'Female',
                    duration: '3 days',
                    severity: 'Moderate',
                    symptoms: 'Fever, cough, and fatigue with mild body aches.'
                  });
                  setStatus('Loaded the sample patient. Re-run symptom analysis to refresh results.');
                }}
              >
                Load sample patient
              </button>
            </div>
          </form>
        </section>

        <section className="grid-2">
          <div className="panel">
            <h2 className="section-title">Medical report upload</h2>
            <p className="section-copy">
              Upload a PDF, JPG, JPEG, PNG, WEBP, or text-based report. Image uploads are OCR-processed before analysis.
            </p>
            <div className="form-grid">
              <div className="full-width">
                <label className="field-label" htmlFor="reportTitle">
                  Report title
                </label>
                <input id="reportTitle" className="field" value={report.reportTitle} onChange={(event) => updateReportField('reportTitle', event.target.value)} />
              </div>
              <div className="full-width">
                <label className="field-label" htmlFor="reportUpload">
                  Upload report file
                </label>
                <input
                  id="reportUpload"
                  className="file-input"
                  type="file"
                  accept=".txt,.md,.csv,.json,.pdf,.jpg,.jpeg,.png,.webp"
                  onChange={(event) => handleFileUpload(event.target.files?.[0] ?? null)}
                />
              </div>
              <div className="full-width">
                <label className="field-label" htmlFor="reportText">
                  Report text
                </label>
                <textarea id="reportText" className="textarea" value={report.reportText} onChange={(event) => updateReportField('reportText', event.target.value)} />
              </div>
              <div className="full-width actions">
                <button className="button button-primary" type="button" onClick={generateCombinedNote} disabled={isCombinedPending}>
                  {isCombinedPending ? 'Generating...' : 'Generate medical note'}
                </button>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => {
                    clearReportOutput();
                    setReport(initialReport);
                    setReportAttachment({ name: initialReport.reportTitle, kind: 'sample' });
                    setStatus('Loaded the sample report. Re-run report analysis to refresh results.');
                  }}
                >
                  Load sample report
                </button>
              </div>
            </div>
            <form onSubmit={analyzeReport} style={{ marginTop: 16 }}>
              <button className="button button-primary" type="submit" disabled={isReportPending}>
                {isReportPending ? 'Reviewing...' : 'Analyze uploaded report'}
              </button>
            </form>
            <div className="upload-status">
              <div>
                <p className="upload-status-label">Upload ready</p>
                <p className="upload-status-copy">PDF, JPG, JPEG, PNG, WEBP, TXT, MD, CSV, and JSON are accepted. Image uploads are OCR-processed before analysis.</p>
              </div>
              <div className="upload-status-chip">
                {reportAttachment.kind.toUpperCase()} · {reportAttachment.name}
              </div>
            </div>
          </div>

          <div className="panel">
            <h2 className="section-title">Clinical note output</h2>
            <p className="section-copy">
              The generated note combines both inputs into a compact handoff summary for clinician
              review. {hasCurrentAnalyses ? 'Using cached analysis results for faster generation.' : 'Run both analyzers first for the fastest generation path.'}
            </p>
            {combinedNote ? (
              <div className="result-card">
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap', lineHeight: 1.7, color: 'var(--muted)' }}>{combinedNote}</pre>
              </div>
            ) : (
              <div className="result-card">
                <p>Generate a note to preview the combined summary.</p>
              </div>
            )}
          </div>
        </section>

        <section className="grid-2">
          <ResultBlock title="Symptom analysis results" result={symptomResult} />
          <ResultBlock title="Report analysis results" result={reportResult} />
        </section>

        <p className="footer-note">
          Next step: replace the rule-based analyzers with trained models, OCR/document parsing, and
          clinician-authored safety rules.
        </p>
      </div>
    </main>
  );
}
