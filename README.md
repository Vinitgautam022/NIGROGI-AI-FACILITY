# AI-Powered Virtual Hospital

A Next.js starter for a virtual hospital experience where patients can describe symptoms, upload reports, and receive preliminary analysis, recommendations, and a structured medical summary.

## Features

- Symptom analysis via AI model (OpenAI-compatible), with rule-based fallback
- Medical report upload with OCR support for image files
- AI-assisted medical report generation
- Recommended next-step tests and risk summary
- API-ready structure for further ML/NLP integration

## Getting Started

Install dependencies and run the dev server:

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

## AI/ML Configuration

To enable model-based analysis, create a `.env.local` file in the project root:

```bash
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4o-mini
OPENAI_BASE_URL=https://api.openai.com/v1
```

Notes:

- `OPENAI_BASE_URL` can point to any OpenAI-compatible endpoint.
- If `OPENAI_API_KEY` or `OPENAI_MODEL` is missing, the app automatically falls back to rule-based analysis.

## Available Scripts

- `npm run dev` - Start the development server.
- `npm run build` - Build the app for production.
- `npm run start` - Run the production build.
- `npm run lint` - Run ESLint checks.

## Render Deployment

This repo contains two separate apps:

- The root Next.js app, which is the current public UI.
- `flask_virtual_hospital/`, which is a separate legacy Flask implementation.

If you deploy the site from Render, point the service at the repository root so Render builds and starts the Next.js app. Deploying the Flask subfolder will show the older Flask page instead of the current UI.

## API Endpoints

- `POST /api/analyze-symptoms`
	- Input: `{ age, sex, duration, severity, symptoms }`
	- Output: `AnalysisResult`
- `POST /api/analyze-report`
	- Input: `{ reportTitle, reportText }`
	- Output: `AnalysisResult`
- `POST /api/generate-report`
	- Input: patient label + symptom/report payload and optional precomputed analyses
	- Output: `{ note, symptomAnalysis, reportAnalysis }`

## Notes

- Analysis uses AI mode when API credentials are configured, otherwise safe fallback rules are used.
- This project is not a medical device and does not replace clinician judgment.
- For production use, add clinical validation, privacy/security controls, and monitoring.

## Validation Status

- Dependencies installed successfully.
- Lint completed successfully.
- Production build completed successfully.

## Project Structure

- `src/app` - app routes and UI
- `src/app/api` - API endpoints for analysis workflows
- `src/lib` - shared analysis helpers and data models
