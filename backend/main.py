from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from schemas import DetectionResponse
from services.detection_service import run_detection

app = FastAPI(title="StarShield AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # hackathon-safe
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/run-detection")
def run_detection_api():
    return run_detection()
