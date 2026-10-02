"use client";

import React, { useEffect, useState } from "react";
import { 
  Calendar, 
  TrendingUp, 
  Flame
} from "lucide-react";
import { api } from "@/lib/api";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar
} from "recharts";

export default function SeasonsPage() {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>("2026");
  const [seasonDetail, setSeasonDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSeasons() {
      try {
        setLoading(true);
        const res = await api.getSeasons();
        setTimeline(res.timeline || []);
        if (res.timeline && res.timeline.length > 0) {
          const latest = res.timeline[res.timeline.length - 1].season.toString();
          setSelectedSeason(latest);
          handleSelectSeason(latest);
        }
      } catch (err) {
        console.error("Failed to load seasons:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSeasons();
  }, []);

  const handleSelectSeason = async (seasonStr: string) => {
    try {
      setSelectedSeason(seasonStr);
      const detail = await api.getSeasonDetail(seasonStr);
      setSeasonDetail(detail);
    } catch (err) {
      console.error(`Failed to load season ${seasonStr} detail:`, err);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin"></div>
        <p className="text-xs text-[#A9B2C3] font-mono tracking-wider">Loading seasonal timeline data...</p>
      </div>
    );
  }

  const chartData = timeline.map((s: any) => ({
    season: s.season.toString(),
    rpo: s.run_rate,
    sixes: s.sixes,
    fours: s.fours,
    chase_pct: s.chasing_win_pct,
  }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-[#F5B942] uppercase mb-0.5">
          <span>HISTORICAL EVOLUTION</span>
          <span>·</span>
          <span>18 EDITIONS</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          IPL Scoring Evolution & Season Milestones (2008–2026)
        </h1>
        <p className="text-xs text-[#A9B2C3] mt-0.5 max-w-3xl leading-normal">
          Tracking the explosive rise in run-rates (8.31 to 9.88 RPO), sixes escalation (1,400+ per season), and chasing dominance across 19 editions.
        </p>
      </div>

      {/* Visual Charts: Run Rate & Sixes Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
        {/* Run Rate Progression */}
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-4 sm:p-5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#F5B942]" />
              Run-Rate Escalation (Runs Per Over)
            </h3>
            <span className="text-[10px] font-mono text-[#F5B942] bg-[rgba(245,185,66,0.1)] px-1.5 py-0.5 rounded border border-[rgba(245,185,66,0.2)]">
              8.31 ➔ 9.88 RPO
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRpo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2476E8" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2476E8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="season" stroke="#6F7A90" fontSize={10} tickLine={false} />
                <YAxis stroke="#6F7A90" fontSize={10} domain={[7.5, 10.5]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0D1424",
                    borderColor: "rgba(255,255,255,0.12)",
                    borderRadius: "6px",
                    color: "#F4F6FA",
                    fontSize: "11px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rpo"
                  name="Run Rate (RPO)"
                  stroke="#2476E8"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRpo)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Boundary Escalation (Sixes Count) */}
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-4 sm:p-5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#F5B942]" />
              Total Sixes Hit Per Season
            </h3>
            <span className="text-[10px] font-mono text-[#F5B942] bg-[rgba(245,185,66,0.1)] px-1.5 py-0.5 rounded border border-[rgba(245,185,66,0.2)]">
              Surpassed 1,400+ Maximums
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="season" stroke="#6F7A90" fontSize={10} tickLine={false} />
                <YAxis stroke="#6F7A90" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0D1424",
                    borderColor: "rgba(255,255,255,0.12)",
                    borderRadius: "6px",
                    color: "#F4F6FA",
                    fontSize: "11px",
                  }}
                />
                <Bar dataKey="sixes" name="Sixes Hit" fill="#F5B942" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Horizontal Season Timeline Selector (Section 49) */}
      <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-3 sm:p-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#F5B942]" />
            Tournament Timeline Selector
          </span>
          <span className="text-[10px] text-[#707B91] font-mono">18 Editions Evaluated</span>
        </div>

        {/* Clean Timeline Strip */}
        <div className="flex overflow-x-auto pb-1 space-x-1 scrollbar-none">
          {timeline.map((s: any) => {
            const isSelected = selectedSeason === s.season.toString();
            return (
              <button
                key={s.season}
                onClick={() => handleSelectSeason(s.season.toString())}
                className={`flex-shrink-0 px-2.5 py-1 text-xs font-mono font-bold transition-colors rounded-btn ${
                  isSelected
                    ? "bg-[#165DCC] text-white border-b-2 border-[#F5B942]"
                    : "bg-[#070B16] text-[#8F9AAF] hover:text-white hover:bg-[#111A2E]"
                }`}
              >
                {s.season}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Season Deep Dive */}
      {seasonDetail && (
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-4 sm:p-5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <div>
              <span className="text-[10px] font-mono text-[#F5B942] uppercase font-bold tracking-wider block mb-0.5">
                EDITION PROFILE
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-1.5">
                IPL {selectedSeason} Season Summary
              </h2>
              <p className="text-[11px] text-[#707B91] mt-0.5">
                {seasonDetail.summary?.season_matches} official matches played across the campaign
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="bg-[#070B16] text-[#F5B942] border border-[rgba(255,255,255,0.08)] px-2.5 py-0.5 rounded-btn font-bold text-[11px]">
                Run Rate: {seasonDetail.summary?.run_rate} RPO
              </span>
              <span className="bg-[#070B16] text-white border border-[rgba(255,255,255,0.08)] px-2.5 py-0.5 rounded-btn font-bold text-[11px]">
                Chasing Win: {seasonDetail.summary?.chasing_win_pct}%
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="bg-[#070B16] p-2.5 sm:p-3 rounded-btn border border-[rgba(255,255,255,0.06)]">
              <p className="text-[9px] text-[#707B91] uppercase">Total Runs</p>
              <p className="text-base font-bold text-white font-mono mt-0.5">
                {seasonDetail.summary?.total_runs?.toLocaleString()}
              </p>
            </div>
            <div className="bg-[#070B16] p-2.5 sm:p-3 rounded-btn border border-[rgba(255,255,255,0.06)]">
              <p className="text-[9px] text-[#707B91] uppercase">Boundaries</p>
              <p className="text-base font-bold text-[#F5B942] font-mono mt-0.5">
                {seasonDetail.summary?.fours} (4s) / {seasonDetail.summary?.sixes} (6s)
              </p>
            </div>
            <div className="bg-[#070B16] p-2.5 sm:p-3 rounded-btn border border-[rgba(255,255,255,0.06)]">
              <p className="text-[9px] text-[#707B91] uppercase">Total Wickets</p>
              <p className="text-base font-bold text-white font-mono mt-0.5">
                {seasonDetail.summary?.total_wickets}
              </p>
            </div>
            <div className="bg-[#070B16] p-2.5 sm:p-3 rounded-btn border border-[rgba(255,255,255,0.06)]">
              <p className="text-[9px] text-[#707B91] uppercase">Boundary Run %</p>
              <p className="text-base font-bold text-[#2476E8] font-mono mt-0.5">
                {seasonDetail.summary?.boundary_run_pct}%
              </p>
            </div>
          </div>

          {/* Sample Fixtures Table */}
          <div>
            <h4 className="text-[11px] font-bold text-[#707B91] uppercase tracking-wider mb-2 font-mono">
              Sample Fixtures from {selectedSeason}
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#090E1B] text-[#707B91] font-mono uppercase text-[10px] tracking-wider border-b border-[rgba(255,255,255,0.06)]">
                  <tr>
                    <th className="py-2 px-3">Date</th>
                    <th className="py-2 px-3">Fixture</th>
                    <th className="py-2 px-3">Venue</th>
                    <th className="py-2 px-3">Winner</th>
                    <th className="py-2 px-3 text-right">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-[#F4F6FA]">
                  {(seasonDetail.sample_matches || []).map((m: any, idx: number) => (
                    <tr key={idx} className="hover:bg-[rgba(22,93,204,0.08)] transition-colors">
                      <td className="py-1.5 px-3 font-mono text-[#707B91]">{m.date || "—"}</td>
                      <td className="py-1.5 px-3 font-bold text-white">
                        {m.team1} vs {m.team2}
                      </td>
                      <td className="py-1.5 px-3 text-[#A9B2C3] truncate max-w-xs">{m.venue}</td>
                      <td className="py-1.5 px-3 font-semibold text-[#F5B942]">{m.winner || "No Result"}</td>
                      <td className="py-1.5 px-3 text-right font-mono text-[#707B91]">
                        {m.win_margin ? `${m.win_margin} ${m.win_type}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
