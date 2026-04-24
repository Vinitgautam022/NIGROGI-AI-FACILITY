import { NextResponse } from 'next/server';
import { AnalysisResult, analyzeReportSmart, analyzeSymptomsSmart, generateClinicalNoteSmart } from '@/lib/analysis';

export const runtime = 'edge';

type RequestBody = {
  patientLabel?: string;
  symptoms?: {
    age?: string;
    sex?: string;
    duration?: string;
    symptoms?: string;
    severity?: string;
    preferredLanguage?: string;
    doctorPreference?: string;
  };
  report?: {
    reportTitle?: string;
    reportText?: string;
    preferredLanguage?: string;
    doctorPreference?: string;
  };
  preferredLanguage?: string;
  doctorPreference?: string;
  symptomAnalysis?: AnalysisResult;
  reportAnalysis?: AnalysisResult;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;
    const symptomInput = body.symptoms ?? {};
    const reportInput = body.report ?? {};

    const symptomAnalysis =
      body.symptomAnalysis ??
      (await analyzeSymptomsSmart({
        age: String(symptomInput.age ?? ''),
        sex: String(symptomInput.sex ?? ''),
        duration: String(symptomInput.duration ?? ''),
        symptoms: String(symptomInput.symptoms ?? ''),
        severity: String(symptomInput.severity ?? ''),
        preferredLanguage: String(body.preferredLanguage ?? symptomInput.preferredLanguage ?? 'auto'),
        doctorPreference: String(body.doctorPreference ?? symptomInput.doctorPreference ?? 'General Physician')
      }));

    const reportAnalysis =
      body.reportAnalysis ??
      (await analyzeReportSmart({
        reportTitle: String(reportInput.reportTitle ?? ''),
        reportText: String(reportInput.reportText ?? ''),
        preferredLanguage: String(body.preferredLanguage ?? reportInput.preferredLanguage ?? 'auto'),
        doctorPreference: String(body.doctorPreference ?? reportInput.doctorPreference ?? 'General Physician')
      }));
    const noteBundle = await generateClinicalNoteSmart(
      symptomAnalysis,
      reportAnalysis,
      body.patientLabel ?? 'Anonymous patient',
      String(body.preferredLanguage ?? 'auto'),
      String(body.doctorPreference ?? 'General Physician')
    );

    return NextResponse.json({ ...noteBundle, symptomAnalysis, reportAnalysis });
  } catch {
    return NextResponse.json({ error: 'Invalid report generation request body.' }, { status: 400 });
  }
}
