from backend.routes.overview import router as overview_router
from backend.routes.teams import router as teams_router
from backend.routes.players import router as players_router
from backend.routes.toss import router as toss_router
from backend.routes.venues import router as venues_router
from backend.routes.seasons import router as seasons_router
from backend.routes.leaderboards import router as leaderboards_router
from backend.routes.trends import router as trends_router
from backend.routes.matches import router as matches_router
from backend.routes.pipeline import router as pipeline_router
from backend.routes.live import router as live_router
from backend.routes.analytics import router as analytics_router
from backend.routes.data_quality import router as data_quality_router

__all__ = [
    "overview_router",
    "teams_router",
    "players_router",
    "toss_router",
    "venues_router",
    "seasons_router",
    "leaderboards_router",
    "trends_router",
    "matches_router",
    "pipeline_router",
    "live_router",
    "analytics_router",
    "data_quality_router"
]
