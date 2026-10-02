"""
backend/routes/pipeline.py
==========================
Endpoints for checking pipeline architecture status, Hadoop/Flume/Hive/PySpark components,
and real-time system health.
"""

from fastapi import APIRouter
from backend.services.data_loader import data_service
from backend.schemas.models import PipelineHealthResponse

router = APIRouter(tags=["Pipeline & Health"])

@router.get("/health", response_model=PipelineHealthResponse)
def get_health():
    return data_service.get_pipeline_health()

@router.get("/pipeline/status", response_model=PipelineHealthResponse)
def get_pipeline_status():
    return data_service.get_pipeline_health()
