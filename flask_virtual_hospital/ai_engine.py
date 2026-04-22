from __future__ import annotations

import json
import math
import re
import urllib.error
import urllib.request
from collections import Counter
from dataclasses import dataclass
from typing import Any

RiskLevel = str


@dataclass
class Possibility:
    disease: str
    confidence: float
    reason: str


@dataclass
class AnalysisResult:
    summary: str
    risk_level: RiskLevel
    possibilities: list[Possibility]
    recommended_tests: list[str]
    red_flags: list[str]
    precautions: list[str]
    specialist_to_consult: str
    doctor_directory: list[dict[str, str]]
    triage_score: int
    triage_band: str
    output_language: str

    def to_dict(self) -> dict[str, Any]:
        return {
            "summary": self.summary,
            "riskLevel": self.risk_level,
            "possibilities": [
                {
                    "disease": p.disease,
                    "confidence": round(float(p.confidence), 3),
                    "reason": p.reason,
                }
                for p in self.possibilities
            ],
            "recommendedTests": self.recommended_tests,
            "redFlags": self.red_flags,
            "precautions": self.precautions,
            "specialistToConsult": self.specialist_to_consult,
            "doctorDirectory": self.doctor_directory,
            "triageScore": self.triage_score,
            "triageBand": self.triage_band,
            "outputLanguage": self.output_language,
        }


SYMPTOM_TRAINING = [
    ("fever cough sore throat body ache fatigue", "Viral respiratory infection"),
    ("chills runny nose cough mild fever throat pain", "Viral respiratory infection"),
    ("chest pain shortness of breath pressure sweating dizziness", "Cardiopulmonary condition"),
    ("breathing difficulty chest tightness severe shortness of breath", "Cardiopulmonary condition"),
    ("abdominal pain nausea vomiting diarrhea cramps dehydration", "Gastrointestinal infection or inflammation"),
    ("stomach pain loose motion vomiting fever", "Gastrointestinal infection or inflammation"),
    ("headache blurred vision dizziness sensitivity light", "Neurologic or migraine-related issue"),
    ("migraine nausea aura severe headache", "Neurologic or migraine-related issue"),
    ("rash itching swelling skin redness allergy", "Allergic or dermatologic reaction"),
    ("hives itching facial swelling allergic reaction", "Allergic or dermatologic reaction"),
    ("bukhar khansi gala dard thakan sardard", "Viral respiratory infection"),
    ("pecho dolor falta aire mareo pasion", "Cardiopulmonary condition"),
    ("dolor abdominal nausea vomito diarrea", "Gastrointestinal infection or inflammation"),
    ("migraine mareo vision borrosa nausea", "Neurologic or migraine-related issue"),
    ("ronchas picazon hinchazon alergia piel", "Allergic or dermatologic reaction"),
    ("fievre toux mal gorge fatigue courbatures", "Viral respiratory infection"),
    ("douleur thoracique essoufflement vertiges", "Cardiopulmonary condition"),
]

MULTILINGUAL_SYMPTOM_MAP = {
    # Hindi / Hinglish
    "bukhar": "fever",
    "khansi": "cough",
    "sardi": "cold",
    "gala": "throat",
    "dard": "pain",
    "saans": "breathing",
    "ulti": "vomiting",
    "chakkar": "dizziness",
    "kamzori": "fatigue",
    "sir dard": "headache",
    "pet dard": "abdominal pain",
    # Spanish
    "fiebre": "fever",
    "tos": "cough",
    "dolor": "pain",
    "garganta": "throat",
    "falta de aire": "shortness of breath",
    "mareo": "dizziness",
    "nausea": "nausea",
    "vomito": "vomiting",
    "dolor de pecho": "chest pain",
    "dolor abdominal": "abdominal pain",
    # French
    "fievre": "fever",
    "toux": "cough",
    "mal de gorge": "sore throat",
    "douleur thoracique": "chest pain",
    "essoufflement": "shortness of breath",
    "vertiges": "dizziness",
    "fatigue": "fatigue",
}

RISK_RED_FLAGS = [
    "Sudden chest pain or fainting",
    "Difficulty breathing",
    "Confusion or loss of consciousness",
    "Rapid symptom worsening",
]

REPORT_RULES = [
    ("Possible blood sugar dysregulation", ["glucose", "hba1c", "diabetes"], "Review fasting glucose and HbA1c."),
    (
        "Elevated cardiovascular risk markers",
        ["cholesterol", "ldl", "triglyceride", "hdl"],
        "Correlate with lipid profile and blood pressure.",
    ),
    (
        "Potential anemia or iron deficiency",
        ["hemoglobin", "anemia", "iron", "ferritin"],
        "Check CBC, ferritin, and bleeding history.",
    ),
    (
        "Renal function concern",
        ["creatinine", "urea", "kidney", "egfr"],
        "Review kidney function trend and hydration status.",
    ),
    (
        "Possible hepatic stress",
        ["liver", "alt", "ast", "bilirubin"],
        "Review liver panel and medication/alcohol history.",
    ),
]

RISK_TO_BASE_SCORE = {
    "low": 28,
    "moderate": 58,
    "high": 84,
}

SEVERITY_TO_BONUS = {
    "mild": 6,
    "moderate": 14,
    "severe": 24,
}

LANGUAGE_HINTS = {
    "hi": ["mujhe", "hai", "bukhar", "khansi", "dard", "saans", "chakkar"],
    "es": ["fiebre", "tos", "dolor", "mareo", "vomito", "garganta"],
    "fr": ["fievre", "toux", "douleur", "vertiges", "essoufflement"],
}

LOCALIZED_TEXT = {
    "en": {
        "summary_symptom": "ML model detected symptom patterns (with multilingual normalization) that suggest a preliminary triage plan. This is assistive output and must be clinician-reviewed.",
        "summary_report": "Report text was parsed and screened for common risk markers using rule-based ML-support logic.",
        "clinical_disclaimer": "Preliminary AI/ML note. Clinical validation is required.",
        "doctor_line": "Suggested specialist",
        "precautions_line": "Precautions",
        "patient": "Patient",
        "symptom_triage": "Symptom triage",
        "top_symptom": "Top symptom impression",
        "top_report": "Top report impression",
        "tests": "Recommended next tests",
    },
    "hi": {
        "summary_symptom": "ML model ne multilingual input normalize karke symptom pattern analyze kiya hai. Yeh preliminary triage support hai; final decision clinician review ke baad hi liya jaye.",
        "summary_report": "Report text ko common risk markers ke liye rule-based ML support se screen kiya gaya.",
        "clinical_disclaimer": "Yeh preliminary AI/ML note hai. Clinical validation zaroori hai.",
        "doctor_line": "Suggested specialist",
        "precautions_line": "Savdhani",
        "patient": "Patient",
        "symptom_triage": "Symptom triage",
        "top_symptom": "Top symptom impression",
        "top_report": "Top report impression",
        "tests": "Recommended next tests",
    },
    "es": {
        "summary_symptom": "El modelo ML detecto patrones de sintomas (con normalizacion multilingue) para un plan de triaje preliminar. Es apoyo asistivo y requiere revision clinica.",
        "summary_report": "El texto del reporte fue analizado para marcadores de riesgo comunes con logica de soporte ML basada en reglas.",
        "clinical_disclaimer": "Nota preliminar de AI/ML. Se requiere validacion clinica.",
        "doctor_line": "Especialista sugerido",
        "precautions_line": "Precauciones",
        "patient": "Paciente",
        "symptom_triage": "Triage de sintomas",
        "top_symptom": "Impresion principal de sintomas",
        "top_report": "Impresion principal del reporte",
        "tests": "Pruebas recomendadas",
    },
    "fr": {
        "summary_symptom": "Le modele ML a detecte des profils de symptomes (avec normalisation multilingue) pour un tri preliminaire. Cette aide reste indicative et doit etre validee cliniquement.",
        "summary_report": "Le texte du rapport a ete analyse pour des marqueurs de risque courants via une logique ML basee sur des regles.",
        "clinical_disclaimer": "Note preliminaire AI/ML. Validation clinique requise.",
        "doctor_line": "Specialiste suggere",
        "precautions_line": "Precautions",
        "patient": "Patient",
        "symptom_triage": "Triage des symptomes",
        "top_symptom": "Impression symptomatique principale",
        "top_report": "Impression principale du rapport",
        "tests": "Examens recommandes",
    },
}

SPECIALTY_DIRECTORY = {
    "Cardiologist": [
        ("Cardiology OPD", "Multi-specialty Hospital", "Within 24 hours"),
        ("Emergency Cardiac Unit", "Tertiary Care Center", "Immediate if chest pain persists"),
        ("Lipid and Heart Risk Clinic", "Diagnostic Hospital", "Within 2-3 days"),
    ],
    "Pulmonologist or Cardiologist": [
        ("Respiratory and Chest Clinic", "Multi-specialty Hospital", "Within 24 hours"),
        ("Cardio-Pulmonary Assessment Desk", "Tertiary Care Center", "Same day for breathlessness"),
        ("Pulmonary Function Lab", "Diagnostic Hospital", "Within 2-3 days"),
    ],
    "Emergency physician / Cardiologist (urgent)": [
        ("24x7 Emergency Department", "Tertiary Care Center", "Immediate"),
        ("Cardiac Emergency Unit", "Heart Hospital", "Immediate"),
        ("Critical Care Admission Desk", "Emergency Hospital", "Immediate"),
    ],
    "Neurologist": [
        ("Neurology OPD", "Multi-specialty Hospital", "Within 48 hours"),
        ("Headache and Neuro Clinic", "Specialty Center", "Within 2-3 days"),
        ("Stroke Alert Unit", "Tertiary Care Center", "Immediate for red flags"),
    ],
    "Gastroenterologist": [
        ("Gastro OPD", "Multi-specialty Hospital", "Within 48 hours"),
        ("GI and Liver Clinic", "Specialty Center", "Within 2-3 days"),
        ("Emergency GI Desk", "Tertiary Care Center", "Immediate for severe dehydration"),
    ],
    "Dermatologist / Allergist": [
        ("Dermatology OPD", "Multi-specialty Hospital", "Within 3-5 days"),
        ("Allergy and Immunology Clinic", "Specialty Center", "Within 48 hours"),
        ("Emergency Allergy Desk", "Tertiary Care Center", "Immediate for facial swelling"),
    ],
    "General Physician (Internal Medicine)": [
        ("Internal Medicine OPD", "General Hospital", "Within 24-72 hours"),
        ("Family Medicine Clinic", "Community Hospital", "Within 2-3 days"),
        ("Urgent Care Desk", "Day Care Clinic", "Same day if symptoms worsen"),
    ],
    "General Physician / Hematologist": [
        ("Internal Medicine OPD", "General Hospital", "Within 24-72 hours"),
        ("Hematology Clinic", "Specialty Center", "Within 2-3 days"),
        ("Urgent Care Desk", "Day Care Clinic", "Same day if dizziness worsens"),
    ],
    "Nephrologist": [
        ("Nephrology OPD", "Multi-specialty Hospital", "Within 2-3 days"),
        ("Renal Function Clinic", "Specialty Center", "Within 48 hours"),
        ("Emergency Renal Desk", "Tertiary Care Center", "Immediate for low urine output"),
    ],
    "Hepatologist / Gastroenterologist": [
        ("Liver and GI Clinic", "Specialty Center", "Within 2-3 days"),
        ("Gastro OPD", "Multi-specialty Hospital", "Within 48 hours"),
        ("Emergency GI Desk", "Tertiary Care Center", "Immediate for severe jaundice signs"),
    ],
}


class SymptomMLModel:
    def __init__(self) -> None:
        label_text_map: dict[str, list[str]] = {}
        for text, label in SYMPTOM_TRAINING:
            label_text_map.setdefault(label, []).append(text.lower())

        self.label_profiles: dict[str, Counter[str]] = {}
        for label, samples in label_text_map.items():
            combined = " ".join(samples)
            self.label_profiles[label] = Counter(self._tokenize(combined))

    def _tokenize(self, text: str) -> list[str]:
        return re.findall(r"[a-z0-9]+", text.lower())

    def _cosine_similarity(self, left: Counter[str], right: Counter[str]) -> float:
        if not left or not right:
            return 0.0

        dot = sum(value * right.get(token, 0) for token, value in left.items())
        left_norm = math.sqrt(sum(v * v for v in left.values()))
        right_norm = math.sqrt(sum(v * v for v in right.values()))

        if left_norm == 0 or right_norm == 0:
            return 0.0

        return dot / (left_norm * right_norm)

    def predict(self, text: str) -> list[tuple[str, float]]:
        query_profile = Counter(self._tokenize(text))
        scored = [(label, self._cosine_similarity(query_profile, profile)) for label, profile in self.label_profiles.items()]
        scored.sort(key=lambda item: item[1], reverse=True)

        top = scored[:3]
        total = sum(score for _, score in top)
        if total <= 0:
            return [(label, 1 / max(1, len(top))) for label, _ in top]

        return [(label, score / total) for label, score in top]


model = SymptomMLModel()


def detect_language(text: str) -> str:
    sample = (text or "").lower()
    if re.search(r"[\u0900-\u097f]", sample):
        return "hi"

    for lang_code, hints in LANGUAGE_HINTS.items():
        if any(hint in sample for hint in hints):
            return lang_code

    return "en"


def _txt(lang: str, key: str) -> str:
    selected = lang if lang in LOCALIZED_TEXT else "en"
    return LOCALIZED_TEXT[selected].get(key, LOCALIZED_TEXT["en"].get(key, key))


def _default_tests_by_risk(risk_level: str, lang: str = "en") -> list[str]:
    if lang == "hi":
        if risk_level == "high":
            return ["Turant clinician review", "ECG", "Pulse oximetry", "CBC", "Chest imaging agar zaroori ho"]
        if risk_level == "moderate":
            return ["CBC", "Basic metabolic panel", "Inflammation markers", "Focused physical exam"]
        return ["Symptom monitoring", "Hydration aur rest", "Symptoms persist hone par GP follow-up"]

    if lang == "es":
        if risk_level == "high":
            return ["Revision clinica urgente", "ECG", "Oximetria de pulso", "CBC", "Imagen de torax si esta indicado"]
        if risk_level == "moderate":
            return ["CBC", "Panel metabolico basico", "Marcadores de inflamacion", "Examen fisico focalizado"]
        return ["Monitoreo de sintomas", "Hidratacion y reposo", "Seguimiento con medico general si persisten"]

    if lang == "fr":
        if risk_level == "high":
            return ["Evaluation clinique urgente", "ECG", "Oxymetrie de pouls", "CBC", "Imagerie thoracique si indiquee"]
        if risk_level == "moderate":
            return ["CBC", "Bilan metabolique de base", "Marqueurs inflammatoires", "Examen clinique cible"]
        return ["Surveillance des symptomes", "Hydratation et repos", "Suivi en medecine generale si persistance"]

    if risk_level == "high":
        return ["Urgent clinician review", "ECG", "Pulse oximetry", "CBC", "Chest imaging if indicated"]
    if risk_level == "moderate":
        return ["CBC", "Basic metabolic panel", "Inflammation markers", "Focused physical exam"]
    return ["Symptom monitoring", "Hydration and rest", "Primary care follow-up if symptoms persist"]


def _default_precautions_by_risk(risk_level: str, lang: str = "en") -> list[str]:
    if lang == "hi":
        if risk_level == "high":
            return [
                "Aaj hi urgent in-person medical care lijiye.",
                "Agar chest pain ya severe breathlessness ho to khud drive na karein.",
                "Emergency contact ko inform karein aur vitals monitor karein.",
            ]
        if risk_level == "moderate":
            return [
                "24-48 ghante rest aur hydration rakhein, heavy activity avoid karein.",
                "Har 6-8 ghante symptom progression note karein.",
                "24-72 ghante me doctor consult schedule karein agar symptoms continue hon.",
            ]
        return [
            "Hydration, sleep aur balanced meal continue rakhein.",
            "Self-medication overdose avoid karein.",
            "Naye red flags dikhen to doctor se turant consult karein.",
        ]

    if lang == "es":
        return _localized_precautions_es(risk_level)

    if lang == "fr":
        return _localized_precautions_fr(risk_level)

    if risk_level == "high":
        return [
            "Seek urgent in-person medical care today.",
            "Do not drive yourself if chest pain, severe breathlessness, or confusion is present.",
            "Keep emergency contacts informed and monitor vitals if available.",
        ]
    if risk_level == "moderate":
        return [
            "Rest, hydrate well, and avoid strenuous activity for 24-48 hours.",
            "Track temperature, breathing, and symptom progression every 6-8 hours.",
            "Schedule a doctor visit within 24-72 hours if symptoms persist.",
        ]
    return [
        "Maintain hydration, sleep, and balanced meals.",
        "Continue home monitoring and avoid self-medication overdose.",
        "Consult a doctor if symptoms worsen or new red flags appear.",
    ]

    
def _localized_precautions_es(risk_level: str) -> list[str]:
    if risk_level == "high":
        return [
            "Busque atencion medica presencial urgente hoy.",
            "No conduzca si presenta dolor de pecho, dificultad respiratoria severa o confusion.",
            "Mantenga a sus contactos de emergencia informados y controle signos vitales si puede.",
        ]
    if risk_level == "moderate":
        return [
            "Descanse, hidratese bien y evite actividad intensa por 24-48 horas.",
            "Registre temperatura, respiracion y progresion de sintomas cada 6-8 horas.",
            "Programe consulta medica en 24-72 horas si los sintomas persisten.",
        ]
    return [
        "Mantenga hidratacion, sueno y alimentacion equilibrada.",
        "Continue monitoreo en casa y evite sobredosificacion de automedicacion.",
        "Consulte al medico si empeoran los sintomas o aparecen nuevas alertas.",
    ]


def _localized_precautions_fr(risk_level: str) -> list[str]:
    if risk_level == "high":
        return [
            "Consulte en urgence en presentiel aujourd'hui.",
            "Ne conduisez pas en cas de douleur thoracique, dyspnee severe ou confusion.",
            "Informez vos proches et surveillez les constantes si possible.",
        ]
    if risk_level == "moderate":
        return [
            "Reposez-vous, hydratez-vous et evitez les efforts intenses pendant 24-48 heures.",
            "Suivez temperature, respiration et evolution des symptomes toutes les 6-8 heures.",
            "Planifiez une consultation sous 24-72 heures si les symptomes persistent.",
        ]
    return [
        "Maintenez hydratation, sommeil et alimentation equilibree.",
        "Poursuivez l'auto-surveillance et evitez le surdosage d'automedication.",
        "Consultez un medecin en cas d'aggravation ou de nouveaux signaux d'alerte.",
    ]


def _default_red_flags(lang: str = "en") -> list[str]:
    if lang == "hi":
        return [
            "Achanak chest pain ya behoshi",
            "Saans lene me zyada dikkat",
            "Confusion ya consciousness loss",
            "Symptoms ka rapidly worsen hona",
        ]
    if lang == "es":
        return [
            "Dolor toracico repentino o desmayo",
            "Dificultad para respirar",
            "Confusion o perdida de conciencia",
            "Empeoramiento rapido de sintomas",
        ]
    if lang == "fr":
        return [
            "Douleur thoracique soudaine ou malaise",
            "Difficulte respiratoire",
            "Confusion ou perte de connaissance",
            "Aggravation rapide des symptomes",
        ]
    return RISK_RED_FLAGS


def _triage_band_from_score(score: int) -> str:
    if score >= 85:
        return "critical"
    if score >= 65:
        return "urgent"
    if score >= 40:
        return "priority"
    return "routine"


def _compute_triage_score(risk_level: str, severity: str, confidence: float, red_flag_count: int) -> int:
    base = RISK_TO_BASE_SCORE.get(risk_level, 30)
    sev_bonus = SEVERITY_TO_BONUS.get(severity.lower().strip(), 10)
    conf_bonus = int(max(0.0, min(1.0, confidence)) * 10)
    red_flag_bonus = min(12, red_flag_count * 3)
    score = base + sev_bonus + conf_bonus + red_flag_bonus
    return max(0, min(100, score))


def _build_doctor_directory(city: str, specialist: str, risk_level: str) -> list[dict[str, str]]:
    city_name = city.strip().title() if city.strip() else "Your City"
    directory_templates = SPECIALTY_DIRECTORY.get(specialist, SPECIALTY_DIRECTORY["General Physician (Internal Medicine)"])

    suggestions: list[dict[str, str]] = []
    for department, facility_type, visit_window in directory_templates[:3]:
        suggestions.append(
            {
                "city": city_name,
                "specialty": specialist,
                "department": department,
                "facilityType": facility_type,
                "visitWindow": visit_window,
                "priority": "Immediate" if risk_level == "high" else "Soon",
            }
        )
    return suggestions


def _specialist_by_top_label(top_label: str, risk_level: str) -> str:
    if top_label == "Cardiopulmonary condition":
        return "Emergency physician / Cardiologist (urgent)" if risk_level == "high" else "Pulmonologist or Cardiologist"
    if top_label == "Neurologic or migraine-related issue":
        return "Neurologist"
    if top_label == "Gastrointestinal infection or inflammation":
        return "Gastroenterologist"
    if top_label == "Allergic or dermatologic reaction":
        return "Dermatologist / Allergist"
    return "General Physician (Internal Medicine)"


def _normalize_multilingual_symptoms(text: str) -> str:
    normalized = text.lower().strip()
    for source_term, english_term in sorted(MULTILINGUAL_SYMPTOM_MAP.items(), key=lambda item: len(item[0]), reverse=True):
        normalized = normalized.replace(source_term, english_term)
    return normalized


def _risk_from_inputs(top_label: str, severity: str, duration: str) -> str:
    severity_lower = severity.lower()
    duration_lower = duration.lower()

    if top_label == "Cardiopulmonary condition" or "severe" in severity_lower:
        return "high"

    if "moderate" in severity_lower or "week" in duration_lower or "days" in duration_lower:
        return "moderate"

    return "low"


def analyze_symptoms_ml(
    age: str,
    sex: str,
    duration: str,
    severity: str,
    symptoms: str,
    city: str = "",
    language: str = "en",
) -> AnalysisResult:
    normalized_symptoms = _normalize_multilingual_symptoms(symptoms)
    text = f"{normalized_symptoms} {duration} {severity} {age} {sex}".strip().lower()
    ranked = model.predict(text)

    reasons = {
        "Viral respiratory infection": {
            "en": "Pattern includes respiratory and systemic viral features.",
            "hi": "Pattern respiratory aur systemic viral features ko indicate karta hai.",
            "es": "El patron incluye rasgos respiratorios y virales sistemicos.",
            "fr": "Le profil inclut des signes respiratoires et viraux systemiques.",
        },
        "Cardiopulmonary condition": {
            "en": "Chest discomfort or breathing difficulty needs urgent review.",
            "hi": "Chest discomfort ya breathing difficulty urgent review demand karti hai.",
            "es": "La molestia toracica o dificultad respiratoria requiere revision urgente.",
            "fr": "La gene thoracique ou la dyspnee necessite une evaluation urgente.",
        },
        "Gastrointestinal infection or inflammation": {
            "en": "Digestive symptom cluster suggests GI involvement.",
            "hi": "Digestive symptom cluster GI involvement suggest karta hai.",
            "es": "El grupo de sintomas digestivos sugiere compromiso gastrointestinal.",
            "fr": "Le groupe de symptomes digestifs suggere une atteinte gastro-intestinale.",
        },
        "Neurologic or migraine-related issue": {
            "en": "Headache and neurologic descriptors are present.",
            "hi": "Headache aur neurologic descriptors present hain.",
            "es": "Hay cefalea y descriptores neurologicos presentes.",
            "fr": "Des signes de cephalee et neurologiques sont presents.",
        },
        "Allergic or dermatologic reaction": {
            "en": "Skin and hypersensitivity markers were detected.",
            "hi": "Skin aur hypersensitivity markers detect hue hain.",
            "es": "Se detectaron marcadores cutaneos y de hipersensibilidad.",
            "fr": "Des marqueurs cutanes et d'hypersensibilite ont ete detectes.",
        },
    }

    possibilities = [
        Possibility(
            disease=label,
            confidence=conf,
            reason=reasons.get(label, {}).get(language, reasons.get(label, {}).get("en", "Model-based clinical pattern match.")),
        )
        for label, conf in ranked
    ]

    top_label = possibilities[0].disease if possibilities else "General clinical concern"
    risk_level = _risk_from_inputs(top_label, severity, duration)
    specialist = _specialist_by_top_label(top_label, risk_level)
    top_conf = possibilities[0].confidence if possibilities else 0.5
    triage_score = _compute_triage_score(risk_level, severity, top_conf, len(_default_red_flags(language)))
    triage_band = _triage_band_from_score(triage_score)

    return AnalysisResult(
        summary=_txt(language, "summary_symptom"),
        risk_level=risk_level,
        possibilities=possibilities,
        recommended_tests=_default_tests_by_risk(risk_level, language),
        red_flags=_default_red_flags(language),
        precautions=_default_precautions_by_risk(risk_level, language),
        specialist_to_consult=specialist,
        doctor_directory=_build_doctor_directory(city, specialist, risk_level),
        triage_score=triage_score,
        triage_band=triage_band,
        output_language=language,
    )


def analyze_report_ml(
    report_title: str,
    report_text: str,
    severity: str = "moderate",
    city: str = "",
    language: str = "en",
) -> AnalysisResult:
    text = f"{report_title} {report_text}".lower()

    matches: list[tuple[str, float, str]] = []
    for issue, keys, recommendation in REPORT_RULES:
        score = sum(1 for key in keys if key in text)
        if score:
            confidence = min(0.95, 0.55 + 0.12 * score)
            matches.append((issue, confidence, recommendation))

    matches.sort(key=lambda item: item[1], reverse=True)

    if matches:
        possibilities = [
            Possibility(disease=issue, confidence=confidence, reason=recommendation)
            for issue, confidence, recommendation in matches[:3]
        ]
    else:
        possibilities = [
            Possibility(
                disease="No clear report marker detected",
                confidence=0.5,
                reason="Add more structured values (glucose, LDL, Hb, creatinine, etc.) for stronger analysis.",
            )
        ]

    risk_level = "high" if len(matches) >= 3 else "moderate" if len(matches) == 2 else "low"
    specialist = "General Physician (Internal Medicine)"
    text_joined = f"{report_title} {report_text}".lower()
    if any(k in text_joined for k in ["ldl", "cholesterol", "triglyceride", "chest", "ecg"]):
        specialist = "Cardiologist"
    elif any(k in text_joined for k in ["creatinine", "urea", "egfr", "kidney"]):
        specialist = "Nephrologist"
    elif any(k in text_joined for k in ["alt", "ast", "bilirubin", "liver"]):
        specialist = "Hepatologist / Gastroenterologist"
    elif any(k in text_joined for k in ["hemoglobin", "ferritin", "anemia", "iron"]):
        specialist = "General Physician / Hematologist"

    top_conf = possibilities[0].confidence if possibilities else 0.5
    triage_score = _compute_triage_score(risk_level, severity, top_conf, 2)
    triage_band = _triage_band_from_score(triage_score)

    return AnalysisResult(
        summary=_txt(language, "summary_report"),
        risk_level=risk_level,
        possibilities=possibilities,
        recommended_tests=[
            "Correlate with symptoms and examination",
            "Repeat/confirm abnormal values",
            "Specialist referral if progression is noted",
        ],
        red_flags=_default_red_flags(language),
        precautions=_default_precautions_by_risk(risk_level, language),
        specialist_to_consult=specialist,
        doctor_directory=_build_doctor_directory(city, specialist, risk_level),
        triage_score=triage_score,
        triage_band=triage_band,
        output_language=language,
    )


def _get_openai_config(env: dict[str, str]) -> tuple[str, str, str] | None:
    api_key = env.get("OPENAI_API_KEY")
    model_name = env.get("OPENAI_MODEL")
    base_url = env.get("OPENAI_BASE_URL", "https://api.openai.com/v1")

    if not api_key or not model_name:
        return None

    return api_key, model_name, base_url.rstrip("/")


def _call_openai_compatible(env: dict[str, str], system_prompt: str, user_prompt: str) -> str | None:
    config = _get_openai_config(env)
    if not config:
        return None

    api_key, model_name, base_url = config
    payload = {
        "model": model_name,
        "temperature": 0.2,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
    }

    request_body = json.dumps(payload).encode("utf-8")
    request_obj = urllib.request.Request(
        url=f"{base_url}/chat/completions",
        data=request_body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request_obj, timeout=30) as response:
            raw = response.read().decode("utf-8")
        data = json.loads(raw)
        return data.get("choices", [{}])[0].get("message", {}).get("content")
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError, json.JSONDecodeError):
        return None


def _parse_ai_json(content: str) -> dict[str, Any] | None:
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        start = content.find("{")
        end = content.rfind("}")
        if start >= 0 and end > start:
            try:
                return json.loads(content[start : end + 1])
            except json.JSONDecodeError:
                return None
    return None


def _analysis_from_ai_json(data: dict[str, Any]) -> AnalysisResult | None:
    summary = data.get("summary")
    risk_level = data.get("riskLevel", "low")
    possibilities_raw = data.get("possibilities", [])
    tests = data.get("recommendedTests", [])
    flags = data.get("redFlags", [])
    precautions = data.get("precautions", [])
    specialist = str(data.get("specialistToConsult", "General Physician (Internal Medicine)")).strip()
    directory = data.get("doctorDirectory", [])
    triage_score_raw = data.get("triageScore", 55)
    triage_band_raw = str(data.get("triageBand", "priority")).strip().lower()
    output_language = str(data.get("outputLanguage", "en")).strip().lower()

    if not isinstance(summary, str) or not isinstance(possibilities_raw, list) or not isinstance(tests, list) or not isinstance(flags, list):
        return None
    if not isinstance(precautions, list):
        precautions = []
    if not isinstance(directory, list):
        directory = []

    possibilities: list[Possibility] = []
    for item in possibilities_raw[:3]:
        if not isinstance(item, dict):
            continue
        disease = str(item.get("disease", "")).strip()
        reason = str(item.get("reason", "")).strip()
        confidence = float(item.get("confidence", 0.5))
        confidence = max(0.0, min(1.0, confidence))
        if disease and reason:
            possibilities.append(Possibility(disease=disease, confidence=confidence, reason=reason))

    if not possibilities:
        return None

    if risk_level not in {"low", "moderate", "high"}:
        risk_level = "low"

    try:
        triage_score = int(float(triage_score_raw))
    except (TypeError, ValueError):
        triage_score = _compute_triage_score(risk_level, "moderate", possibilities[0].confidence, len(flags))
    triage_score = max(0, min(100, triage_score))
    triage_band = triage_band_raw if triage_band_raw in {"routine", "priority", "urgent", "critical"} else _triage_band_from_score(triage_score)
    if output_language not in {"en", "hi", "es", "fr"}:
        output_language = "en"

    return AnalysisResult(
        summary=summary,
        risk_level=risk_level,
        possibilities=possibilities,
        recommended_tests=[str(t) for t in tests[:6]],
        red_flags=[str(f) for f in flags[:6]] or _default_red_flags(output_language),
        precautions=[str(p) for p in precautions[:6]] or _default_precautions_by_risk(risk_level, output_language),
        specialist_to_consult=specialist or "General Physician (Internal Medicine)",
        doctor_directory=[item for item in directory[:4] if isinstance(item, dict)],
        triage_score=triage_score,
        triage_band=triage_band,
        output_language=output_language,
    )


def analyze_symptoms_smart(
    env: dict[str, str],
    age: str,
    sex: str,
    duration: str,
    severity: str,
    symptoms: str,
    city: str = "",
    language: str = "en",
) -> AnalysisResult:
    fallback = analyze_symptoms_ml(age, sex, duration, severity, symptoms, city=city, language=language)

    content = _call_openai_compatible(
        env,
        (
            "You are a medical triage assistant. Return JSON only with keys: "
            "summary, riskLevel(low/moderate/high), possibilities(array of disease/confidence/reason), "
            "recommendedTests(array), redFlags(array), precautions(array), specialistToConsult(string), "
            "doctorDirectory(array of objects city/specialty/department/facilityType/visitWindow/priority), "
            "triageScore(0-100 integer), triageBand(routine/priority/urgent/critical), outputLanguage(en/hi/es/fr). "
            "Handle multilingual symptom inputs and return content in requested language. This is preliminary support only."
        ),
        (
            f"Patient age: {age}\n"
            f"Sex: {sex}\n"
            f"Duration: {duration}\n"
            f"Severity: {severity}\n"
            f"City: {city}\n"
            f"Output language: {language}\n"
            f"Symptoms: {symptoms}"
        ),
    )

    if not content:
        return fallback

    parsed = _parse_ai_json(content)
    if not parsed:
        return fallback

    validated = _analysis_from_ai_json(parsed)
    return validated or fallback


def analyze_report_smart(
    env: dict[str, str],
    report_title: str,
    report_text: str,
    severity: str = "moderate",
    city: str = "",
    language: str = "en",
) -> AnalysisResult:
    fallback = analyze_report_ml(report_title, report_text, severity=severity, city=city, language=language)

    content = _call_openai_compatible(
        env,
        (
            "You are a clinical report analysis assistant. Return JSON only with keys: "
            "summary, riskLevel(low/moderate/high), possibilities(array of disease/confidence/reason), "
            "recommendedTests(array), redFlags(array), precautions(array), specialistToConsult(string), "
            "doctorDirectory(array of objects city/specialty/department/facilityType/visitWindow/priority), "
            "triageScore(0-100 integer), triageBand(routine/priority/urgent/critical), outputLanguage(en/hi/es/fr). "
            "Handle multilingual report text when possible and return content in requested language. "
            "This is preliminary support only."
        ),
        (
            f"Report title: {report_title}\n"
            f"Severity: {severity}\n"
            f"City: {city}\n"
            f"Output language: {language}\n"
            f"Report text:\n{report_text}"
        ),
    )

    if not content:
        return fallback

    parsed = _parse_ai_json(content)
    if not parsed:
        return fallback

    validated = _analysis_from_ai_json(parsed)
    return validated or fallback


def generate_clinical_note_smart(
    env: dict[str, str],
    patient_label: str,
    symptom_result: AnalysisResult,
    report_result: AnalysisResult,
    language: str = "en",
) -> str:
    safe_language = language if language in {"en", "hi", "es", "fr"} else "en"
    fallback = "\n".join(
        [
            f"{_txt(safe_language, 'patient')}: {patient_label}",
            f"{_txt(safe_language, 'symptom_triage')}: {symptom_result.risk_level.upper()} risk",
            f"{_txt(safe_language, 'top_symptom')}: {symptom_result.possibilities[0].disease}",
            f"{_txt(safe_language, 'top_report')}: {report_result.possibilities[0].disease}",
            f"{_txt(safe_language, 'doctor_line')}: {symptom_result.specialist_to_consult}",
            f"{_txt(safe_language, 'precautions_line')}: {'; '.join(symptom_result.precautions[:2])}",
            f"{_txt(safe_language, 'tests')}: {', '.join(symptom_result.recommended_tests[:3])}",
            _txt(safe_language, "clinical_disclaimer"),
        ]
    )

    content = _call_openai_compatible(
        env,
        (
            "You are a clinical documentation assistant. Generate a concise preliminary handoff note "
            "in plain text. Mention triage level, likely concerns, and suggested tests. "
            "Do not claim definitive diagnosis."
        ),
        (
            f"Output language: {safe_language}\n"
            f"Patient: {patient_label}\n"
            f"Symptom analysis: {json.dumps(symptom_result.to_dict())}\n"
            f"Report analysis: {json.dumps(report_result.to_dict())}"
        ),
    )

    return content.strip() if content and content.strip() else fallback
