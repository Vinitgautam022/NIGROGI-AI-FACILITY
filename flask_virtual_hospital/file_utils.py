from __future__ import annotations

from io import BytesIO
from pathlib import Path

import pdfplumber
from werkzeug.datastructures import FileStorage

try:
    import pytesseract
    from PIL import Image
except Exception:
    pytesseract = None
    Image = None


TEXT_EXTENSIONS = {".txt", ".md", ".csv", ".json"}
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def extract_report_text(upload: FileStorage) -> tuple[str, str]:
    filename = upload.filename or "uploaded-file"
    suffix = Path(filename).suffix.lower()
    raw = upload.read()

    if not raw:
        return "", filename

    if suffix in TEXT_EXTENSIONS:
        try:
            return raw.decode("utf-8", errors="ignore").strip(), filename
        except Exception:
            return "", filename

    if suffix in IMAGE_EXTENSIONS:
        if not Image or not pytesseract:
            return (
                "Image OCR dependencies are not installed in this Python environment. "
                "Install Pillow and pytesseract, then retry.",
                filename,
            )

        image = Image.open(BytesIO(raw))
        ocr_text = pytesseract.image_to_string(image)
        return ocr_text.strip(), filename

    if suffix == ".pdf":
        text_parts: list[str] = []
        with pdfplumber.open(BytesIO(raw)) as pdf:
            for page in pdf.pages:
                extracted = page.extract_text() or ""
                if extracted.strip():
                    text_parts.append(extracted.strip())
        return "\n\n".join(text_parts).strip(), filename

    # Attempt generic text fallback for unknown file extensions.
    try:
        return raw.decode("utf-8", errors="ignore").strip(), filename
    except Exception:
        return "", filename
