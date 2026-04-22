export type SymptomAnalysisInput = {
  age: string;
  sex: string;
  duration: string;
  symptoms: string;
  severity: string;
};

export type ReportAnalysisInput = {
  reportText: string;
  reportTitle?: string;
};

export type AnalysisResult = {
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

type OpenAIChatCompletionResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

type PartialAnalysis = Partial<AnalysisResult> & {
  possibilities?: Array<{
    disease?: string;
    confidence?: number;
    reason?: string;
  }>;
};

const symptomRules = [
  {
    keys: ['fever', 'chills', 'cough', 'sore throat'],
    disease: 'Viral respiratory infection',
    confidence: 0.84,
    reason: 'Respiratory symptoms combined with fever often point toward a viral infection pattern.'
  },
  {
    keys: ['chest pain', 'shortness of breath', 'pressure'],
    disease: 'Cardiopulmonary condition',
    confidence: 0.81,
    reason: 'Chest discomfort or breathing difficulty deserves urgent cardiopulmonary evaluation.'
  },
  {
    keys: ['abdominal pain', 'nausea', 'vomiting', 'diarrhea'],
    disease: 'Gastrointestinal infection or inflammation',
    confidence: 0.78,
    reason: 'Digestive distress suggests an infectious or inflammatory gastrointestinal cause.'
  },
  {
    keys: ['headache', 'blurred vision', 'dizziness'],
    disease: 'Neurologic or migraine-related issue',
    confidence: 0.72,
    reason: 'Headache with vision or balance changes warrants neurologic screening.'
  },
  {
    keys: ['rash', 'itching', 'swelling'],
    disease: 'Allergic or dermatologic reaction',
    confidence: 0.75,
    reason: 'Skin findings and swelling are commonly associated with allergic or inflammatory reactions.'
  }
] as const;

const reportRules = [
  {
    keys: ['glucose', 'hba1c', 'diabetes'],
    issue: 'Possible blood sugar dysregulation',
    recommendation: 'Review fasting glucose, HbA1c, and lifestyle risk factors.'
  },
  {
    keys: ['cholesterol', 'ldl', 'triglyceride'],
    issue: 'Elevated cardiovascular risk markers',
    recommendation: 'Correlate with lipid profile, blood pressure, and cardiac symptoms.'
  },
  {
    keys: ['hemoglobin', 'anemia', 'iron'],
    issue: 'Potential anemia or iron deficiency',
    recommendation: 'Check CBC, ferritin, iron studies, and any bleeding history.'
  },
  {
    keys: ['creatinine', 'urea', 'kidney', 'egfr'],
    issue: 'Renal function concern',
    recommendation: 'Correlate with kidney function tests, hydration status, and medication use.'
  },
  {
    keys: ['liver', 'alt', 'ast', 'bilirubin'],
    issue: 'Possible hepatic stress',
    recommendation: 'Review liver panel, medication exposure, alcohol use, and symptoms of jaundice.'
  }
] as const;

function normalize(text: string) {
  return text.toLowerCase();
}

function scoreText(text: string, keys: readonly string[]) {
  const normalized = normalize(text);
  return keys.reduce((count, key) => count + (normalized.includes(key) ? 1 : 0), 0);
}

function clampConfidence(value: number) {
  return Math.max(0, Math.min(1, value));
}

function normalizeRiskLevel(value: unknown): AnalysisResult['riskLevel'] {
  if (value === 'low' || value === 'moderate' || value === 'high') {
    return value;
  }
  return 'low';
}

function parseJsonObject<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    const first = text.indexOf('{');
    const last = text.lastIndexOf('}');

    if (first >= 0 && last > first) {
      try {
        return JSON.parse(text.slice(first, last + 1)) as T;
      } catch {
        return null;
      }
    }

    return null;
  }
}

function toAnalysisResult(candidate: unknown): AnalysisResult | null {
  if (!candidate || typeof candidate !== 'object') {
    return null;
  }

  const source = candidate as PartialAnalysis;
  const possibilities = Array.isArray(source.possibilities)
    ? source.possibilities
        .map((item) => ({
          disease: String(item.disease ?? '').trim(),
          confidence: clampConfidence(Number(item.confidence ?? 0.5)),
          reason: String(item.reason ?? '').trim()
        }))
        .filter((item) => item.disease.length > 0 && item.reason.length > 0)
        .slice(0, 3)
    : [];

  if (!source.summary || typeof source.summary !== 'string') {
    return null;
  }

  const recommendedTests = Array.isArray(source.recommendedTests)
    ? source.recommendedTests.map((item) => String(item)).filter(Boolean).slice(0, 6)
    : [];

  const redFlags = Array.isArray(source.redFlags)
    ? source.redFlags.map((item) => String(item)).filter(Boolean).slice(0, 6)
    : [];

  if (!recommendedTests.length || !redFlags.length) {
    return null;
  }

  return {
    summary: source.summary,
    riskLevel: normalizeRiskLevel(source.riskLevel),
    possibilities: possibilities.length
      ? possibilities
      : [
          {
            disease: 'General clinical concern',
            confidence: 0.55,
            reason: 'AI response was broad, so the system returned a conservative fallback item.'
          }
        ],
    recommendedTests,
    redFlags
  };
}

function getAiConfig() {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL;
  const baseUrl = process.env.OPENAI_BASE_URL ?? 'https://api.openai.com/v1';

  if (!apiKey || !model) {
    return null;
  }

  return { apiKey, model, baseUrl };
}

async function runMedicalJsonPrompt(systemPrompt: string, userPrompt: string): Promise<AnalysisResult | null> {
  const config = getAiConfig();
  if (!config) {
    return null;
  }

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.2,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as OpenAIChatCompletionResponse;
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      return null;
    }

    const parsed = parseJsonObject<unknown>(content);
    return toAnalysisResult(parsed);
  } catch {
    return null;
  }
}

async function runMedicalNotePrompt(systemPrompt: string, userPrompt: string): Promise<string | null> {
  const config = getAiConfig();
  if (!config) {
    return null;
  }

  try {
    const response = await fetch(`${config.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`
      },
      body: JSON.stringify({
        model: config.model,
        temperature: 0.2,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ]
      })
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as OpenAIChatCompletionResponse;
    const content = data.choices?.[0]?.message?.content?.trim();
    return content || null;
  } catch {
    return null;
  }
}

export function analyzeSymptoms(input: SymptomAnalysisInput): AnalysisResult {
  const symptomText = `${input.symptoms} ${input.duration} ${input.severity}`;
  const matches = symptomRules
    .map((rule) => ({
      ...rule,
      score: scoreText(symptomText, rule.keys)
    }))
    .filter((rule) => rule.score > 0)
    .sort((left, right) => right.score - left.score);

  const possibilities = matches.slice(0, 3).map((match, index) => ({
    disease: match.disease,
    confidence: Math.min(0.95, match.confidence - index * 0.06),
    reason: match.reason
  }));

  const riskLevel = possibilities.some((item) => item.disease.includes('Cardiopulmonary'))
    ? 'high'
    : possibilities.length > 1 || input.severity.toLowerCase().includes('severe')
      ? 'moderate'
      : 'low';

  const recommendedTests =
    riskLevel === 'high'
      ? ['Urgent clinician review', 'ECG', 'Pulse oximetry', 'CBC', 'Chest imaging if indicated']
      : riskLevel === 'moderate'
        ? ['CBC', 'Basic metabolic panel', 'Inflammation markers', 'Focused physical exam']
        : ['Symptom monitoring', 'Hydration and rest', 'Primary care follow-up if symptoms persist'];

  const redFlags = [
    'Sudden chest pain or fainting',
    'Difficulty breathing',
    'Confusion or loss of consciousness',
    'Rapid symptom worsening'
  ];

  return {
    summary: possibilities.length
      ? `The symptom pattern suggests a ${riskLevel} triage level based on the current description and risk features.`
      : 'No clear disease pattern matched the current description. More detail would improve the result.',
    riskLevel,
    possibilities: possibilities.length
      ? possibilities
      : [
          {
            disease: 'Insufficient pattern data',
            confidence: 0.45,
            reason: 'The current description does not include enough clinical keywords to narrow the possibilities.'
          }
        ],
    recommendedTests,
    redFlags
  };
}

export async function analyzeSymptomsSmart(input: SymptomAnalysisInput): Promise<AnalysisResult> {
  const fallback = analyzeSymptoms(input);
  const aiResult = await runMedicalJsonPrompt(
    'You are a medical triage assistant. Return JSON only with this shape: {"summary": string, "riskLevel": "low"|"moderate"|"high", "possibilities": [{"disease": string, "confidence": number, "reason": string}], "recommendedTests": string[], "redFlags": string[]}. Keep confidence between 0 and 1. This is preliminary triage and not a diagnosis.',
    `Patient profile:\n- Age: ${input.age}\n- Sex: ${input.sex}\n- Duration: ${input.duration}\n- Severity: ${input.severity}\n- Symptoms: ${input.symptoms}`
  );

  return aiResult ?? fallback;
}

export function analyzeReport(input: ReportAnalysisInput): AnalysisResult {
  const reportText = input.reportText;
  const matches = reportRules
    .map((rule) => ({
      ...rule,
      score: scoreText(reportText, rule.keys)
    }))
    .filter((rule) => rule.score > 0)
    .sort((left, right) => right.score - left.score);

  const possibilities = matches.slice(0, 3).map((match, index) => ({
    disease: match.issue,
    confidence: Math.max(0.55, 0.88 - index * 0.08),
    reason: match.recommendation
  }));

  const riskLevel = possibilities.length > 2 ? 'high' : possibilities.length === 2 ? 'moderate' : 'low';

  return {
    summary: possibilities.length
      ? `The uploaded report contains markers that may warrant follow-up. Review the flagged items against the full clinical picture.`
      : 'The uploaded text did not match the current issue library. Consider adding more structured findings or numeric values.',
    riskLevel,
    possibilities: possibilities.length
      ? possibilities
      : [
          {
            disease: 'No obvious abnormality detected',
            confidence: 0.5,
            reason: 'The current rule set did not match any known report markers.'
          }
        ],
    recommendedTests: ['Correlate with history and examination', 'Repeat or confirm abnormal markers if present', 'Specialist review if symptoms persist'],
    redFlags: [
      'Any report result marked critical by the lab',
      'New severe symptoms or rapid decline',
      'Evidence of organ dysfunction'
    ]
  };
}

export async function analyzeReportSmart(input: ReportAnalysisInput): Promise<AnalysisResult> {
  const fallback = analyzeReport(input);
  const aiResult = await runMedicalJsonPrompt(
    'You are a clinical report analysis assistant. Return JSON only with this shape: {"summary": string, "riskLevel": "low"|"moderate"|"high", "possibilities": [{"disease": string, "confidence": number, "reason": string}], "recommendedTests": string[], "redFlags": string[]}. Keep confidence between 0 and 1. This is preliminary support and not a diagnosis.',
    `Report title: ${input.reportTitle ?? 'Untitled report'}\nReport text:\n${input.reportText}`
  );

  return aiResult ?? fallback;
}

export function generateClinicalNote(symptomAnalysis: AnalysisResult, reportAnalysis: AnalysisResult, patientLabel: string) {
  const symptomLine = symptomAnalysis.possibilities[0]?.disease ?? 'no clear symptom pattern';
  const reportLine = reportAnalysis.possibilities[0]?.disease ?? 'no report abnormalities detected';

  return [
    `Patient: ${patientLabel}`,
    `Symptom triage: ${symptomAnalysis.riskLevel.toUpperCase()} risk`,
    `Symptom impression: ${symptomLine}`,
    `Report impression: ${reportLine}`,
    `Recommended next tests: ${symptomAnalysis.recommendedTests.slice(0, 3).join(', ')}`,
    'This summary is an AI-generated preliminary note and should be reviewed by a licensed clinician.'
  ].join('\n');
}

export async function generateClinicalNoteSmart(
  symptomAnalysis: AnalysisResult,
  reportAnalysis: AnalysisResult,
  patientLabel: string
): Promise<string> {
  const fallback = generateClinicalNote(symptomAnalysis, reportAnalysis, patientLabel);
  const aiNote = await runMedicalNotePrompt(
    'You are a clinical documentation assistant. Generate a concise preliminary handoff note in plain text. Include triage level, likely concerns, and next test suggestions. Never claim a definitive diagnosis.',
    [
      `Patient: ${patientLabel}`,
      `Symptom analysis: ${JSON.stringify(symptomAnalysis)}`,
      `Report analysis: ${JSON.stringify(reportAnalysis)}`
    ].join('\n')
  );

  return aiNote ?? fallback;
}
