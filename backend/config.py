"""
backend/config.py
=================
Configuration settings for IPL Big Data Analytics FastAPI Backend.
"""

import os
from pydantic import BaseModel

class Settings:
    PROJECT_NAME: str = "IPL Large-Scale Cricket Data Analytics API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    WEB_DATA_DIR: str = os.path.join(BASE_DIR, "web_data")
    OUTPUT_DIR: str = os.path.join(BASE_DIR, "output")
    DATA_DIR: str = os.path.join(BASE_DIR, "data")
    HADOOP_DIR: str = os.path.join(BASE_DIR, "hadoop")
    FLUME_DIR: str = os.path.join(BASE_DIR, "flume")
    HIVE_DIR: str = os.path.join(BASE_DIR, "hive")
    
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "*"
    ]

settings = Settings()
