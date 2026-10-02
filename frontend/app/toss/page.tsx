"use client";

import React, { useEffect, useState } from "react";
import { 
  Compass, 
  HelpCircle, 
  TrendingUp, 
  MapPin, 
  ShieldCheck, 
  BarChart2, 
  CheckCircle, 
  Crosshair
} from "lucide-react";
import { api } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

export default function TossPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadToss() {
      try {
        setLoading(true);
        const res = await api.getToss();
        setData(res);
      } catch (err) {
        console.error("Failed to load toss analytics:", err);
      } finally {
        setLoading(false);
      }
    }
    loadToss();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-xs text-gray-400 font-mono">Analyzing 1,243 toss outcomes...</p>
      </div>
    );
  }

  const { overall_distribution, season_trends, venue_impact } = data;

  const chartSeasonData = (season_trends || []).map((s: any) => ({
    season: s.season.toString(),
    Field: s.field_first_decisions,
    Bat: s.bat_first_decisions,
    Advantage: s.toss_advantage_pct
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-2">
          <Compass className="w-3.5 h-3.5" />
          Strategic Toss Impact & Decision Bias
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          IPL Toss Decision & Match Correlation (2008–2026)
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Evaluating the &quot;Win Toss, Win Match&quot; hypothesis across 1,243 genuine fixtures, seasonal tactical shifts, and venue-specific pitch biases.
        </p>
      </div>

      {/* Decision Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(overall_distribution || []).map((d: any, idx: number) => {
          const isField = d.toss_decision.toLowerCase() === "field";
          return (
            <div
              key={idx}
              className={`rounded-xl border p-6 backdrop-blur-sm ${
                isField
                  ? "border-emerald-500/30 bg-emerald-950/10"
                  : "border-blue-500/30 bg-blue-950/10"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`text-xs font-mono font-bold uppercase px-2.5 py-1 rounded ${
                    isField
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  }`}
                >
                  Decision: {d.toss_decision} First
                </span>
                <span className="text-sm font-mono text-gray-400">
                  {d.decision_share_pct}% of All Tosses
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center my-4">
                <div className="bg-gray-900/60 p-3 rounded-lg border border-gray-800">
                  <p className="text-[11px] text-gray-400">Total Calls</p>
                  <p className="text-xl font-bold text-white font-mono mt-1">
                    {d.decision_count.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-900/60 p-3 rounded-lg border border-gray-800">
                  <p className="text-[11px] text-gray-400">Converted Wins</p>
                  <p className="text-xl font-bold text-emerald-400 font-mono mt-1">
                    {d.toss_and_match_wins.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gray-900/60 p-3 rounded-lg border border-gray-800">
                  <p className="text-[11px] text-gray-400">Success Rate</p>
                  <p className="text-xl font-bold text-white font-mono mt-1">
                    {d.decision_win_pct}%
                  </p>
                </div>
              </div>

              <p className="text-xs text-gray-400">
                {isField
                  ? "Captains heavily prefer fielding first due to dew, target clarity, and modern death-overs chasing power."
                  : "Batting first was popular in early editions (2008–2013) before analytics confirmed chasing dominance."}
              </p>
            </div>
          );
        })}
      </div>

      {/* Season-by-Season Toss Decision Evolution Chart */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Toss Decision Evolution Across 18 Seasons
            </h3>
            <p className="text-xs text-gray-400">Notice the dramatic shift towards fielding first from 2016 onwards</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartSeasonData}>
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
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Bar dataKey="Field" name="Chose Field First" fill="#10B981" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Bat" name="Chose Bat First" fill="#3B82F6" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Venue-Wise Toss Impact */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 overflow-hidden backdrop-blur-sm">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-400" />
            Stadium-Specific Toss Win Conversion Rates
          </h3>
          <span className="text-[11px] text-gray-400 font-mono">
            Major stadiums with ≥ 20 fixtures
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-800/50 text-gray-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Stadium</th>
                <th className="py-3 px-4 text-center">Matches</th>
                <th className="py-3 px-4 text-center">Toss Winner Won</th>
                <th className="py-3 px-4 text-center">Field & Won</th>
                <th className="py-3 px-4 text-center">Bat & Won</th>
                <th className="py-3 px-4 text-center">Toss Win Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {(venue_impact || []).filter((v: any) => v.venue_matches >= 20).map((v: any, idx: number) => {
                const highAdvantage = v.toss_win_pct >= 55.0;
                return (
                  <tr key={idx} className="hover:bg-gray-800/40">
                    <td className="py-3 px-4 font-semibold text-white">{v.venue}</td>
                    <td className="py-3 px-4 text-center font-mono">{v.venue_matches}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-cyan-400">
                      {v.toss_winner_wins}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-400">
                      {v.field_and_won}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-blue-400">
                      {v.bat_and_won}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          highAdvantage
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                            : "bg-gray-800 text-gray-300"
                        }`}
                      >
                        {v.toss_win_pct}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
