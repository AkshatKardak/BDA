"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  Filter, 
  Trophy, 
  Calendar, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  Zap,
  Award
} from "lucide-react";
import { api } from "@/lib/api";

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(20);
  const [season, setSeason] = useState("");
  const [team, setTeam] = useState("");
  const [venue, setVenue] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatches() {
      try {
        setLoading(true);
        const res = await api.getMatches({
          page,
          limit,
          season: season || undefined,
          team: team || undefined,
          venue: venue || undefined
        });
        setMatches(res.matches || []);
        setTotal(res.total || 0);
        setTotalPages(res.total_pages || 1);
      } catch (err) {
        console.error("Failed to load matches:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, [page, season, team, venue, limit]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on filter change
  };

  const handleClearFilters = () => {
    setSeason("");
    setTeam("");
    setVenue("");
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-2">
          <Search className="w-3.5 h-3.5" />
          Genuine Match Ledger Explorer
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          IPL Historical Match Archives (2008–2026)
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Explore all 1,243 official IPL fixtures. Search by franchise, season, venue, or toss outcomes.
        </p>
      </div>

      {/* Filters Form */}
      <form
        onSubmit={handleFilterSubmit}
        className="rounded-xl border border-gray-800 bg-gray-900/60 p-4 backdrop-blur-sm grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs"
      >
        <div>
          <label className="block text-[11px] font-mono text-gray-400 mb-1">Season</label>
          <input
            type="text"
            placeholder="e.g. 2026 or 2024"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-gray-400 mb-1">Franchise / Team</label>
          <input
            type="text"
            placeholder="e.g. Mumbai or Chennai"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-mono text-gray-400 mb-1">Stadium / Venue</label>
          <input
            type="text"
            placeholder="e.g. Wankhede or Eden"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-1.5 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-end space-x-2">
          <button
            type="submit"
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" /> Apply
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="bg-gray-800 hover:bg-gray-700 text-gray-300 py-1.5 px-3 rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Results Count & Pagination Controls */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-gray-400">
          Showing <strong className="text-white">{matches.length}</strong> of{" "}
          <strong className="text-emerald-400">{total.toLocaleString()}</strong> matches
        </span>

        <div className="flex items-center space-x-2">
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-gray-300 px-2">
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-lg bg-gray-900 border border-gray-800 text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Matches Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
          <p className="text-xs text-gray-400 font-mono">Querying match ledger...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-12 text-center text-gray-400">
          <p className="text-sm font-semibold">No matches found matching your filters.</p>
          <p className="text-xs mt-1">Try resetting or using broader search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((m: any) => (
            <div
              key={m.match_id}
              className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 hover:border-gray-700 transition-all backdrop-blur-sm"
            >
              <div className="flex items-center justify-between text-xs text-gray-400 border-b border-gray-800 pb-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-amber-400">Season {m.season}</span>
                  <span>•</span>
                  <span>{m.date || "Date Unspecified"}</span>
                </div>
                <span className="font-mono text-[11px] text-gray-500">#{m.match_id}</span>
              </div>

              {/* Teams & Winner */}
              <div className="space-y-1.5 my-3">
                <div className="flex items-center justify-between text-sm">
                  <span className={`font-bold ${m.winner === m.team1 ? "text-emerald-400 flex items-center gap-1.5" : "text-white"}`}>
                    {m.winner === m.team1 && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
                    {m.team1}
                  </span>
                  {m.winner === m.team1 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Won {m.win_margin ? `by ${m.win_margin} ${m.win_type}` : ""}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className={`font-bold ${m.winner === m.team2 ? "text-emerald-400 flex items-center gap-1.5" : "text-white"}`}>
                    {m.winner === m.team2 && <Trophy className="w-3.5 h-3.5 text-amber-400" />}
                    {m.team2}
                  </span>
                  {m.winner === m.team2 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Won {m.win_margin ? `by ${m.win_margin} ${m.win_type}` : ""}
                    </span>
                  )}
                </div>
              </div>

              {/* Match Details Footer */}
              <div className="pt-3 border-t border-gray-800 text-[11px] text-gray-400 space-y-1">
                <div className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
                  <span className="truncate">{m.venue}{m.city ? `, ${m.city}` : ""}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span>
                    Toss: <strong className="text-gray-300">{m.toss_winner}</strong> ({m.toss_decision})
                  </span>
                  {m.player_of_match && (
                    <span className="flex items-center gap-1 text-amber-300 font-medium">
                      <Award className="w-3 h-3 text-amber-400" />
                      PoM: {m.player_of_match}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
