"""
backend/routes/venues.py
========================
Endpoints for stadium profiles, batting first vs chasing biases, and par scores.
"""

from fastapi import APIRouter, HTTPException
from backend.services.data_loader import data_service
from backend.schemas.models import VenuesResponse

router = APIRouter(prefix="/venues", tags=["Venues"])

@router.get("", response_model=VenuesResponse)
def get_venues():
    return data_service.get_venues()

@router.get("/{venue_name}")
def get_venue_detail(venue_name: str):
    venue = data_service.get_venue_detail(venue_name)
    if not venue:
        raise HTTPException(status_code=404, detail=f"Venue '{venue_name}' not found.")
    return venue
