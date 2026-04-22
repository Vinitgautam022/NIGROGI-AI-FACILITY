from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_from_directory

from ai_engine import analyze_report_smart, analyze_symptoms_smart, detect_language, generate_clinical_note_smart
from file_utils import extract_report_text

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

app = Flask(__name__, static_folder=str(STATIC_DIR), static_url_path="/static")
app.config["SECRET_KEY"] = os.getenv("FLASK_SECRET_KEY", "dev-secret")


def _severity_numeric(severity: str) -> int:
    lookup = {
        "mild": 30,
        "moderate": 60,
        "severe": 90,
    }
    return lookup.get(severity.lower().strip(), 55)


def _dashboard_band(score: int) -> str:
    if score >= 85:
        return "critical"
    if score >= 65:
        return "urgent"
    if score >= 40:
        return "priority"
    return "routine"


@app.get("/")
def index():
    """Serve the static HTML homepage."""
    index_path = STATIC_DIR / "index.html"
    if index_path.exists():
        return send_from_directory(str(STATIC_DIR), "index.html")
    return (
        """
        <html>
        <head><title>Virtual Hospital</title></head>
        <body>
            <h1>Error: index.html not found</h1>
            <p>Please ensure static/index.html exists.</p>
            <p>Checked path: {}</p>
        </body>
        </html>
        """.format(index_path),
        404,
    )


@app.get("/favicon.ico")
def favicon() -> tuple[str, int]:
    """Avoid browser favicon 404 noise/crashes on some Python pre-release stacks."""
    return "", 204


@app.errorhandler(404)
def not_found(_error) -> tuple[str, int]:
    """Return a plain 404 response without triggering default HTML exception rendering."""
    return "Route not found", 404


@app.post("/api/analyze")
def analyze_api() -> str:
    """JSON API endpoint for analysis."""
    try:
        # Parse form data
        form = {
            "age": request.form.get("age", "").strip(),
            "sex": request.form.get("sex", "").strip(),
            "city": request.form.get("city", "").strip(),
            "duration": request.form.get("duration", "").strip(),
            "severity": request.form.get("severity", "").strip(),
            "symptoms": request.form.get("symptoms", "").strip(),
            "report_title": request.form.get("report_title", "").strip(),
            "report_text": request.form.get("report_text", "").strip(),
        }

        status = "Analyzing symptom and report data..."

        # Handle file upload
        upload = request.files.get("report_file")
        if upload and upload.filename:
            extracted, filename = extract_report_text(upload)
            if extracted:
                form["report_text"] = extracted
                form["report_title"] = filename
                status = f"Uploaded {filename} and extracted text successfully."
            else:
                status = f"Uploaded {filename}, but no readable text could be extracted."

        detected_language = detect_language(
            f"{form['symptoms']} {form['report_text']} {form['duration']} {form['city']}"
        )

        # Run analysis
        symptom_result = analyze_symptoms_smart(
            os.environ,
            form["age"],
            form["sex"],
            form["duration"],
            form["severity"],
            form["symptoms"],
            city=form["city"],
            language=detected_language,
        )

        report_result = analyze_report_smart(
            os.environ,
            form["report_title"],
            form["report_text"],
            severity=form["severity"],
            city=form["city"],
            language=detected_language,
        )

        patient_label = f"{form['age']}-year-old {form['sex']}"
        clinical_note = generate_clinical_note_smart(
            os.environ,
            patient_label,
            symptom_result,
            report_result,
            language=detected_language,
        )

        has_ai = bool(os.getenv("OPENAI_API_KEY") and os.getenv("OPENAI_MODEL"))
        source_mode = "AI model mode" if has_ai else "ML fallback mode"

        severity_score = _severity_numeric(form["severity"])
        symptom_score = symptom_result.triage_score
        report_score = report_result.triage_score
        overall_score = int(round((0.5 * symptom_score) + (0.3 * report_score) + (0.2 * severity_score)))
        overall_score = max(0, min(100, overall_score))

        triage_dashboard = {
            "overallScore": overall_score,
            "overallBand": _dashboard_band(overall_score),
            "severityScore": severity_score,
            "symptomScore": symptom_score,
            "reportScore": report_score,
            "outputLanguage": detected_language,
        }

        return jsonify({
            "success": True,
            "form": form,
            "symptom_result": symptom_result.to_dict(),
            "report_result": report_result.to_dict(),
            "triage_dashboard": triage_dashboard,
            "clinical_note": clinical_note,
            "status": status,
            "source_mode": source_mode,
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e),
        }), 500


if __name__ == "__main__":
    host = os.getenv("FLASK_HOST", "0.0.0.0")
    port = int(os.getenv("PORT", os.getenv("FLASK_PORT", "5000")))
    app.run(host=host, port=port, debug=False, use_reloader=False)
