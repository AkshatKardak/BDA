"""
backend/routes/toss.py
======================
Endpoints for toss decision analysis and win impact correlation.
"""

from fastapi import APIRouter
from backend.services.data_loader import data_service
from backend.schemas.models import TossTrendsResponse

router = APIRouter(prefix="/toss", tags=["Toss Analysis"])

@router.get("", response_model=TossTrendsResponse)
def get_toss_analysis():
    return data_service.get_toss()
