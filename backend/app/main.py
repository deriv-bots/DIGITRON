
from fastapi import FastAPI
from datetime import datetime, timezone

app = FastAPI(
    title="DIGITRON API",
    description="Quantitative Digit Intelligence",
    version="0.1.0"
)


@app.get("/")
async def root():
    return {
        "project": "DIGITRON",
        "message": "Quantitative Digit Intelligence",
        "status": "running"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "project": "DIGITRON",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
