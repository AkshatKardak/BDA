"""
backend/routes/leaderboards.py
==============================
Endpoints for all-time IPL leaderboards across runs, wickets, strike rates, and boundaries.
"""

from fastapi import APIRouter
from backend.services.data_loader import data_service
from backend.schemas.models import LeaderboardsResponse

router = APIRouter(prefix="/leaderboards", tags=["Leaderboards"])

@router.get("", response_model=LeaderboardsResponse)
def get_leaderboards():
    return data_service.get_leaderboards()
