"""
backend/routes/players.py
=========================
Endpoints for IPL player analytics, career aggregates, and Orange/Purple Cap milestones.
"""

from typing import Optional
from fastapi import APIRouter, HTTPException, Query
from backend.services.data_loader import data_service
from backend.schemas.models import PlayersResponse

router = APIRouter(prefix="/players", tags=["Players"])

@router.get("", response_model=PlayersResponse)
def get_players(
    q: Optional[str] = Query(None, description="Search player by name"),
    role: Optional[str] = Query(None, description="Filter by 'batter' or 'bowler'"),
    limit: int = Query(50, ge=1, le=500, description="Maximum records to return")
):
    return data_service.get_players(query=q, role=role, limit=limit)

@router.get("/{player_name}")
def get_player_detail(player_name: str):
    detail = data_service.get_player_detail(player_name)
    if not detail:
        raise HTTPException(status_code=404, detail=f"Player '{player_name}' not found.")
    return detail
