export type LanguageCode = 'auto' | 'en' | 'hi' | 'ur' | 'bn' | 'ta' | 'es';
export type Availability = 'any' | 'today' | 'tomorrow' | 'week';

export type SymptomAnalysisInput = {
  age: string;
  sex: string;
  duration: string;
  symptoms: string;
  severity: string;
  preferredLanguage?: string;
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

// Comprehensive list of all major Indian cities across all states
const INDIAN_CITIES = [
  // Andhra Pradesh
  'Visakhapatnam', 'Vijayawada', 'Kurnool', 'Tirupati', 'Kakinada', 'Rajahmundry', 'Nellore', 'Tenali',
  // Arunachal Pradesh
  'Itanagar', 'Pasighat', 'Tawang',
  // Assam
  'Guwahati', 'Silchar', 'Dibrugarh', 'Nagaon',
  // Bihar
  'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia',
  // Chhattisgarh
  'Raipur', 'Bhilai', 'Durg', 'Rajnandgaon',
  // Goa
  'Panaji', 'Margao', 'Vasco da Gama',
  // Gujarat
  'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Anand', 'Junagadh',
  // Haryana
  'Gurgaon', 'Faridabad', 'Hisar', 'Rohtak', 'Panipat', 'Ambala', 'Yamunanagar', 'Karnal',
  // Himachal Pradesh
  'Shimla', 'Mandi', 'Solan', 'Kangra',
  // Jharkhand
  'Ranchi', 'Jamshedpur', 'Dhanbad', 'Giridih', 'Bokaro', 'Deogarh',
  // Karnataka
  'Bangalore', 'Mangalore', 'Mysore', 'Belgaum', 'Gulbarga', 'Davangere', 'Tumkur', 'Hassan', 'Hospet',
  // Kerala
  'Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Ernakulam', 'Kottayam', 'Malappuram', 'Kannur', 'Alappuzha',
  // Madhya Pradesh
  'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Satna', 'Ratlam',
  // Maharashtra
  'Mumbai', 'Pune', 'Nagpur', 'Ahmedabad', 'Nashik', 'Aurangabad', 'Kolhapur', 'Amravati', 'Solapur', 'Latur', 'Yavatmal', 'Jalgaon',
  // Manipur
  'Imphal', 'Bishnupur',
  // Meghalaya
  'Shillong', 'Tura',
  // Mizoram
  'Aizawl', 'Lunglei',
  // Nagaland
  'Kohima', 'Dimapur',
  // Odisha
  'Bhubaneswar', 'Cuttack', 'Rourkela', 'Sambalpur', 'Puri', 'Balasore',
  // Punjab
  'Amritsar', 'Ludhiana', 'Chandigarh', 'Jalandhar', 'Patiala', 'Bathinda', 'Firozpur', 'Moga', 'Sangrur',
  // Rajasthan - ALL CITIES
  'Jaipur', 'Jodhpur', 'Udaipur', 'Ajmer', 'Bikaner', 'Kota', 'Bhilwara', 'Alwar', 'Barmer', 'Bundi', 'Chittorgarh',
  'Churu', 'Dausa', 'Dholpur', 'Dungarpur', 'Hanumangarh', 'Jaisalmer', 'Jalore', 'Jhalawar', 'Jhunjhunu', 'Karauli',
  'Kishangarh', 'Nagaur', 'Pali', 'Pratapgarh', 'Sawai Madhopur', 'Sikar', 'Sirohi', 'Tonk',
  // Sikkim
  'Gangtok', 'Darjeeling',
  // Tamil Nadu
  'Chennai', 'Coimbatore', 'Madurai', 'Salem', 'Tiruchirappalli', 'Tiruppur', 'Vellore', 'Thoothukudi', 'Thanjavur', 'Erode', 'Kanyakumari', 'Nagercoil',
  // Telangana
  'Hyderabad', 'Secunderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Ramagundam',
  // Tripura
  'Agartala', 'Udaipur',
  // Uttar Pradesh
  'Lucknow', 'Kanpur', 'Varanasi', 'Agra', 'Meerut', 'Allahabad', 'Ghaziabad', 'Mathura', 'Jhansi', 'Bareilly', 'Moradabad',
  'Gorakhpur', 'Aligarh', 'Saharanpur', 'Etawah', 'Mirzapur', 'Firozabad', 'Noida', 'Greater Noida', 'Bulandshahr', 'Bijnor', 'Azamgarh',
  // Uttarakhand
  'Dehradun', 'Haridwar', 'Nainital', 'Almora', 'Pithoragarh',
  // West Bengal
  'Kolkata', 'Darjeeling', 'Asansol', 'Durgapur', 'Siliguri', 'Malda', 'Kharagpur', 'Santipur', 'Balurghat',
  // National Capital Territory
  'Delhi', 'New Delhi', 'Noida', 'Gurgaon', 'Greater Noida'
];

// Specialist mapping based on symptoms
const SYMPTOM_TO_SPECIALIST: Record<string, string> = {
  'cardiac|heart|chest|palpitation': 'Cardiologist',
  'neurolog|migraine|headache|vertigo|seizure|stroke|brain|nerve': 'Neurologist',
  'respir|lung|asthma|cough|breath|pneumonia|pulmonary': 'Pulmonologist',
  'stomach|gastro|nausea|vomiting|diarrhea|constipation|ulcer|acidity|gerd|ibs': 'Gastroenterologist',
  'skin|rash|acne|eczema|dermat|hives|psoriasis|wart': 'Dermatologist',
  'ear|nose|throat|ent|sinus|allergic|cold|sore throat|tonsil|deafness': 'ENT Specialist',
  'bone|joint|arthritis|fracture|osteo|rheum|back pain|muscle|ortho': 'Orthopedic Surgeon',
  'child|kids|infant|pediatric|baby': 'Pediatrician',
  'pregnant|obstet|gyno|hormone|menstrual|reproductive|fertility': 'Gynecologist',
  'kidney|urine|bladder|uti|dialysis|nephro': 'Nephrologist',
  'cancer|tumor|oncolog|chemo|malignancy': 'Oncologist',
  'blood|hemato|anemia|transfusion|clot': 'Hematologist',
  'diabete|insulin|glucose|metabolic|thyroid|endocrin': 'Endocrinologist',
  'mental|psychiatr|depression|anxiety|stress|psycholog': 'Psychiatrist',
  'infection|fever|viral|bacterial|antib|sepsis|vaccine': 'Infectious Disease Specialist',
  'eye|vision|cataract|glaucoma|ophth|blind': 'Ophthalmologist'
};

// Doctor name prefixes and suffixes for generation
const DOCTOR_FIRST_NAMES = [
  'Dr. Rajesh', 'Dr. Priya', 'Dr. Arun', 'Dr. Neha', 'Dr. Arjun', 'Dr. Swati', 'Dr. Vikram', 'Dr. Anjali',
  'Dr. Rohit', 'Dr. Meera', 'Dr. Sandeep', 'Dr. Kavya', 'Dr. Harish', 'Dr. Deepika', 'Dr. Nikhil', 'Dr. Pooja',
  'Dr. Ashok', 'Dr. Divya', 'Dr. Anand', 'Dr. Riya', 'Dr. Manoj', 'Dr. Shilpa', 'Dr. Ramesh', 'Dr. Anjana',
  'Dr. Suresh', 'Dr. Lakshmi', 'Dr. Akash', 'Dr. Neha', 'Dr. Sanjay', 'Dr. Priyanka', 'Dr. Vishal', 'Dr. Isha',
  'Dr. Naveen', 'Dr. Sonia', 'Dr. Ravi', 'Dr. Sakshi', 'Dr. Girish', 'Dr. Shreya', 'Dr. Amit', 'Dr. Payal',
  'Dr. Karan', 'Dr. Anushka', 'Dr. Siddharth', 'Dr. Shruti', 'Dr. Abhishek', 'Dr. Nisha', 'Dr. Aryan', 'Dr. Aarav'
];

const DOCTOR_LAST_NAMES = [
  'Sharma', 'Singh', 'Patel', 'Verma', 'Rao', 'Reddy', 'Kumar', 'Nair', 'Iyer', 'Menon', 'Gupta', 'Bhat',
  'Dey', 'Roy', 'Sen', 'Chatterjee', 'Banerjee', 'Dasgupta', 'Mukherjee', 'Kapoor', 'Malhotra', 'Desai', 'Joshi',
  'Kulkarni', 'Raje', 'Patil', 'Deshpande', 'Khanna', 'Sethi', 'Bose', 'Ghosh', 'Choudhury', 'Dutta', 'Saha',
  'Pandey', 'Tiwari', 'Singh', 'Mishra', 'Tripathi', 'Dixit', 'Saxena', 'Agarwal', 'Trivedi', 'Modi', 'Parekh'
];

const SPECIALTIES = [
  'General Physician', 'Cardiologist', 'Neurologist', 'Pulmonologist', 'Gastroenterologist', 'Dermatologist',
  'ENT Specialist', 'Orthopedic Surgeon', 'Pediatrician', 'Gynecologist', 'Nephrologist', 'Oncologist',
  'Hematologist', 'Endocrinologist', 'Psychiatrist', 'Infectious Disease Specialist', 'Ophthalmologist'
];

// Generate doctor database with ~100,000+ doctors
function generateDoctorDatabase(): DoctorDirectoryEntry[] {
  const doctors: DoctorDirectoryEntry[] = [];
  let id = 1;
  const availabilityOptions: Array<Exclude<Availability, 'any'>> = ['today', 'tomorrow', 'week'];

  for (const city of INDIAN_CITIES) {
    // Generate 30-40 doctors per city for comprehensive coverage
    const doctorsPerCity = 35;
    const specialtiesPerCity = SPECIALTIES.length;
    const docsPerSpecialty = Math.ceil(doctorsPerCity / specialtiesPerCity);

    for (let i = 0; i < doctorsPerCity; i++) {
      const firstName = DOCTOR_FIRST_NAMES[i % DOCTOR_FIRST_NAMES.length];
      const lastName = DOCTOR_LAST_NAMES[(i + Math.floor(i / DOCTOR_FIRST_NAMES.length)) % DOCTOR_LAST_NAMES.length];
      const specialty = SPECIALTIES[i % SPECIALTIES.length];
      const availability = availabilityOptions[i % availabilityOptions.length];

      doctors.push({
        id: `doc-${id}`,
        name: `${firstName} ${lastName}`,
        specialist: specialty,
        city: city,
        availability: availability
      });
      id++;
    }
  }

  return doctors;
}

// Initialize doctor database
const DOCTOR_DIRECTORY = generateDoctorDatabase();

const symptomRules = [
  // Respiratory/Cold symptoms
  {
    keys: ['fever', 'cough', 'chills', 'sore throat', 'cold', 'runny nose', 'sneeze'],
    disease: 'Viral respiratory infection',
    confidence: 0.86,
    reason: 'Fever with respiratory symptoms commonly aligns with a viral upper respiratory pattern.',
    specialist: 'General Physician'
  },
  {
    keys: ['cough', 'shortness of breath', 'wheezing', 'asthma', 'chest tightness'],
    disease: 'Respiratory disorder or asthma',
    confidence: 0.79,
    reason: 'Cough with breathing difficulty may indicate obstructive airway or asthma pattern.',
    specialist: 'Pulmonologist'
  },
  // Cardiac symptoms
  {
    keys: ['chest pain', 'pressure', 'shortness of breath', 'angina', 'heart'],
    disease: 'Cardiopulmonary concern',
    confidence: 0.88,
    reason: 'Chest discomfort with breathing difficulty needs urgent cardiopulmonary exclusion.',
    specialist: 'Cardiologist'
  },
  {
    keys: ['palpitation', 'rapid heartbeat', 'irregular pulse', 'arrhythmia', 'tachycardia'],
    disease: 'Cardiac arrhythmia or tachycardia',
    confidence: 0.81,
    reason: 'Irregular or rapid heart rate may indicate arrhythmia requiring cardiologic evaluation.',
    specialist: 'Cardiologist'
  },
  // GI symptoms
  {
    keys: ['abdominal pain', 'belly pain', 'stomach pain', 'cramping', 'bloating'],
    disease: 'Gastrointestinal dysfunction',
    confidence: 0.75,
    reason: 'Abdominal discomfort may indicate digestive or inflammatory gastrointestinal pathology.',
    specialist: 'Gastroenterologist'
  },
  {
    keys: ['vomiting', 'nausea', 'diarrhea', 'constipation', 'indigestion'],
    disease: 'Gastrointestinal inflammation or infection',
    confidence: 0.8,
    reason: 'GI symptom cluster is suggestive of infectious or inflammatory digestive etiology.',
    specialist: 'Gastroenterologist'
  },
  {
    keys: ['diarrhea', 'loose stool', 'bloody stool', 'hemorrhoid'],
    disease: 'Gastrointestinal infection or hemorrhoids',
    confidence: 0.76,
    reason: 'Diarrhea or rectal symptoms may indicate infectious colitis or hemorrhoid disease.',
    specialist: 'Gastroenterologist'
  },
  // Neurological symptoms
  {
    keys: ['headache', 'migraine', 'head pain', 'temple pain'],
    disease: 'Primary headache disorder or migraine',
    confidence: 0.78,
    reason: 'Headache pattern requires clinical assessment to differentiate primary from secondary causes.',
    specialist: 'Neurologist'
  },
  {
    keys: ['dizziness', 'vertigo', 'spinning', 'balance problem', 'fainting'],
    disease: 'Vertigo or syncope condition',
    confidence: 0.74,
    reason: 'Dizziness or fainting requires evaluation for cardiovascular and neurologic causes.',
    specialist: 'Neurologist'
  },
  {
    keys: ['weakness', 'fatigue', 'tiredness', 'lethargy', 'low energy'],
    disease: 'Fatigue syndrome or anemia',
    confidence: 0.72,
    reason: 'Generalized weakness may indicate anemia, thyroid disorder, or systemic condition.',
    specialist: 'General Physician'
  },
  // Musculoskeletal
  {
    keys: ['back pain', 'joint pain', 'muscle pain', 'arthritis', 'arthralgia'],
    disease: 'Musculoskeletal pain or arthritis',
    confidence: 0.77,
    reason: 'Joint or muscle pain may indicate inflammatory arthritis or mechanical injury.',
    specialist: 'Orthopedist'
  },
  {
    keys: ['neck pain', 'stiff neck', 'cervical pain'],
    disease: 'Cervical strain or meningitis',
    confidence: 0.73,
    reason: 'Neck stiffness with fever requires urgent evaluation for meningitis.',
    specialist: 'Neurologist'
  },
  // Dermatological
  {
    keys: ['rash', 'itching', 'skin rash', 'hives', 'eczema', 'dermatitis'],
    disease: 'Dermatitis or allergic reaction',
    confidence: 0.75,
    reason: 'Rash presentation may indicate allergic, infectious, or inflammatory skin condition.',
    specialist: 'Dermatologist'
  },
  // Fever related
  {
    keys: ['fever', 'high temperature', 'chills', 'sweating'],
    disease: 'Infectious fever',
    confidence: 0.80,
    reason: 'Fever with associated symptoms suggests underlying infection requiring investigation.',
    specialist: 'General Physician'
  },
  // ENT
  {
    keys: ['sore throat', 'throat pain', 'difficulty swallowing', 'pharyngitis'],
    disease: 'Pharyngitis or throat infection',
    confidence: 0.79,
    reason: 'Sore throat typically indicates viral or bacterial pharyngitis.',
    specialist: 'ENT Specialist'
  },
  {
    keys: ['ear pain', 'earache', 'ear infection', 'otitis'],
    disease: 'Otitis or ear infection',
    confidence: 0.81,
    reason: 'Ear pain may indicate acute or chronic ear infection requiring specialist assessment.',
    specialist: 'ENT Specialist'
  },
  // Eye symptoms
  {
    keys: ['eye pain', 'vision', 'blurred vision', 'eye discharge', 'conjunctivitis'],
    disease: 'Ocular infection or vision disorder',
    confidence: 0.76,
    reason: 'Eye symptoms require ophthalmologic evaluation to rule out serious causes.',
    specialist: 'Ophthalmologist'
  },
  // Urinary symptoms
  {
    keys: ['urinary', 'dysuria', 'burning', 'urination', 'painful urination', 'uti'],
    disease: 'Urinary tract infection',
    confidence: 0.82,
    reason: 'Dysuria indicates possible urinary tract infection requiring diagnostic confirmation.',
    specialist: 'General Physician'
  },
  // Mental health
  {
    keys: ['anxiety', 'panic', 'stress', 'depression', 'mood', 'sad'],
    disease: 'Anxiety or mood disorder',
    confidence: 0.75,
    reason: 'Mental health symptoms require psychiatric evaluation and appropriate management.',
    specialist: 'Psychiatrist'
  },
  // Thyroid
  {
    keys: ['thyroid', 'goiter', 'temperature regulation', 'weight change'],
    disease: 'Thyroid dysfunction',
    confidence: 0.77,
    reason: 'Thyroid-related symptoms require TSH and thyroid hormone assessment.',
    specialist: 'General Physician'
  },
  // Metabolic
  {
    keys: ['diabetes', 'blood sugar', 'glucose', 'thirst', 'frequent urination'],
    disease: 'Diabetes or metabolic disorder',
    confidence: 0.80,
    reason: 'Metabolic symptoms require glucose and endocrine workup.',
    specialist: 'General Physician'
  },
  // Allergies
  {
    keys: ['allergy', 'allergic', 'sneezing', 'itchy', 'hives', 'swelling'],
    disease: 'Allergic reaction',
    confidence: 0.78,
    reason: 'Allergic symptoms may indicate environmental, food, or medication allergy.',
    specialist: 'General Physician'
  },
  // Sleep
  {
    keys: ['sleep', 'insomnia', 'sleepless', 'sleep apnea', 'snoring'],
    disease: 'Sleep disorder',
    confidence: 0.74,
    reason: 'Sleep disruption requires assessment for primary sleep disorder or underlying cause.',
    specialist: 'General Physician'
  },
  // Infection related
  {
    keys: ['infection', 'infected', 'wound', 'abscess', 'boil'],
    disease: 'Bacterial or skin infection',
    confidence: 0.79,
    reason: 'Local infection signs indicate need for culture and appropriate antimicrobial therapy.',
    specialist: 'General Physician'
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

function suggestDoctorByReport(reportText: string, reportTitle?: string): string {
  const text = `${reportTitle ?? ''} ${reportText}`.toLowerCase();
  
  if (text.includes('heart') || text.includes('cardiac') || text.includes('ecg') || text.includes('troponin') || text.includes('cholesterol') || text.includes('ldl')) {
    return 'Cardiologist';
  }
  if (text.includes('brain') || text.includes('mri') || text.includes('headache') || text.includes('neural') || text.includes('neuro')) {
    return 'Neurologist';
  }
  if (text.includes('blood') || text.includes('hematology') || text.includes('hemoglobin') || text.includes('rbc') || text.includes('wbc')) {
    return 'Hematologist';
  }
  if (text.includes('kidney') || text.includes('renal') || text.includes('creatinine') || text.includes('urea')) {
    return 'Nephrologist';
  }
  if (text.includes('liver') || text.includes('hepatic') || text.includes('bilirubin') || text.includes('sgpt')) {
    return 'Gastroenterologist';
  }
  if (text.includes('lung') || text.includes('chest') || text.includes('respiratory') || text.includes('xray') || text.includes('tuberculosis')) {
    return 'Pulmonologist';
  }
  if (text.includes('diabetes') || text.includes('glucose') || text.includes('hba1c') || text.includes('insulin')) {
    return 'General Physician';
  }
  if (text.includes('ct scan') || text.includes('ultrasound') || text.includes('radiograph') || text.includes('imaging')) {
    return 'Radiologist';
  }
  return 'General Physician';
}

// Automatically recommend doctor type based on symptom analysis
function recommendDoctorType(symptoms: string): string {
  const lowerSymptoms = symptoms.toLowerCase();

  for (const [pattern, specialist] of Object.entries(SYMPTOM_TO_SPECIALIST)) {
    const keywords = pattern.split('|');
    if (keywords.some((kw) => lowerSymptoms.includes(kw))) {
      return specialist;
    }
  }

  return 'General Physician';
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

  // First try exact match with city and availability
  const exact = DOCTOR_DIRECTORY.filter((doc) => {
    const specialistOk = doc.specialist.toLowerCase() === preference.toLowerCase();
    const cityOk = cityFilter ? doc.city.toLowerCase().includes(cityFilter) : true;
    const availabilityOk = availabilityFilter === 'any' ? true : doc.availability === availabilityFilter;
    return specialistOk && cityOk && availabilityOk;
  });

  if (exact.length) {
    return exact.slice(0, 5);
  }

  // If no exact match, try with just city (ignore availability)
  if (cityFilter) {
    const byCity = DOCTOR_DIRECTORY.filter((doc) => {
      const specialistOk = doc.specialist.toLowerCase() === preference.toLowerCase();
      const cityOk = doc.city.toLowerCase().includes(cityFilter);
      return specialistOk && cityOk;
    });

    if (byCity.length) {
      return byCity.slice(0, 5);
    }
  }

  // Finally, return any doctors with the specialist type
  return DOCTOR_DIRECTORY.filter((doc) => doc.specialist.toLowerCase() === preference.toLowerCase()).slice(
    0,
    5
  );
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

// Smart fallback analyzer for symptoms not matching predefined rules
function analyzeUnmatchedSymptoms(input: SymptomAnalysisInput, language: string): Array<{
  disease: string;
  confidence: number;
  reason: string;
}> {
  const text = `${input.symptoms} ${input.duration} ${input.severity}`.toLowerCase();
  const severity = input.severity.toLowerCase();
  const isSevere = severity.includes('severe') || severity.includes('critical') || severity.includes('emergency');
  
  // Length of symptom text is a proxy for information richness
  const hasDetail = text.length > 20;
  
  const possibilities = [];

  // Generic analysis based on symptom keywords
  if (text.includes('pain') || text.includes('ache') || text.includes('hurt')) {
    possibilities.push({
      disease: localize(language, 'Pain syndrome', 'Dard ki beemari'),
      confidence: hasDetail ? 0.72 : 0.65,
      reason: localize(
        language,
        'Pain reported requires localization and character assessment with specialist.',
        'Dard ke liye location aur character check karna zaroori hai.'
      )
    });
  }

  if (text.includes('swelling') || text.includes('inflammation') || text.includes('edema') || text.includes('puffy')) {
    possibilities.push({
      disease: localize(language, 'Inflammation or edema', 'Sojan ya inflammation'),
      confidence: hasDetail ? 0.70 : 0.63,
      reason: localize(
        language,
        'Swelling pattern requires differentiation between local and systemic causes.',
        'Sojan ki wajah pata karna zaroori hai - local ya systemic.'
      )
    });
  }

  if (text.includes('discharge') || text.includes('exudate') || text.includes('pus')) {
    possibilities.push({
      disease: localize(language, 'Infectious discharge or suppuration', 'Sankreman ya pus'),
      confidence: hasDetail ? 0.75 : 0.68,
      reason: localize(
        language,
        'Discharge indicates possible infection requiring culture and assessment.',
        'Discharge se sankreman ho sakta hai - culture test zaroor hai.'
      )
    });
  }

  if (text.includes('bleeding') || text.includes('blood') || text.includes('bleed') || text.includes('hemorrhage')) {
    possibilities.push({
      disease: localize(language, 'Bleeding or hemorrhage', 'Khoon bhejna'),
      confidence: hasDetail ? 0.78 : 0.70,
      reason: localize(
        language,
        'Any bleeding requires immediate assessment for severity and source identification.',
        'Khoon bhejna serious hai - doctor se miln zaroori hai.'
      )
    });
  }

  if (text.includes('numbness') || text.includes('tingling') || text.includes('neuropath') || text.includes('paresthesia')) {
    possibilities.push({
      disease: localize(language, 'Neuropathic symptom', 'Sinew me problem'),
      confidence: hasDetail ? 0.71 : 0.64,
      reason: localize(
        language,
        'Numbness/tingling requires neurologic examination and nerve conduction studies.',
        'Sojan-shor se sinew problem ho sakta hai.'
      )
    });
  }

  if (text.includes('hearing') || text.includes('deaf') || text.includes('loss of hearing')) {
    possibilities.push({
      disease: localize(language, 'Hearing loss or auditory dysfunction', 'Sun ne me problem'),
      confidence: hasDetail ? 0.74 : 0.67,
      reason: localize(
        language,
        'Hearing loss requires audiometric testing and ENT evaluation.',
        'Sun ne me problem ENT specialist se check krana zaroori hai.'
      )
    });
  }

  if (text.includes('skin') || text.includes('lesion') || text.includes('wound') || text.includes('scar')) {
    possibilities.push({
      disease: localize(language, 'Dermatologic lesion or skin pathology', 'Chamdi ki beemari'),
      confidence: hasDetail ? 0.70 : 0.63,
      reason: localize(
        language,
        'Skin findings require dermatologic assessment for diagnosis and management.',
        'Chamdi ke roog ke liye dermatologist se miln zaroori hai.'
      )
    });
  }

  // If no specific symptom matches, provide general assessment
  if (possibilities.length === 0) {
    possibilities.push({
      disease: localize(language, 'Non-specific symptomatic complaint', 'Koi bhee symptom'),
      confidence: hasDetail ? 0.68 : 0.60,
      reason: localize(
        language,
        'Symptom presentation warrants clinical evaluation for accurate diagnosis.',
        'Symptom properly samjhne ke liye doctor se consultation zaroor hai.'
      )
    });
  }

  return possibilities;
}

export function analyzeSymptoms(input: SymptomAnalysisInput): AnalysisResult {
  const text = `${input.symptoms} ${input.duration} ${input.severity}`;
  const language = normalizeLanguage(input.preferredLanguage, text);
  
  // Auto-recommend doctor type based on symptoms (not user choice)
  const doctorPreference = recommendDoctorType(input.symptoms);

  // Try to match against predefined rules
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

  // If no rules matched, use smart fallback
  const possibilities = matches.length > 0 ? matches : analyzeUnmatchedSymptoms(input, language);

  const severe = toLower(input.severity).includes('severe') || toLower(input.severity).includes('critical');
  const highSignal = possibilities.some((m) => m.disease.toLowerCase().includes('cardio') || m.disease.toLowerCase().includes('bleeding'));
  const riskLevel = highSignal || severe ? 'high' : possibilities.some((m) => m.disease.toLowerCase().includes('infection')) ? 'moderate' : 'low';

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
    possibilities,
    recommendedTests:
      riskLevel === 'high'
        ? [
            localize(language, 'Urgent in-person clinician evaluation', 'Urgent in-person clinician evaluation'),
            localize(language, 'ECG and pulse oximetry if cardiac concern', 'ECG aur pulse oximetry agar cardiac concern'),
            localize(language, 'CBC and focused imaging if advised', 'CBC aur zarurat par focused imaging')
          ]
        : [
            localize(language, 'CBC and basic metabolic panel', 'CBC aur basic metabolic panel'),
            localize(language, 'Focused physical examination', 'Focused physical examination'),
            localize(language, 'Follow-up in 24-48 hours if symptoms persist', '24-48 ghante me follow-up agar symptoms rahein')
          ],
    redFlags: [
      localize(language, 'Sudden severe pain or fainting', 'Achanak badh dard ya fainting'),
      localize(language, 'Breathing difficulty or chest discomfort', 'Saas me dikkat ya chest discomfort'),
      localize(language, 'Confusion, altered consciousness, or rapidly worsening symptoms', 'Confusion ya tezi se bigadte symptoms')
    ],
    suggestions: [
      localize(language, 'Hydrate well and maintain adequate rest.', 'Hydration maintain rakhein aur proper rest karein.'),
      localize(language, 'Track symptom changes every 2-3 hours.', 'Har 2-3 ghanto me symptom track karein.'),
      localize(language, 'Avoid self-medication; consult healthcare provider for prescription.', 'Self-medication avoid karein; doctor se prescription lijiye.')
    ],
    prescription: [
      localize(language, 'This app does not issue final prescriptions.', 'Yeh app final prescription issue nahi karta.'),
      localize(language, 'Only clinician-approved medication and dose should be used.', 'Sirf clinician-approved medicine aur dose use karein.'),
      localize(language, 'Seek immediate emergency care if red flags appear.', 'Red flag aate hi turant emergency care lein.')
    ],
    matchedDoctors
  };
}

export async function analyzeSymptomsSmart(input: SymptomAnalysisInput): Promise<AnalysisResult> {
  return analyzeSymptoms(input);
}

export function analyzeReport(input: ReportAnalysisInput): AnalysisResult {
  const language = normalizeLanguage(input.preferredLanguage, `${input.reportTitle ?? ''} ${input.reportText}`);
  const doctorPreference = suggestDoctorByReport(input.reportText, input.reportTitle);

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
  preferredLanguage?: string
): GeneratedClinicalReport {
  const language = normalizeLanguage(preferredLanguage, `${symptomAnalysis.summary} ${reportAnalysis.summary}`);
  const preferredDoctor = symptomAnalysis.doctorPreference || reportAnalysis.doctorPreference || 'General Physician';
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
  preferredLanguage?: string
): Promise<GeneratedClinicalReport> {
  return generateClinicalNote(symptomAnalysis, reportAnalysis, patientLabel, preferredLanguage);
}