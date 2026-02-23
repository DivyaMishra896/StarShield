from fastapi import FastAPI
from .schemas import DetectionResponse
from .services.detection_service import run_detection

app = FastAPI(title="StarShield AI Backend")

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/run-detection", response_model=DetectionResponse)
def run_detection_api():
    return run_detection()