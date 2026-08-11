"""
FastAPI Main Application
Morse Code Translator & Automata Visualizer Backend
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes import morse, automaton

# Create FastAPI app instance
app = FastAPI(
    title="Morse Code Automata Visualizer API",
    description="Backend API for Morse code translation with NFA/DFA visualization",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(morse.router, prefix="/api/morse", tags=["Morse Code"])
app.include_router(automaton.router, prefix="/api/automaton", tags=["Automata"])

@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return {
        "message": "Morse Code Automata Visualizer API",
        "status": "running",
        "docs": "/api/docs"
    }

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "morse-automata-api",
        "version": "1.0.0"
    }
