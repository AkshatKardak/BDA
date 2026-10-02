/**
 * frontend/lib/api.ts
 * ===================
 * Client API utility to communicate with the FastAPI Big Data backend.
 * Features:
 * - In-memory caching with 10-minute TTL for instant (0ms) page-to-page navigation
 * - In-flight promise deduplication to prevent duplicate concurrent network calls
 * - Force-refresh capability for live pipeline audits
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const inFlightRequests = new Map<string, Promise<any>>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache

async function fetchFromApi<T>(endpoint: string, forceFresh: boolean = false): Promise<T> {
  // Check memory cache if fresh
  if (!forceFresh && memoryCache.has(endpoint)) {
    const entry = memoryCache.get(endpoint)!;
    if (Date.now() - entry.timestamp < CACHE_TTL_MS) {
      return entry.data as T;
    }
  }

  // Deduplicate in-flight network requests
  if (inFlightRequests.has(endpoint) && !forceFresh) {
    return inFlightRequests.get(endpoint)!;
  }

  const url = `${API_BASE}${endpoint}`;
  const requestPromise = (async () => {
    try {
      const res = await fetch(url, {
        headers: {
          "Accept": "application/json"
        }
      });
      if (!res.ok) {
        throw new Error(`API Error ${res.status}: ${res.statusText} at ${endpoint}`);
      }
      const data = await res.json();
      memoryCache.set(endpoint, {
        data,
        timestamp: Date.now()
      });
      return data as T;
    } catch (err: any) {
      console.error(`Failed to fetch from ${url}:`, err);
      throw err;
    } finally {
      inFlightRequests.delete(endpoint);
    }
  })();

  inFlightRequests.set(endpoint, requestPromise);
  return requestPromise;
}

export const api = {
  getOverview: (force?: boolean) => fetchFromApi<any>("/overview", force),
  getTeams: (force?: boolean) => fetchFromApi<{ total_teams: number; franchises: any[] }>("/teams", force),
  getTeamDetail: (team: string, force?: boolean) => fetchFromApi<any>(`/teams/${encodeURIComponent(team)}`, force),
  getPlayers: (params?: { q?: string; role?: string; limit?: number }, force?: boolean) => {
    const sp = new URLSearchParams();
    if (params?.q) sp.append("q", params.q);
    if (params?.role) sp.append("role", params.role);
    if (params?.limit) sp.append("limit", params.limit.toString());
    const query = sp.toString() ? `?${sp.toString()}` : "";
    return fetchFromApi<any>(`/players${query}`, force);
  },
  getPlayerDetail: (player: string, force?: boolean) => fetchFromApi<any>(`/players/${encodeURIComponent(player)}`, force),
  getToss: (force?: boolean) => fetchFromApi<any>("/toss", force),
  getVenues: (force?: boolean) => fetchFromApi<any>("/venues", force),
  getVenueDetail: (venue: string, force?: boolean) => fetchFromApi<any>(`/venues/${encodeURIComponent(venue)}`, force),
  getSeasons: (force?: boolean) => fetchFromApi<any>("/seasons", force),
  getSeasonDetail: (season: string, force?: boolean) => fetchFromApi<any>(`/seasons/${encodeURIComponent(season)}`, force),
  getLeaderboards: (force?: boolean) => fetchFromApi<any>("/leaderboards", force),
  getTrends: (force?: boolean) => fetchFromApi<any>("/trends", force),
  getMatches: (params?: { page?: number; limit?: number; season?: string; team?: string; venue?: string }, force?: boolean) => {
    const sp = new URLSearchParams();
    if (params?.page) sp.append("page", params.page.toString());
    if (params?.limit) sp.append("limit", params.limit.toString());
    if (params?.season) sp.append("season", params.season);
    if (params?.team) sp.append("team", params.team);
    if (params?.venue) sp.append("venue", params.venue);
    const query = sp.toString() ? `?${sp.toString()}` : "";
    return fetchFromApi<any>(`/matches${query}`, force);
  },
  getPipelineStatus: (force: boolean = true) => fetchFromApi<any>("/pipeline/status", force),
  getHealth: (force: boolean = true) => fetchFromApi<any>("/health", force),
  clearCache: () => {
    memoryCache.clear();
    inFlightRequests.clear();
  }
};
