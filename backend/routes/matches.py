"""
backend/routes/matches.py
=========================
Endpoints for querying, searching, and paginating real IPL matches.
"""

from typing import Optional
from fastapi import APIRouter, Query
from backend.services.data_loader import data_service
from backend.schemas.models import MatchesResponse

router = APIRouter(prefix="/matches", tags=["Matches"])

@router.get("", response_model=MatchesResponse)
def get_matches(
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(20, ge=1, le=100, description="Items per page"),
    season: Optional[str] = Query(None, description="Filter by IPL season year"),
    team: Optional[str] = Query(None, description="Filter by team name"),
    venue: Optional[str] = Query(None, description="Filter by venue name"),
    stage: Optional[str] = Query(None, description="Filter by match stage (e.g. Final, Qualifier 1, Eliminator, Qualifier 2, League, playoffs)"),
    match_id: Optional[int] = Query(None, description="Filter by specific match ID")
):
    return data_service.get_matches(
        page=page,
        limit=limit,
        season=season,
        team=team,
        venue=venue,
        stage=stage,
        match_id=match_id
    )
