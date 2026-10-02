"""
backend/routes/data_quality.py
==============================
Endpoint for BDA Data Quality & Pipeline Audit Matrix.
Directly aligned with university / academic syllabus for Streaming Data Analysis.
"""

from fastapi import APIRouter
from backend.services.data_loader import data_service

router = APIRouter(prefix="/data-quality", tags=["Data Quality & Audit"])

@router.get("")
def get_data_quality():
    """
    Returns complete 6-stage BDA data lake integrity metrics, deduplication audit,
    and transformation proofs from Raw Cricsheet -> Polars -> Flume -> HDFS -> Hive -> PySpark.
    """
    return data_service.get_data_quality()
