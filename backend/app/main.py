from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.routes import upload
from .core.config import get_settings

settings = get_settings()

app = FastAPI(
    title="PST Analyzer",
    description="API for analyzing PST files",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(upload.router, prefix="/api", tags=["upload"])

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
