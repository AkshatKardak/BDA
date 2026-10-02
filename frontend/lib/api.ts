/**
 * frontend/lib/api.ts
 * ===================
 * Client API utility to communicate with the FastAPI Big Data backend.
 * All figures returned originate from genuine Cricsheet historical IPL
 * records processed through Apache Flume, HDFS, Hive, and PySpark.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

async function fetchFromApi<T>(endpoint: string): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      cache: "no-store", // Keep fresh for live inspection
      headers: {
        "Accept": "application/json"
      }
    });
    if (!res.ok) {
      throw new Error(`API Error ${res.status}: ${res.statusText} at ${endpoint}`);
    }
    return await res.json();
  } catch (err: any) {
    console.error(`Failed to fetch from ${url}:`, err);
    throw err;
  }
}

export const api = {
  getOverview: () => fetchFromApi<any>("/overview"),
  getTeams: () => fetchFromApi<{ total_teams: number; franchises: any[] }>("/teams"),
  getTeamDetail: (team: string) => fetchFromApi<any>(`/teams/${encodeURIComponent(team)}`),
  getPlayers: (params?: { q?: string; role?: string; limit?: number }) => {
    const sp = new URLSearchParams();
    if (params?.q) sp.append("q", params.q);
    if (params?.role) sp.append("role", params.role);
    if (params?.limit) sp.append("limit", params.limit.toString());
    const query = sp.toString() ? `?${sp.toString()}` : "";
    return fetchFromApi<any>(`/players${query}`);
  },
  getPlayerDetail: (player: string) => fetchFromApi<any>(`/players/${encodeURIComponent(player)}`),
  getToss: () => fetchFromApi<any>("/toss"),
  getVenues: () => fetchFromApi<any>("/venues"),
  getVenueDetail: (venue: string) => fetchFromApi<any>(`/venues/${encodeURIComponent(venue)}`),
  getSeasons: () => fetchFromApi<any>("/seasons"),
  getSeasonDetail: (season: string) => fetchFromApi<any>(`/seasons/${encodeURIComponent(season)}`),
  getLeaderboards: () => fetchFromApi<any>("/leaderboards"),
  getTrends: () => fetchFromApi<any>("/trends"),
  getMatches: (params?: { page?: number; limit?: number; season?: string; team?: string; venue?: string }) => {
    const sp = new URLSearchParams();
    if (params?.page) sp.append("page", params.page.toString());
    if (params?.limit) sp.append("limit", params.limit.toString());
    if (params?.season) sp.append("season", params.season);
    if (params?.team) sp.append("team", params.team);
    if (params?.venue) sp.append("venue", params.venue);
    const query = sp.toString() ? `?${sp.toString()}` : "";
    return fetchFromApi<any>(`/matches${query}`);
  },
  getPipelineStatus: () => fetchFromApi<any>("/pipeline/status"),
  getHealth: () => fetchFromApi<any>("/health"),
};
