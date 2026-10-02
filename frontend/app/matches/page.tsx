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
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-widest text-[#F5B942] uppercase mb-1">
          <span>MATCH ARCHIVE</span>
          <span>·</span>
          <span>1,243 FIXTURES</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          IPL Historical Match Archives & Scorecards
        </h1>
        <p className="text-xs text-[#A9B2C3] mt-1 max-w-3xl leading-relaxed">
          Official scorecard records covering 19 editions. Search by franchise, tournament season, venue, or toss results.
        </p>
      </div>

      {/* Filter Form */}
      <form
        onSubmit={handleFilterSubmit}
        className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-4 shadow-[0_8px_30px_rgba(0,0,0,0.16)] grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs"
      >
        <div>
          <label className="block text-[10px] font-mono uppercase text-[#707B91] mb-1 font-bold">Season</label>
          <input
            type="text"
            placeholder="e.g. 2026 or 2024"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full bg-[#070B16] border border-[rgba(255,255,255,0.08)] rounded-btn px-3 py-2 text-white placeholder-[#707B91] focus:outline-none focus:border-[#2476E8]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase text-[#707B91] mb-1 font-bold">Franchise / Team</label>
          <input
            type="text"
            placeholder="e.g. Mumbai or Chennai"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="w-full bg-[#070B16] border border-[rgba(255,255,255,0.08)] rounded-btn px-3 py-2 text-white placeholder-[#707B91] focus:outline-none focus:border-[#2476E8]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-mono uppercase text-[#707B91] mb-1 font-bold">Stadium / Ground</label>
          <input
            type="text"
            placeholder="e.g. Wankhede or Eden"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="w-full bg-[#070B16] border border-[rgba(255,255,255,0.08)] rounded-btn px-3 py-2 text-white placeholder-[#707B91] focus:outline-none focus:border-[#2476E8]"
          />
        </div>

        <div className="flex items-end space-x-2">
          <button
            type="submit"
            className="flex-1 h-[38px] bg-[#165DCC] hover:bg-[#2476E8] text-white font-semibold rounded-btn transition-colors flex items-center justify-center gap-1.5"
          >
            <Filter className="w-3.5 h-3.5" /> Apply
          </button>
          <button
            type="button"
            onClick={handleClearFilters}
            className="h-[38px] px-4 bg-[#111A2E] hover:bg-[#18233C] text-[#A9B2C3] rounded-btn transition-colors"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Results Count & Pagination Controls */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-[#A9B2C3]">
          Showing <strong className="text-white">{matches.length}</strong> of{" "}
          <strong className="text-[#F5B942]">{total.toLocaleString()}</strong> official fixtures
        </span>

        <div className="flex items-center space-x-1.5">
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-btn bg-[#0D1424] border border-[rgba(255,255,255,0.08)] text-[#A9B2C3] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-[#A9B2C3] px-2 text-[11px]">
            Page {page} / {totalPages}
          </span>
          <button
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-btn bg-[#0D1424] border border-[rgba(255,255,255,0.08)] text-[#A9B2C3] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Matches Grid - Scorecard Hierarchy (Section 50) */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-4">
          <div className="w-10 h-10 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin"></div>
          <p className="text-xs text-[#A9B2C3] font-mono tracking-wider">Querying match ledger...</p>
        </div>
      ) : matches.length === 0 ? (
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-12 text-center text-[#707B91]">
          <p className="text-sm font-semibold">No matches found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {matches.map((m: any) => (
            <div
              key={m.match_id}
              className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-4 sm:p-5 shadow-[0_8px_30px_rgba(0,0,0,0.16)] transition-all hover:border-[rgba(36,118,232,0.3)]"
            >
              {/* Header: Season & Date */}
              <div className="flex items-center justify-between text-xs text-[#707B91] border-b border-[rgba(255,255,255,0.06)] pb-2.5 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#F5B942]">Season {m.season}</span>
                  <span>•</span>
                  <span>{m.date || "Date Unspecified"}</span>
                </div>
                <span className="font-mono text-[11px] text-[#707B91]">#{m.match_id}</span>
              </div>

              {/* Scorecard Teams Hierarchy */}
              <div className="space-y-2 my-3">
                <div className="flex items-center justify-between text-sm">
                  <span className={`font-bold ${m.winner === m.team1 ? "text-white flex items-center gap-1.5" : "text-[#A9B2C3]"}`}>
                    {m.winner === m.team1 && <Trophy className="w-3.5 h-3.5 text-[#F5B942]" />}
                    {m.team1}
                  </span>
                  {m.winner === m.team1 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(245,185,66,0.12)] text-[#F5B942] border border-[rgba(245,185,66,0.25)] font-bold">
                      Winner {m.win_margin ? `(${m.win_margin} ${m.win_type})` : ""}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className={`font-bold ${m.winner === m.team2 ? "text-white flex items-center gap-1.5" : "text-[#A9B2C3]"}`}>
                    {m.winner === m.team2 && <Trophy className="w-3.5 h-3.5 text-[#F5B942]" />}
                    {m.team2}
                  </span>
                  {m.winner === m.team2 && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(245,185,66,0.12)] text-[#F5B942] border border-[rgba(245,185,66,0.25)] font-bold">
                      Winner {m.win_margin ? `(${m.win_margin} ${m.win_type})` : ""}
                    </span>
                  )}
                </div>
              </div>

              {/* Match Details Footer */}
              <div className="pt-3 border-t border-[rgba(255,255,255,0.06)] text-[11px] text-[#707B91] space-y-1">
                <div className="flex items-center gap-1 truncate">
                  <MapPin className="w-3 h-3 text-[#707B91] flex-shrink-0" />
                  <span className="truncate">{m.venue}{m.city ? `, ${m.city}` : ""}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
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
