import sys
from pathlib import Path

# Add project root to sys.path so detection_engine is importable on Render
PROJECT_ROOT = str(Path(__file__).resolve().parent.parent)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

# Add backend dir itself for local imports (schemas, services)
BACKEND_DIR = str(Path(__file__).resolve().parent)
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI(title="StarShield AI Backend")

# CORS — allow all origins for frontend on Vercel to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"service": "StarShield AI Backend", "status": "running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/run-detection")
def run_detection_api():
    try:
        from services.detection_service import run_detection
        result = run_detection()
        return result
    except FileNotFoundError as e:
        return JSONResponse(status_code=500, content={"error": f"Data file not found: {str(e)}"})
    except ImportError as e:
        return JSONResponse(status_code=500, content={"error": f"Module import failed: {str(e)}"})
    except Exception as e:
        return JSONResponse(status_code=500, content={"error": f"Detection engine error: {str(e)}"})

# Render requires the app to bind to 0.0.0.0 and $PORT
if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
