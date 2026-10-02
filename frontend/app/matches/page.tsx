"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  Filter, 
  Trophy, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  Award
} from "lucide-react";
import { api } from "@/lib/api";

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);
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
          venue: venue || undefined,
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
    setPage(1);
  };

  const handleClearFilters = () => {
    setSeason("");
    setTeam("");
    setVenue("");
    setPage(1);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-[#F5B942] uppercase mb-0.5">
          <span>MATCH ARCHIVE</span>
          <span>·</span>
          <span>1,243 FIXTURES</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          IPL Historical Match Archives & Scorecards
        </h1>
        <p className="text-xs text-[#A9B2C3] mt-0.5 max-w-3xl leading-normal">
          Official scorecard records covering 19 editions. Search by franchise, tournament season, venue, or toss results.
        </p>
      </div>

      {/* Filter Form */}
      <form
        onSubmit={handleFilterSubmit}
        className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-3 sm:p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs"
      >
        <div>
          <label className="block text-[10px] font-mono uppercase text-[#707B91] mb-1 font-bold">Season</label>
          <input
            type="text"
            placeholder="e.g. 2026 or 2024"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full bg-[#070B16] border border-[rgba(255,255,255,0.08)] rounded-btn px-2.5 py-1.5 text-xs text-white placeholder-[#707B91] focus:outline-none focus:border-[#2476E8]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase text-[#707B91] mb-1 font-bold">Franchise / Team</label>
          <input
            type="text"
            placeholder="e.g. Mumbai or Chennai"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="w-full bg-[#070B16] border border-[rgba(255,255,255,0.08)] rounded-btn px-2.5 py-1.5 text-xs text-white placeholder-[#707B91] focus:outline-none focus:border-[#2476E8]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase text-[#707B91] mb-1 font-bold">Stadium / Ground</label>
          <input
            type="text"
            placeholder="e.g. Wankhede or Eden"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="w-full bg-[#070B16] border border-[rgba(255,255,255,0.08)] rounded-btn px-2.5 py-1.5 text-xs text-white placeholder-[#707B91] focus:outline-none focus:border-[#2476E8]"
          />
        </div>

        <div className="flex items-end space-x-1.5">
          <button
            type="submit"
            className="flex-1 h-[32px] bg-[#165DCC] hover:bg-[#2476E8] text-white font-semibold rounded-btn transition-colors flex items-center justify-center gap-1.5 text-xs"
          >
            <Filter className="w-3.5 h-3.5" /> Apply
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="h-[32px] px-3 bg-[#111A2E] hover:bg-[#18233C] text-[#A9B2C3] rounded-btn transition-colors text-xs"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Results Count & Pagination Controls */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-[#A9B2C3] text-[11px]">
          Showing <strong className="text-white">{matches.length}</strong> of{" "}
          <strong className="text-[#F5B942]">{total.toLocaleString()}</strong> official fixtures
        </span>

        <div className="flex items-center space-x-1">
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-1 rounded-btn bg-[#0D1424] border border-[rgba(255,255,255,0.08)] text-[#A9B2C3] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[#A9B2C3] px-1.5 text-[11px]">
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-1 rounded-btn bg-[#0D1424] border border-[rgba(255,255,255,0.08)] text-[#A9B2C3] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Matches Grid - Scorecard Hierarchy (Section 50) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-3">
          <div className="w-8 h-8 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin"></div>
          <p className="text-xs text-[#A9B2C3] font-mono tracking-wider">Querying match ledger...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-10 text-center text-[#707B91]">
          <p className="text-xs font-semibold">No matches found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {matches.map((m: any) => (
            <div
              key={m.match_id}
              className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-3.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all hover:border-[rgba(36,118,232,0.3)]"
            >
              {/* Header: Season & Date */}
              <div className="flex items-center justify-between text-xs text-[#707B91] border-b border-[rgba(255,255,255,0.06)] pb-2 mb-2.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-[#F5B942] text-[11px]">Season {m.season}</span>
                  <span>•</span>
                  <span className="text-[11px]">{m.date || "Date Unspecified"}</span>
                </div>
                <span className="font-mono text-[10px] text-[#707B91]">#{m.match_id}</span>
              </div>

              {/* Scorecard Teams Hierarchy */}
              <div className="space-y-1.5 my-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className={`font-semibold ${m.winner === m.team1 ? "text-white flex items-center gap-1.5" : "text-[#A9B2C3]"}`}>
                    {m.winner === m.team1 && <Trophy className="w-3 h-3 text-[#F5B942]" />}
                    {m.team1}
                  </span>
                  {m.winner === m.team1 && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[rgba(245,185,66,0.12)] text-[#F5B942] border border-[rgba(245,185,66,0.25)] font-bold">
                      Winner {m.win_margin ? `(${m.win_margin} ${m.win_type})` : ""}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className={`font-semibold ${m.winner === m.team2 ? "text-white flex items-center gap-1.5" : "text-[#A9B2C3]"}`}>
                    {m.winner === m.team2 && <Trophy className="w-3 h-3 text-[#F5B942]" />}
                    {m.team2}
                  </span>
                  {m.winner === m.team2 && (
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[rgba(245,185,66,0.12)] text-[#F5B942] border border-[rgba(245,185,66,0.25)] font-bold">
                      Winner {m.win_margin ? `(${m.win_margin} ${m.win_type})` : ""}
                    </span>
                  )}
                </div>
              </div>

              {/* Match Details Footer */}
              <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] text-[10px] text-[#707B91] space-y-0.5">
                <div className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-[#707B91] flex-shrink-0" />
                  <span className="truncate">{m.venue}{m.city ? `, ${m.city}` : ""}</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span>
                    Toss: <strong className="text-[#A9B2C3]">{m.toss_winner}</strong> ({m.toss_decision})
                  </span>
                  {m.player_of_match && (
                    <span className="flex items-center gap-1 text-[#F5B942] font-semibold">
                      <Award className="w-3 h-3" />
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
