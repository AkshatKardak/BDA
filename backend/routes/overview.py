"""
backend/routes/overview.py
==========================
Overview endpoints for high-level IPL Big Data KPIs.
"""

from fastapi import APIRouter, HTTPException
from backend.services.data_loader import data_service
from backend.schemas.models import OverviewResponse

router = APIRouter(prefix="/overview", tags=["Overview"])

@router.get("", response_model=OverviewResponse)
def get_overview():
    data = data_service.get_overview()
    if not data:
        raise HTTPException(status_code=404, detail="Overview data not found. Please ensure PySpark analytics export has run.")
    return data
