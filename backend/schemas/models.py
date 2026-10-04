"""
backend/schemas/models.py
=========================
Pydantic data models for IPL Big Data Analytics API responses.
Directly aligned with genuine PySpark / Hive aggregated tables.
"""

from typing import List, Optional, Dict, Any, Union
from pydantic import BaseModel, Field

# 1. Overview Models
class OverviewKPIs(BaseModel):
    total_matches: int
    total_deliveries: int
    total_seasons: int
    total_teams: int
    total_venues: int
    playoff_matches: Optional[int] = 74
    tournament_finals: Optional[int] = 19
    total_runs: int
    total_wickets: int
    total_sixes: int
    total_fours: int
    average_run_rate: float
    earliest_season: str
    latest_season: str

class OverviewResponse(BaseModel):
    title: str
    description: str
    last_data_update: Optional[str] = None
    live_matches_count: Optional[int] = 0
    kpis: OverviewKPIs
    top_teams: List[Dict[str, Any]]
    top_batters: List[Dict[str, Any]]
    top_bowlers: List[Dict[str, Any]]
    recent_seasons: List[Dict[str, Any]]

# 2. Team Models
class TeamRecord(BaseModel):
    team: str
    matches_played: int
    wins: int
    losses: int
    no_results: Optional[int] = 0
    bat_first_wins: Optional[int] = 0
    chase_wins: Optional[int] = 0
    win_pct: Optional[float] = 0.0
    bat_first_win_pct: Optional[float] = 0.0
    chase_win_pct: Optional[float] = 0.0

class TeamDetailResponse(BaseModel):
    team: str
    matches_played: int
    wins: int
    losses: int
    no_results: Optional[int] = 0
    bat_first_wins: Optional[int] = 0
    chase_wins: Optional[int] = 0
    win_pct: Optional[float] = 0.0
    bat_first_win_pct: Optional[float] = 0.0
    chase_win_pct: Optional[float] = 0.0
    season_history: List[Dict[str, Any]] = []
    h2h_rivalries: List[Dict[str, Any]] = []

class TeamsListResponse(BaseModel):
    total_teams: int
    franchises: List[Dict[str, Any]]

# 3. Player Models
class PlayersResponse(BaseModel):
    top_batters: List[Dict[str, Any]]
    top_bowlers: List[Dict[str, Any]]
    orange_purple_cap_history: List[Dict[str, Any]]

# 4. Toss Models
class TossTrendsResponse(BaseModel):
    overall_distribution: List[Dict[str, Any]]
    season_trends: List[Dict[str, Any]]
    venue_impact: List[Dict[str, Any]]

# 5. Venue Models
class VenuesResponse(BaseModel):
    total_venues: int
    venues: List[Dict[str, Any]]
    major_venues: List[Dict[str, Any]]

# 6. Season Models
class SeasonsResponse(BaseModel):
    total_seasons: int
    timeline: List[Dict[str, Any]]

class SeasonDetailResponse(BaseModel):
    season: Union[str, int]
    summary: Dict[str, Any] = {}
    champion: Optional[str] = None
    runner_up: Optional[str] = None
    winner: Optional[str] = None
    matches_count: Optional[int] = None
    season_matches: Optional[int] = None
    total_runs: Optional[int] = None
    legal_balls: Optional[int] = None
    fours: Optional[int] = None
    sixes: Optional[int] = None
    total_wickets: Optional[int] = None
    run_rate: Optional[float] = None
    avg_match_runs: Optional[float] = None
    avg_match_wickets: Optional[float] = None
    boundary_runs: Optional[int] = None
    boundary_run_pct: Optional[float] = None
    chasing_win_pct: Optional[float] = None
    toss_win_pct: Optional[float] = None
    sample_matches: List[Dict[str, Any]] = []
    leaders: List[Dict[str, Any]] = []

    class Config:
        extra = "allow"

# 7. Leaderboards Models
class LeaderboardsResponse(BaseModel):
    most_runs: List[Dict[str, Any]]
    most_wickets: List[Dict[str, Any]]
    highest_strike_rate: List[Dict[str, Any]]
    best_economy: List[Dict[str, Any]]
    most_sixes: List[Dict[str, Any]]
    most_fours: List[Dict[str, Any]]

# 8. Trends Models
class TrendsResponse(BaseModel):
    season_run_rate: List[Dict[str, Any]]
    boundary_evolution: List[Dict[str, Any]]
    chasing_success: List[Dict[str, Any]]
    wickets_trend: List[Dict[str, Any]]

# 9. Match Models
class MatchesResponse(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int
    matches: List[Dict[str, Any]]

# 10. Pipeline & Health Models
class ComponentStatus(BaseModel):
    name: str
    status: str
    message: str
    details: Optional[Dict[str, Any]] = None

class PipelineHealthResponse(BaseModel):
    status: str
    timestamp: str
    components: Dict[str, ComponentStatus]
    architecture: Dict[str, str]
