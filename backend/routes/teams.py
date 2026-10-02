"""
backend/routes/teams.py
=======================
Endpoints for IPL franchise performance, win rates, and head-to-head records.
"""

from fastapi import APIRouter, HTTPException
from backend.services.data_loader import data_service
from backend.schemas.models import TeamsListResponse, TeamDetailResponse

router = APIRouter(prefix="/teams", tags=["Teams"])

@router.get("", response_model=TeamsListResponse)
def get_teams():
    return data_service.get_teams()

@router.get("/{team_name}", response_model=TeamDetailResponse)
def get_team_detail(team_name: str):
    detail = data_service.get_team_detail(team_name)
    if not detail:
        raise HTTPException(status_code=404, detail=f"Team '{team_name}' not found.")
    return detail
