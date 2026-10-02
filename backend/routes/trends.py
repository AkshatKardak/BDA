"""
backend/routes/trends.py
========================
Endpoints for multi-year trends, run-rates, boundaries, and bowling metrics.
"""

from fastapi import APIRouter
from backend.services.data_loader import data_service
from backend.schemas.models import TrendsResponse

router = APIRouter(prefix="/trends", tags=["Trends"])

@router.get("", response_model=TrendsResponse)
def get_trends():
    return data_service.get_trends()
