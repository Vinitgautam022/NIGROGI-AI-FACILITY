# Flask Virtual Hospital (Pure Python AI/ML)

This is a pure Flask + Python implementation of the virtual hospital flow with:

- Symptom analysis using an in-app ML classifier (scikit-learn)
- Report analysis with clinical marker screening
- PDF and image (JPG/JPEG/PNG/WEBP) upload support
- OCR extraction using pytesseract for images
- Optional OpenAI-compatible LLM mode for smarter analysis and note generation
- Automatic fallback to local ML/rule logic when API credentials are not configured

## 1) Setup

1. Create and activate a virtual environment.
2. Install dependencies:

   pip install -r requirements.txt

3. Copy env template:

   copy .env.example .env

4. Fill environment values in .env if you want AI model mode:

   OPENAI_API_KEY=your_api_key_here
   OPENAI_MODEL=gpt-4o-mini
   OPENAI_BASE_URL=https://api.openai.com/v1
   FLASK_SECRET_KEY=change-this-secret

## 2) Run

python app.py

Open: http://127.0.0.1:5000

## 3) OCR Requirement (Important)

pytesseract needs the Tesseract OCR engine installed on your system.

On Windows:
- Install Tesseract OCR (for example from UB Mannheim build).
- Ensure tesseract.exe is in your PATH.

If Tesseract is missing, image OCR will not work, but text and PDF parsing still works.

## 4) Project Files

- app.py: Flask routes and request handling
- ai_engine.py: ML analysis + optional LLM integration
- file_utils.py: PDF/image/text extraction logic
- templates/index.html: UI
- static/style.css: styling
