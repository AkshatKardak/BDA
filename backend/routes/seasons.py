"""
backend/routes/seasons.py
=========================
Endpoints for IPL season timelines and individual season aggregates.
"""

from fastapi import APIRouter, HTTPException
from backend.services.data_loader import data_service
from backend.schemas.models import SeasonsResponse, SeasonDetailResponse

router = APIRouter(prefix="/seasons", tags=["Seasons"])

@router.get("", response_model=SeasonsResponse)
def get_seasons():
    return data_service.get_seasons()

@router.get("/{season}", response_model=SeasonDetailResponse)
def get_season_detail(season: str):
    detail = data_service.get_season_detail(season)
    if not detail:
        raise HTTPException(status_code=404, detail=f"Season '{season}' not found.")
    return detail
