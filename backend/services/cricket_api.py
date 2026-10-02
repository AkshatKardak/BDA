"""
backend/services/cricket_api.py
===============================
Official Live CricketData API Integration Service.
Queries CricAPI (CricketData.org) for real-time live match telemetry.

Security Rules:
- CRICKET_API_KEY is read strictly from backend/.env or root .env.
- API key is NEVER returned in responses, NEVER logged, NEVER exposed to client.

Integrity Rules:
- If no IPL match is in progress, explicitly returns "No IPL match is currently live".
- NEVER generates fake scores or synthetic live data.
- Built-in 60-second in-memory caching to avoid exhausting API quotas.
"""

import os
import time
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional
import requests
from dotenv import load_dotenv

# Ensure environment variables are loaded from backend/.env or root .env
_CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
_BACKEND_DIR = os.path.dirname(_CURRENT_DIR)
_PROJECT_ROOT = os.path.dirname(_BACKEND_DIR)

load_dotenv(os.path.join(_BACKEND_DIR, ".env"))
load_dotenv(os.path.join(_PROJECT_ROOT, ".env"))

CRICAPI_BASE_URL = "https://api.cricapi.com/v1"
CACHE_TTL_SECONDS = 60

class CricketAPIService:
    def __init__(self):
        self.api_key = os.getenv("CRICKET_API_KEY", "").strip()
        self._cached_response: Optional[Dict[str, Any]] = None
        self._last_fetch_time: float = 0.0

    def _get_ist_time(self) -> str:
        """Returns formatted Indian Standard Time (UTC+5:30)."""
        ist = timezone(timedelta(hours=5, minutes=30))
        return datetime.now(ist).strftime("%Y-%m-%d %H:%M:%S IST")

    def _is_ipl_match(self, match: Dict[str, Any]) -> bool:
        """Determines if a match belongs to the Indian Premier League."""
        name = match.get("name", "").lower()
        match_type = match.get("matchType", "").lower()
        series_id = match.get("series_id", "").lower() if isinstance(match.get("series_id"), str) else ""
        
        ipl_signatures = ["indian premier league", "tata ipl", "ipl 20", "ipl t20", "vivo ipl"]
        for sig in ipl_signatures:
            if sig in name or sig in match_type or sig in series_id:
                return True
        # Check if match name contains IPL surrounded by space/delimiters
        if " ipl " in f" {name} ":
            return True
        return False

    def get_live_matches(self, force_refresh: bool = False) -> Dict[str, Any]:
        """
        Fetches current matches from CricketData API with 60-second cache.
        Filters specifically for active IPL fixtures.
        """
        now = time.time()
        ist_now = self._get_ist_time()

        # Return cached response if within TTL
        if not force_refresh and self._cached_response is not None:
            if (now - self._last_fetch_time) < CACHE_TTL_SECONDS:
                return self._cached_response

        if not self.api_key:
            return {
                "status": "unconfigured",
                "count": 0,
                "matches": [],
                "message": "CRICKET_API_KEY is not configured in backend/.env",
                "last_updated": ist_now
            }

        try:
            url = f"{CRICAPI_BASE_URL}/currentMatches"
            params = {
                "apikey": self.api_key,
                "offset": 0
            }
            response = requests.get(url, params=params, timeout=10)
            
            if response.status_code != 200:
                # Return graceful fallback without fake data
                fallback = {
                    "status": "unavailable",
                    "count": 0,
                    "matches": [],
                    "message": "Live data temporarily unavailable",
                    "last_updated": ist_now
                }
                self._cached_response = fallback
                self._last_fetch_time = now
                return fallback

            data = response.json()
            if data.get("status") != "success":
                fallback = {
                    "status": "unavailable",
                    "count": 0,
                    "matches": [],
                    "message": data.get("message", "Live data temporarily unavailable"),
                    "last_updated": ist_now
                }
                self._cached_response = fallback
                self._last_fetch_time = now
                return fallback

            raw_matches = data.get("data", [])
            ipl_matches: List[Dict[str, Any]] = []

            for m in raw_matches:
                if self._is_ipl_match(m):
                    ipl_matches.append({
                        "id": m.get("id"),
                        "name": m.get("name"),
                        "matchType": m.get("matchType"),
                        "status": m.get("status"),
                        "venue": m.get("venue"),
                        "date": m.get("date"),
                        "dateTimeGMT": m.get("dateTimeGMT"),
                        "teams": m.get("teams", []),
                        "teamInfo": m.get("teamInfo", []),
                        "score": m.get("score", []),
                        "tossWinner": m.get("tossWinner"),
                        "tossChoice": m.get("tossChoice"),
                        "matchStarted": m.get("matchStarted", False),
                        "matchEnded": m.get("matchEnded", False)
                    })

            if len(ipl_matches) > 0:
                result = {
                    "status": "live",
                    "count": len(ipl_matches),
                    "matches": ipl_matches,
                    "message": f"{len(ipl_matches)} active IPL match telemetry stream(s)",
                    "last_updated": ist_now
                }
            else:
                result = {
                    "status": "idle",
                    "count": 0,
                    "matches": [],
                    "message": "No IPL match is currently live",
                    "last_updated": ist_now
                }

            self._cached_response = result
            self._last_fetch_time = now
            return result

        except Exception as e:
            fallback = {
                "status": "unavailable",
                "count": 0,
                "matches": [],
                "message": "Live data temporarily unavailable",
                "last_updated": ist_now
            }
            self._cached_response = fallback
            self._last_fetch_time = now
            return fallback

cricket_api_service = CricketAPIService()
