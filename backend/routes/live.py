"""
backend/routes/live.py
======================
Endpoints for real-time live IPL match telemetry via CricketData.org API.
Strict Rules:
- If no IPL match is in progress, explicitly returns "No IPL match is currently live".
- NEVER generates fake scores or synthetic live data.
- API key is never exposed.
"""

from fastapi import APIRouter, Query
from backend.services.cricket_api import cricket_api_service

router = APIRouter(prefix="/live", tags=["Live Cricket Data"])

@router.get("/matches")
def get_live_matches(force_refresh: bool = Query(False, description="Bypass in-memory 60s cache")):
    """
    Fetch active IPL live match scorecards and status.
    Returns status: 'idle' with 'No IPL match is currently live' when no match is active.
    """
    return cricket_api_service.get_live_matches(force_refresh=force_refresh)

@router.get("/status")
def get_live_status():
    """
    Check the connectivity and cache status of the live data integration.
    """
    return {
        "service": "CricketData Live API Poller",
        "has_key": bool(cricket_api_service.api_key),
        "cache_ttl_seconds": 60,
        "mode": "GENUINE_LIVE_ONLY"
    }
