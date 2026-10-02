"""
backend/routes/analytics.py
===========================
Endpoints for deep-dive analytical modules:
- Playoffs & Finals records (74 matches, 19 finals)
- Innings Phases (Powerplay, Middle, Death)
- Over-by-Over run rates & wickets progression
- Data-driven automated insights
"""

from fastapi import APIRouter
from backend.services.data_loader import data_service

router = APIRouter(prefix="/analytics", tags=["Advanced Analytics"])

@router.get("/playoffs")
def get_playoffs():
    """Returns 74 playoff matches, 19 finals history, and franchise playoff records."""
    return data_service.get_playoffs()

@router.get("/phases")
def get_phases():
    """Returns Powerplay (1-6), Middle (7-15), and Death (16-20) aggregated stats."""
    return data_service.get_phases()

@router.get("/run-rate")
def get_run_rate():
    """Returns granular Over 1 to 20 scoring rates, wickets, and boundary frequencies."""
    return data_service.get_over_by_over()

@router.get("/insights")
def get_insights():
    """Returns automated data-driven insights derived from genuine tournament records."""
    return data_service.get_insights()
