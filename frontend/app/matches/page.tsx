"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  Filter, 
  Trophy, 
  MapPin, 
  ChevronLeft, 
  ChevronRight,
  Award,
  Download,
  Calendar,
  Layers
} from "lucide-react";
import Papa from "papaparse";
import { api } from "@/lib/api";
import {
  ChartCard,
  ThemedBarChart,
  CHART_COLORS
} from "@/components/charts";
import ErrorBanner from "@/components/ErrorBanner";

export default function MatchesPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(20);
  const [season, setSeason] = useState("");
  const [team, setTeam] = useState("");
  const [venue, setVenue] = useState("");
  const [stage, setStage] = useState("");
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [seasonsData, setSeasonsData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getSeasons()
      .then((res) => setSeasonsData(res.timeline || []))
      .catch((err) => console.error("Failed to load season matches:", err));
  }, []);

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
          stage: stage || undefined,
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
  }, [page, season, team, venue, stage, limit]);

  const handleFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleClearFilters = () => {
    setSeason("");
    setTeam("");
    setVenue("");
    setStage("");
    setPage(1);
  };

  // CSV Export using PapaParse
  const handleExportCSV = async () => {
    try {
      setExporting(true);
      // Fetch all matches matching current filters up to 2000 records
      const exportRes = await api.getMatches({
        page: 1,
        limit: 1500,
        season: season || undefined,
        team: team || undefined,
        venue: venue || undefined,
        stage: stage || undefined,
      });

      const exportData = (exportRes.matches || []).map((m: any) => ({
        match_id: m.match_id,
        season: m.season,
        date: m.date,
        match_number: m.match_number || "",
        match_stage: m.match_stage || "League",
        team1: m.team1,
        team2: m.team2,
        toss_winner: m.toss_winner,
        toss_decision: m.toss_decision,
        winner: m.winner,
        win_type: m.win_type,
        win_margin: m.win_margin,
        venue: m.venue,
        city: m.city,
        player_of_match: m.player_of_match
      }));

      const csv = Papa.unparse(exportData);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `ipl_matches_${stage || 'all'}_${season || '2008-2026'}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Export CSV failed:", err);
    } finally {
      setExporting(false);
    }
  };

  const startRecord = total > 0 ? (page - 1) * limit + 1 : 0;
  const endRecord = Math.min(page * limit, total);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-5">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-[#F5B942] uppercase mb-0.5">
            <span>OFFICIAL FIXTURE LEDGER</span>
            <span>·</span>
            <span>2008–2026 CORPUS</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            IPL Historical Match Archives & Scorecards
          </h1>
          <p className="text-xs text-[#A9B2C3] mt-0.5 max-w-3xl leading-normal">
            Every match across 18 seasons (1,243 official fixtures). Programmatically query by tournament stage, season, franchise, or venue.
          </p>
        </div>

        {/* CSV Export Action Button */}
        <button
          onClick={handleExportCSV}
          disabled={exporting || loading || matches.length === 0}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-btn bg-[#0D1830] border border-[rgba(245,185,66,0.35)] text-[#F5B942] text-xs font-mono font-semibold hover:bg-[rgba(245,185,66,0.1)] transition-colors disabled:opacity-40 self-start md:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{exporting ? "Generating CSV..." : "Export to CSV"}</span>
        </button>
      </div>

      {error && <ErrorBanner message={error} onRetry={() => setPage(1)} />}

      {/* Visual Analytics: Matches Hosted per Season Bar Chart */}
      {seasonsData.length > 0 && (
        <ChartCard
          eyebrow="CHRONOLOGY"
          title="Matches Hosted per Tournament Edition (2008–2026)"
          subtitle="Fixtures breakdown per season (1,243 official matches)"
          icon={Calendar}
          heightClass="h-48 sm:h-56"
        >
          <ThemedBarChart
            data={seasonsData.map((s: any) => ({
              season: s.season.toString(),
              matches: s.season_matches,
            }))}
            xKey="season"
            yKey="matches"
            barName="Matches"
            unit="Matches"
            yDomain={[50, 80]}
            color={CHART_COLORS.blueVibrant}
          />
        </ChartCard>
      )}

      {/* Filter Form */}
      <form
        onSubmit={handleFilterSubmit}
        className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-3.5 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 text-xs"
      >
        {/* Stage Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-[#707B91] mb-1 font-bold">
            Tournament Stage
          </label>
          <select
            value={stage}
            onChange={(e) => {
              setStage(e.target.value);
              setPage(1);
            }}
            className="w-full bg-[#070B16] border border-[rgba(255,255,255,0.08)] rounded-btn px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#2476E8]"
          >
            <option value="">All Stages (1,243)</option>
            <option value="playoffs">Playoffs (All Knockouts - 74)</option>
            <option value="Final">Final (19)</option>
            <option value="Qualifier 1">Qualifier 1 (16)</option>
            <option value="Eliminator">Eliminator (16)</option>
            <option value="Qualifier 2">Qualifier 2 (16)</option>
            <option value="Semi Final">Semi Final (6)</option>
            <option value="3rd Place Play-Off">3rd Place Play-Off (1)</option>
            <option value="League">League Stage (1,169)</option>
          </select>
        </div>

        {/* Season Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-[#707B91] mb-1 font-bold">
            Season Year
          </label>
          <input
            type="text"
            placeholder="e.g. 2026, 2024, 2008"
            value={season}
            onChange={(e) => setSeason(e.target.value)}
            className="w-full bg-[#070B16] border border-[rgba(255,255,255,0.08)] rounded-btn px-2.5 py-1.5 text-xs text-white placeholder-[#707B91] focus:outline-none focus:border-[#2476E8]"
          />
        </div>

        {/* Team Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-[#707B91] mb-1 font-bold">
            Franchise / Team
          </label>
          <input
            type="text"
            placeholder="e.g. Mumbai, Chennai, KKR"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            className="w-full bg-[#070B16] border border-[rgba(255,255,255,0.08)] rounded-btn px-2.5 py-1.5 text-xs text-white placeholder-[#707B91] focus:outline-none focus:border-[#2476E8]"
          />
        </div>

        {/* Venue Filter */}
        <div>
          <label className="block text-[10px] font-mono uppercase text-[#707B91] mb-1 font-bold">
            Stadium / Ground
          </label>
          <input
            type="text"
            placeholder="e.g. Wankhede, Eden"
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            className="w-full bg-[#070B16] border border-[rgba(255,255,255,0.08)] rounded-btn px-2.5 py-1.5 text-xs text-white placeholder-[#707B91] focus:outline-none focus:border-[#2476E8]"
          />
        </div>

        {/* Action Buttons */}
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
            className="h-[32px] px-3 bg-[#111A2E] hover:bg-[#18233C] text-[#A9B2C3] rounded-btn transition-colors text-xs font-mono"
          >
            Reset
          </button>
        </div>
      </form>

      {/* Results Count, Page Size Selector & Pagination Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <span className="font-mono text-[#A9B2C3] text-[11px]">
            Showing <strong className="text-white">{startRecord}–{endRecord}</strong> of{" "}
            <strong className="text-[#F5B942]">{total.toLocaleString()}</strong> official fixtures
          </span>

          {/* Page Size Selector */}
          <div className="flex items-center space-x-1.5 text-[11px] font-mono text-[#707B91]">
            <span>Rows:</span>
            {[20, 50, 100].map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => {
                  setLimit(size);
                  setPage(1);
                }}
                className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                  limit === size
                    ? "bg-[#165DCC] text-white"
                    : "bg-[#0A101D] text-[#8F9AAF] hover:text-white border border-[rgba(255,255,255,0.06)]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Page Nav */}
        <div className="flex items-center space-x-1 self-end sm:self-auto">
          <button
            disabled={page <= 1 || loading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="p-1.5 rounded-btn bg-[#0D1424] border border-[rgba(255,255,255,0.08)] text-[#A9B2C3] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="font-mono text-[#A9B2C3] px-2 text-[11px]">
            Page <strong className="text-white">{page}</strong> / {totalPages}
          </span>
          <button
            disabled={page >= totalPages || loading}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="p-1.5 rounded-btn bg-[#0D1424] border border-[rgba(255,255,255,0.08)] text-[#A9B2C3] disabled:opacity-30 disabled:cursor-not-allowed hover:text-white"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Matches Grid */}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {matches.map((m: any) => {
            const isFinal = m.match_stage === "Final";
            const isQ = m.match_stage?.includes("Qualifier");
            const isElim = m.match_stage === "Eliminator";
            const isPlayoff = m.match_stage && m.match_stage !== "League";

            return (
              <div
                key={m.match_id}
                className={`rounded-card border p-3.5 shadow-sm transition-all hover:border-[rgba(36,118,232,0.4)] ${
                  isFinal 
                    ? "bg-[#0E1528] border-[rgba(245,185,66,0.35)]" 
                    : isPlayoff 
                    ? "bg-[#0D1424] border-[rgba(36,118,232,0.25)]" 
                    : "bg-[#0D1424] border-[rgba(255,255,255,0.08)]"
                }`}
              >
                {/* Header: Season, Match # / Stage, Date */}
                <div className="flex items-center justify-between text-xs text-[#707B91] border-b border-[rgba(255,255,255,0.06)] pb-2 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#F5B942] text-[11px]">Season {m.season}</span>
                    <span>•</span>
                    <span className="text-[11px]">{m.date || "Date Unspecified"}</span>
                  </div>

                  {/* Stage Badge */}
                  <div className="flex items-center space-x-1.5">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                      isFinal
                        ? "bg-[rgba(245,185,66,0.15)] text-[#F5B942] border-[rgba(245,185,66,0.4)]"
                        : isQ
                        ? "bg-[rgba(36,118,232,0.15)] text-[#2476E8] border-[rgba(36,118,232,0.4)]"
                        : isElim
                        ? "bg-[rgba(247,127,0,0.15)] text-[#F77F00] border-[rgba(247,127,0,0.4)]"
                        : "bg-[#070B16] text-[#8F9AAF] border-[rgba(255,255,255,0.06)]"
                    }`}>
                      {m.match_stage || "League"}
                      {m.match_number ? ` #${m.match_number}` : ""}
                    </span>
                    <span className="font-mono text-[10px] text-[#707B91]">ID:{m.match_id}</span>
                  </div>
                </div>

                {/* Scorecard Teams Hierarchy */}
                <div className="space-y-1.5 my-2">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className={`font-semibold ${m.winner === m.team1 ? "text-white flex items-center gap-1.5" : "text-[#A9B2C3]"}`}>
                      {m.winner === m.team1 && <Trophy className="w-3.5 h-3.5 text-[#F5B942]" />}
                      {m.team1}
                    </span>
                    {m.winner === m.team1 && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[rgba(245,185,66,0.12)] text-[#F5B942] border border-[rgba(245,185,66,0.25)] font-bold">
                        Winner {m.win_margin ? `(${m.win_margin} ${m.win_type || 'runs'})` : ""}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <span className={`font-semibold ${m.winner === m.team2 ? "text-white flex items-center gap-1.5" : "text-[#A9B2C3]"}`}>
                      {m.winner === m.team2 && <Trophy className="w-3.5 h-3.5 text-[#F5B942]" />}
                      {m.team2}
                    </span>
                    {m.winner === m.team2 && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[rgba(245,185,66,0.12)] text-[#F5B942] border border-[rgba(245,185,66,0.25)] font-bold">
                        Winner {m.win_margin ? `(${m.win_margin} ${m.win_type || 'runs'})` : ""}
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
            );
          })}
        </div>
      )}
    </div>
  );
}
