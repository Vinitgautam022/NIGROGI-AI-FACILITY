export type LanguageCode = 'auto' | 'en' | 'hi' | 'ur' | 'bn' | 'ta' | 'es';
export type Availability = 'any' | 'today' | 'tomorrow' | 'week';

export type SymptomAnalysisInput = {
  age: string;
  sex: string;
  duration: string;
  symptoms: string;
  severity: string;
  preferredLanguage?: string;
  doctorPreference?: string;
  preferredCity?: string;
  doctorAvailability?: Availability;
};

export type ReportAnalysisInput = {
  reportTitle?: string;
  reportText: string;
  preferredLanguage?: string;
  doctorPreference?: string;
  preferredCity?: string;
  doctorAvailability?: Availability;
};

export type DoctorDirectoryEntry = {
  id: string;
  name: string;
  specialist: string;
  city: string;
  availability: Exclude<Availability, 'any'>;
};

export type AnalysisResult = {
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
  matchedDoctors: DoctorDirectoryEntry[];
};

export type GeneratedClinicalReport = {
  note: string;
  language: string;
  translationFallback: boolean;
  translationNote: string;
  doctorSuggestion: string;
  suggestions: string[];
  prescription: string[];
  matchedDoctors: DoctorDirectoryEntry[];
};

const DOCTOR_DIRECTORY: DoctorDirectoryEntry[] = [
  { id: 'doc-1', name: 'Dr. Meera Iyer', specialist: 'General Physician', city: 'Mumbai', availability: 'today' },
  { id: 'doc-2', name: 'Dr. Aditi Rao', specialist: 'Female General Physician', city: 'Pune', availability: 'tomorrow' },
  { id: 'doc-3', name: 'Dr. Kabir Sethi', specialist: 'Cardiologist', city: 'Delhi', availability: 'today' },
  { id: 'doc-4', name: 'Dr. Neha Khanna', specialist: 'Pulmonologist', city: 'Mumbai', availability: 'week' },
  { id: 'doc-5', name: 'Dr. Rehan Ali', specialist: 'Gastroenterologist', city: 'Hyderabad', availability: 'tomorrow' },
  { id: 'doc-6', name: 'Dr. Kavya Narayanan', specialist: 'Neurologist', city: 'Chennai', availability: 'today' },
  { id: 'doc-7', name: 'Dr. Faisal Qureshi', specialist: 'General Physician', city: 'Bengaluru', availability: 'week' },
  { id: 'doc-8', name: 'Dr. Priya Menon', specialist: 'Female General Physician', city: 'Kolkata', availability: 'today' }
];

const symptomRules = [
  {
    keys: ['fever', 'cough', 'chills', 'sore throat'],
    disease: 'Viral respiratory infection',
    confidence: 0.86,
    reason: 'Fever with respiratory symptoms commonly aligns with a viral upper respiratory pattern.',
    specialist: 'General Physician'
  },
  {
    keys: ['chest pain', 'pressure', 'shortness of breath'],
    disease: 'Cardiopulmonary concern',
    confidence: 0.88,
    reason: 'Chest discomfort with breathing difficulty needs urgent cardiopulmonary exclusion.',
    specialist: 'Cardiologist'
  },
  {
    keys: ['abdominal pain', 'vomiting', 'nausea', 'diarrhea'],
    disease: 'Gastrointestinal inflammation',
    confidence: 0.8,
    reason: 'GI symptom cluster is suggestive of infectious or inflammatory digestive etiology.',
    specialist: 'Gastroenterologist'
  },
  {
    keys: ['headache', 'vision', 'dizziness', 'fainting'],
    disease: 'Neurologic-migraine pattern',
    confidence: 0.74,
    reason: 'Headache with neurologic symptoms should be clinically correlated for neuro causes.',
    specialist: 'Neurologist'
  }
] as const;

const reportRules = [
  {
    keys: ['ldl', 'cholesterol', 'triglyceride'],
    issue: 'Cardiovascular risk marker elevation',
    reason: 'Lipid abnormalities may indicate rising long-term cardiovascular risk.',
    specialist: 'Cardiologist'
  },
  {
    keys: ['glucose', 'hba1c', 'diabetes'],
    issue: 'Possible glycemic dysregulation',
    reason: 'Blood sugar trends require clinician correlation and repeat fasting interpretation.',
    specialist: 'General Physician'
  },
  {
    keys: ['hemoglobin', 'anemia', 'ferritin', 'iron'],
    issue: 'Possible anemia profile',
    reason: 'Hemoglobin/iron markers may indicate nutritional or blood-loss etiologies.',
    specialist: 'General Physician'
  },
  {
    keys: ['creatinine', 'urea', 'egfr', 'kidney'],
    issue: 'Renal function concern',
    reason: 'Kidney marker trends should be interpreted with hydration and medication history.',
    specialist: 'General Physician'
  }
] as const;

function toLower(text: string) {
  return text.toLowerCase();
}

function detectLanguageFromText(text: string): Exclude<LanguageCode, 'auto'> {
  if (/\p{Script=Devanagari}/u.test(text)) {
    return 'hi';
  }
  if (/\p{Script=Arabic}/u.test(text)) {
    return 'ur';
  }
  if (/\p{Script=Bengali}/u.test(text)) {
    return 'bn';
  }
  if (/\p{Script=Tamil}/u.test(text)) {
    return 'ta';
  }
  return 'en';
}

function normalizeLanguage(value: string | undefined, text: string): Exclude<LanguageCode, 'auto'> {
  const normalized = String(value ?? 'auto').trim().toLowerCase();
  if (normalized === 'auto') {
    return detectLanguageFromText(text);
  }
  if (normalized === 'en' || normalized === 'english') {
    return 'en';
  }
  if (normalized === 'hi' || normalized === 'hindi') {
    return 'hi';
  }
  if (normalized === 'ur' || normalized === 'urdu') {
    return 'ur';
  }
  if (normalized === 'bn' || normalized === 'bengali') {
    return 'bn';
  }
  if (normalized === 'ta' || normalized === 'tamil') {
    return 'ta';
  }
  if (normalized === 'es' || normalized === 'spanish') {
    return 'es';
  }
  return detectLanguageFromText(text);
}

function translationNote(language: string) {
  if (language === 'en') {
    return 'Output generated directly in English.';
  }
  if (language === 'hi') {
    return 'Output generated directly in Hindi context.';
  }
  return `Fallback translation mode active for ${language.toUpperCase()}; core medical safety statements remain English-first.`;
}

function localize(language: string, english: string, hindi: string) {
  if (language === 'hi') {
    return hindi;
  }
  if (language === 'en') {
    return english;
  }
  return `[${language.toUpperCase()} fallback] ${english}`;
}

function score(text: string, keys: readonly string[]) {
  const normalized = toLower(text);
  return keys.reduce((sum, key) => sum + (normalized.includes(key) ? 1 : 0), 0);
}

function normalizeDoctorPreference(value: string | undefined) {
  const fallback = 'General Physician';
  const normalized = String(value ?? '').trim();
  return normalized || fallback;
}

function normalizeAvailability(value: string | undefined): Availability {
  const normalized = String(value ?? 'any').trim().toLowerCase();
  if (normalized === 'today' || normalized === 'tomorrow' || normalized === 'week') {
    return normalized;
  }
  return 'any';
}

function findDoctors(preference: string, city?: string, availability?: string) {
  const availabilityFilter = normalizeAvailability(availability);
  const cityFilter = String(city ?? '').trim().toLowerCase();

  const exact = DOCTOR_DIRECTORY.filter((doc) => {
    const specialistOk = doc.specialist.toLowerCase() === preference.toLowerCase();
    const cityOk = cityFilter ? doc.city.toLowerCase().includes(cityFilter) : true;
    const availabilityOk = availabilityFilter === 'any' ? true : doc.availability === availabilityFilter;
    return specialistOk && cityOk && availabilityOk;
  });

  if (exact.length) {
    return exact.slice(0, 4);
  }

  return DOCTOR_DIRECTORY.filter((doc) => doc.specialist.toLowerCase() === preference.toLowerCase()).slice(0, 4);
}

function defaultPossibility(language: string) {
  return {
    disease: localize(language, 'Insufficient pattern data', 'Pariyapt pattern data nahi mila'),
    confidence: 0.5,
    reason: localize(
      language,
      'Provided details are not enough to infer a focused condition list.',
      'Di hui details focused condition list nikalne ke liye enough nahi hain.'
    )
  };
}

export function analyzeSymptoms(input: SymptomAnalysisInput): AnalysisResult {
  const text = `${input.symptoms} ${input.duration} ${input.severity}`;
  const language = normalizeLanguage(input.preferredLanguage, text);
  const doctorPreference = normalizeDoctorPreference(input.doctorPreference);

  const matches = symptomRules
    .map((rule) => ({ ...rule, rank: score(text, rule.keys) }))
    .filter((rule) => rule.rank > 0)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 3)
    .map((rule, idx) => ({
      disease: localize(language, rule.disease, rule.disease),
      confidence: Math.max(0.55, rule.confidence - idx * 0.08),
      reason: localize(language, rule.reason, rule.reason)
    }));

  const severe = toLower(input.severity).includes('severe');
  const highSignal = matches.some((m) => m.disease.toLowerCase().includes('cardio'));
  const riskLevel = highSignal ? 'high' : severe || matches.length > 1 ? 'moderate' : 'low';

  const matchedDoctors = findDoctors(doctorPreference, input.preferredCity, input.doctorAvailability);

  return {
    language,
    translationFallback: !['en', 'hi'].includes(language),
    translationNote: translationNote(language),
    summary: localize(
      language,
      `Symptom triage suggests ${riskLevel} risk. Please use this as preliminary guidance only.`,
      `Symptom triage me ${riskLevel} risk suggest ho raha hai. Isse sirf preliminary guidance ke roop me use karein.`
    ),
    riskLevel,
    doctorPreference,
    doctorSuggestion: localize(
      language,
      `Consult ${doctorPreference} and share this triage output for clinical confirmation.`,
      `${doctorPreference} se consult karein aur clinical confirmation ke liye yeh triage output dikhayen.`
    ),
    possibilities: matches.length ? matches : [defaultPossibility(language)],
    recommendedTests:
      riskLevel === 'high'
        ? [
            localize(language, 'Urgent in-person clinician evaluation', 'Urgent in-person clinician evaluation'),
            localize(language, 'ECG and pulse oximetry', 'ECG aur pulse oximetry'),
            localize(language, 'CBC and focused imaging if advised', 'CBC aur zarurat par focused imaging')
          ]
        : [
            localize(language, 'CBC and basic metabolic panel', 'CBC aur basic metabolic panel'),
            localize(language, 'Focused physical examination', 'Focused physical examination'),
            localize(language, 'Follow-up in 24-48 hours if symptoms persist', '24-48 ghante me follow-up agar symptoms rahein')
          ],
    redFlags: [
      localize(language, 'Sudden chest pain or fainting', 'Achanak chest pain ya fainting'),
      localize(language, 'Breathing difficulty or oxygen drop', 'Saas me dikkat ya oxygen drop'),
      localize(language, 'Confusion or rapidly worsening symptoms', 'Confusion ya tezi se bigadte symptoms')
    ],
    suggestions: [
      localize(language, 'Hydrate well and maintain adequate rest.', 'Hydration maintain rakhein aur proper rest karein.'),
      localize(language, 'Track temperature and symptom trend every few hours.', 'Har kuch ghanto me temperature aur symptom trend note karein.'),
      localize(language, 'Avoid self-medication beyond basic supportive care.', 'Basic supportive care se aage self-medication avoid karein.')
    ],
    prescription: [
      localize(language, 'This app does not issue final prescriptions.', 'Yeh app final prescription issue nahi karta.'),
      localize(language, 'Only clinician-approved medication and dose should be used.', 'Sirf clinician-approved medicine aur dose use karein.'),
      localize(language, 'Use emergency care immediately if red flags appear.', 'Red flag aate hi turant emergency care lein.')
    ],
    matchedDoctors
  };
}

export async function analyzeSymptomsSmart(input: SymptomAnalysisInput): Promise<AnalysisResult> {
  return analyzeSymptoms(input);
}

export function analyzeReport(input: ReportAnalysisInput): AnalysisResult {
  const language = normalizeLanguage(input.preferredLanguage, `${input.reportTitle ?? ''} ${input.reportText}`);
  const doctorPreference = normalizeDoctorPreference(input.doctorPreference);

  const matches = reportRules
    .map((rule) => ({ ...rule, rank: score(input.reportText, rule.keys) }))
    .filter((rule) => rule.rank > 0)
    .sort((a, b) => b.rank - a.rank)
    .slice(0, 3)
    .map((rule, idx) => ({
      disease: localize(language, rule.issue, rule.issue),
      confidence: Math.max(0.56, 0.86 - idx * 0.1),
      reason: localize(language, rule.reason, rule.reason)
    }));

  const riskLevel = matches.length > 2 ? 'high' : matches.length === 2 ? 'moderate' : 'low';
  const matchedDoctors = findDoctors(doctorPreference, input.preferredCity, input.doctorAvailability);

  return {
    language,
    translationFallback: !['en', 'hi'].includes(language),
    translationNote: translationNote(language),
    summary: localize(
      language,
      'Report review completed. Findings require clinician correlation with symptoms and examination.',
      'Report review complete. Findings ko symptoms aur examination ke saath clinician correlate kare.'
    ),
    riskLevel,
    doctorPreference,
    doctorSuggestion: localize(
      language,
      `Consult ${doctorPreference} with complete report history and current symptoms.`,
      `${doctorPreference} se complete report history aur current symptoms ke saath consult karein.`
    ),
    possibilities: matches.length ? matches : [defaultPossibility(language)],
    recommendedTests: [
      localize(language, 'Repeat abnormal marker panels as advised', 'Abnormal marker panels doctor advice se repeat karein'),
      localize(language, 'Clinical correlation with physical examination', 'Physical examination ke saath clinical correlation'),
      localize(language, 'Specialist referral if trend worsens', 'Trend worsen ho to specialist referral')
    ],
    redFlags: [
      localize(language, 'Any critical lab flag reported by the lab', 'Lab dwara koi critical flag'),
      localize(language, 'Rapid decline in vitals or severe symptoms', 'Vitals me rapid decline ya severe symptoms'),
      localize(language, 'Signs of acute organ dysfunction', 'Acute organ dysfunction ke signs')
    ],
    suggestions: [
      localize(language, 'Carry previous reports for trend comparison.', 'Trend comparison ke liye old reports saath rakhein.'),
      localize(language, 'Discuss all current medicines and allergies.', 'Current medicines aur allergies discuss karein.'),
      localize(language, 'Follow follow-up date exactly as advised.', 'Follow-up date ko exactly follow karein.')
    ],
    prescription: [
      localize(language, 'No definitive medicine list is generated by this app.', 'Yeh app definitive medicine list generate nahi karta.'),
      localize(language, 'Medication changes must be approved by a licensed clinician.', 'Medication change licensed clinician approval ke baad hi karein.'),
      localize(language, 'Emergency symptoms require immediate hospital care.', 'Emergency symptoms par turant hospital care lein.')
    ],
    matchedDoctors
  };
}

export async function analyzeReportSmart(input: ReportAnalysisInput): Promise<AnalysisResult> {
  return analyzeReport(input);
}

export function generateClinicalNote(
  symptomAnalysis: AnalysisResult,
  reportAnalysis: AnalysisResult,
  patientLabel: string,
  preferredLanguage?: string,
  doctorPreference?: string
): GeneratedClinicalReport {
  const language = normalizeLanguage(preferredLanguage, `${symptomAnalysis.summary} ${reportAnalysis.summary}`);
  const preferredDoctor = normalizeDoctorPreference(doctorPreference || symptomAnalysis.doctorPreference || reportAnalysis.doctorPreference);
  const mergedDoctors = [...symptomAnalysis.matchedDoctors, ...reportAnalysis.matchedDoctors]
    .reduce<DoctorDirectoryEntry[]>((acc, item) => {
      if (!acc.some((x) => x.id === item.id)) {
        acc.push(item);
      }
      return acc;
    }, [])
    .slice(0, 4);

  const topSymptom = symptomAnalysis.possibilities[0]?.disease ?? 'No strong symptom pattern';
  const topReport = reportAnalysis.possibilities[0]?.disease ?? 'No strong report pattern';

  const note = [
    `Patient: ${patientLabel}`,
    `Language: ${language.toUpperCase()}`,
    `Symptom risk: ${symptomAnalysis.riskLevel.toUpperCase()}`,
    `Symptom impression: ${topSymptom}`,
    `Report impression: ${topReport}`,
    `Preferred doctor: ${preferredDoctor}`,
    'This output is preliminary and must be reviewed by a licensed clinician.'
  ].join('\n');

  const translation = translationNote(language);

  return {
    note: !['en', 'hi'].includes(language) ? `[${language.toUpperCase()} fallback mode]\n${note}` : note,
    language,
    translationFallback: !['en', 'hi'].includes(language),
    translationNote: translation,
    doctorSuggestion: localize(
      language,
      `Book earliest available appointment with ${preferredDoctor} and carry this report.`,
      `${preferredDoctor} ke saath earliest slot book karein aur yeh report le kar jayein.`
    ),
    suggestions: Array.from(new Set([...symptomAnalysis.suggestions, ...reportAnalysis.suggestions])).slice(0, 6),
    prescription: Array.from(new Set([...symptomAnalysis.prescription, ...reportAnalysis.prescription])).slice(0, 6),
    matchedDoctors: mergedDoctors
  };
}

export async function generateClinicalNoteSmart(
  symptomAnalysis: AnalysisResult,
  reportAnalysis: AnalysisResult,
  patientLabel: string,
  preferredLanguage?: string,
  doctorPreference?: string
): Promise<GeneratedClinicalReport> {
  return generateClinicalNote(symptomAnalysis, reportAnalysis, patientLabel, preferredLanguage, doctorPreference);
}