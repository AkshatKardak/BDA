"""
backend/main.py
===============
FastAPI Application Entry Point for IPL Large-Scale Cricket Data Analytics.
Serves processed insights derived from Apache Flume, HDFS, Hive, and PySpark.
"""

import os
import sys

# Ensure parent directory (project root) is on sys.path
_CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
_PROJECT_ROOT = os.path.dirname(_CURRENT_DIR)
if _PROJECT_ROOT not in sys.path:
    sys.path.insert(0, _PROJECT_ROOT)
if _CURRENT_DIR not in sys.path:
    sys.path.insert(0, _CURRENT_DIR)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

try:
    from backend.config import settings
    from backend.routes import (
        overview_router,
        teams_router,
        players_router,
        toss_router,
        venues_router,
        seasons_router,
        leaderboards_router,
        trends_router,
        matches_router,
        pipeline_router
    )
except ModuleNotFoundError:
    from config import settings
    from routes import (
        overview_router,
        teams_router,
        players_router,
        toss_router,
        venues_router,
        seasons_router,
        leaderboards_router,
        trends_router,
        matches_router,
        pipeline_router
    )

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Academic Big Data API serving genuine 2008-2026 IPL analytics computed via Apache Flume, Hadoop HDFS, Hive, and PySpark.",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Enable CORS for Next.js / frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register All API Routers under /api
app.include_router(overview_router, prefix=settings.API_PREFIX)
app.include_router(teams_router, prefix=settings.API_PREFIX)
app.include_router(players_router, prefix=settings.API_PREFIX)
app.include_router(toss_router, prefix=settings.API_PREFIX)
app.include_router(venues_router, prefix=settings.API_PREFIX)
app.include_router(seasons_router, prefix=settings.API_PREFIX)
app.include_router(leaderboards_router, prefix=settings.API_PREFIX)
app.include_router(trends_router, prefix=settings.API_PREFIX)
app.include_router(matches_router, prefix=settings.API_PREFIX)
app.include_router(pipeline_router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "project": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/api/health",
        "overview": "/api/overview"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
