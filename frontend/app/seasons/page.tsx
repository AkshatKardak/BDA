"use client";

import React, { useEffect, useState } from "react";
import { 
  Calendar, 
  TrendingUp, 
  Flame, 
  Target, 
  Award, 
  ChevronRight,
  Zap,
  Activity
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
  Legend,
  BarChart,
  Bar
} from "recharts";

export default function SeasonsPage() {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>("2026");
  const [seasonDetail, setSeasonDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

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
      setDetailLoading(true);
      setSelectedSeason(seasonStr);
      const detail = await api.getSeasonDetail(seasonStr);
      setSeasonDetail(detail);
    } catch (err) {
      console.error(`Failed to load season ${seasonStr} detail:`, err);
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-xs text-gray-400 font-mono">Loading seasonal evolution data...</p>
      </div>
    );
  }

  const chartData = timeline.map((s: any) => ({
    season: s.season.toString(),
    rpo: s.run_rate,
    sixes: s.sixes,
    fours: s.fours,
    chase_pct: s.chasing_win_pct
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-medium mb-2">
          <Calendar className="w-3.5 h-3.5" />
          Multi-Year Evolutionary Analytics
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          IPL Season-by-Season Evolution (2008–2026)
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Tracking the explosive rise in run-rates, sixes escalation, and chasing dynamics across 18 editions.
        </p>
      </div>

      {/* Visual Charts: Run Rate & Sixes Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Run Rate Progression */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Run-Rate Escalation (Runs Per Over)
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              8.31 (2008) → 9.88 (2026)
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRpo" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="season" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} domain={[7.5, 10.5]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    borderColor: "#374151",
                    borderRadius: "8px",
                    color: "#F3F4F6",
                    fontSize: "12px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="rpo"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorRpo)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Boundary Escalation (Sixes Count) */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              Total Sixes Hit Per Season
            </h3>
            <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              Surpassed 1,400+ Sixes
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="season" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    borderColor: "#374151",
                    borderRadius: "8px",
                    color: "#F3F4F6",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="sixes" name="Sixes" fill="#F59E0B" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Season Explorer Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-400" />
            Select Season Edition:
          </h3>
          <span className="text-xs text-gray-400 font-mono">18 Editions Evaluated</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {timeline.map((s: any) => {
            const isSelected = selectedSeason === s.season.toString();
            return (
              <button
                key={s.season}
                onClick={() => handleSelectSeason(s.season.toString())}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  isSelected
                    ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 scale-105"
                    : "bg-gray-900 border border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800"
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
        <div className="space-y-6">
          <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-800">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  IPL {selectedSeason} Edition Summary
                </h3>
                <p className="text-xs text-gray-400">
                  {seasonDetail.summary?.season_matches} matches played across the campaign
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded">
                  Run Rate: {seasonDetail.summary?.run_rate} RPO
                </span>
                <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded">
                  Chasing Win: {seasonDetail.summary?.chasing_win_pct}%
                </span>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-950/60 p-3 rounded-lg border border-gray-800">
                <p className="text-[10px] text-gray-400 uppercase">Total Runs</p>
                <p className="text-lg font-bold text-white font-mono mt-1">
                  {seasonDetail.summary?.total_runs?.toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-950/60 p-3 rounded-lg border border-gray-800">
                <p className="text-[10px] text-gray-400 uppercase">Boundaries</p>
                <p className="text-lg font-bold text-amber-400 font-mono mt-1">
                  {seasonDetail.summary?.fours} (4s) / {seasonDetail.summary?.sixes} (6s)
                </p>
              </div>
              <div className="bg-gray-950/60 p-3 rounded-lg border border-gray-800">
                <p className="text-[10px] text-gray-400 uppercase">Total Wickets</p>
                <p className="text-lg font-bold text-purple-400 font-mono mt-1">
                  {seasonDetail.summary?.total_wickets}
                </p>
              </div>
              <div className="bg-gray-950/60 p-3 rounded-lg border border-gray-800">
                <p className="text-[10px] text-gray-400 uppercase">Boundary Runs %</p>
                <p className="text-lg font-bold text-emerald-400 font-mono mt-1">
                  {seasonDetail.summary?.boundary_run_pct}%
                </p>
              </div>
            </div>

            {/* Sample Fixtures from this Season */}
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider mb-3">
              Sample Fixtures from {selectedSeason}
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-800/50 text-gray-400 font-mono uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Fixture</th>
                    <th className="py-2.5 px-3">Venue</th>
                    <th className="py-2.5 px-3">Winner</th>
                    <th className="py-2.5 px-3 text-right">Margin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800 text-gray-300">
                  {(seasonDetail.sample_matches || []).map((m: any, idx: number) => (
                    <tr key={idx} className="hover:bg-gray-800/40">
                      <td className="py-2.5 px-3 font-mono text-gray-400">{m.date || "—"}</td>
                      <td className="py-2.5 px-3 font-bold text-white">
                        {m.team1} vs {m.team2}
                      </td>
                      <td className="py-2.5 px-3 text-gray-400 truncate max-w-xs">{m.venue}</td>
                      <td className="py-2.5 px-3 font-semibold text-emerald-400">{m.winner || "No Result"}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-gray-400">
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
