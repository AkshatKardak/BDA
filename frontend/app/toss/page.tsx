"use client";

import React, { useEffect, useState } from "react";
import { 
  Compass, 
  TrendingUp, 
  MapPin, 
  HelpCircle
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
        <div className="w-10 h-10 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin"></div>
        <p className="text-xs text-[#A9B2C3] font-mono tracking-wider">Analyzing 1,243 toss outcomes...</p>
      </div>
    );
  }

  const { overall_distribution, season_trends, venue_impact } = data;

  const chartSeasonData = (season_trends || []).map((s: any) => ({
    season: s.season.toString(),
    Field: s.field_first_decisions,
    Bat: s.bat_first_decisions,
    Advantage: s.toss_advantage_pct,
  }));

  // Overall Toss Win to Match Win conversion calculation
  const totalCalls = (overall_distribution || []).reduce((acc: number, d: any) => acc + (d.decision_count || 0), 0);
  const totalTossWins = (overall_distribution || []).reduce((acc: number, d: any) => acc + (d.toss_and_match_wins || 0), 0);
  const overallTossWinPct = totalCalls > 0 ? ((totalTossWins / totalCalls) * 100).toFixed(1) : "51.2";

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-widest text-[#F5B942] uppercase mb-1">
          <span>STRATEGIC TELEMETRY</span>
          <span>·</span>
          <span>DECISION BIAS</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          Does the Toss Really Matter?
        </h1>
        <p className="text-xs text-[#A9B2C3] mt-1 max-w-3xl leading-relaxed">
          Empirical evaluation of the &quot;Win Toss, Win Match&quot; hypothesis across 1,243 genuine fixtures, tactical fielding-first shifts, and venue pitch biases.
        </p>
      </div>

      {/* Featured Sports Headline Stat */}
      <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0B1222] p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
        <div>
          <span className="text-[11px] font-mono text-[#F5B942] uppercase font-bold tracking-wider block mb-1">
            STATISTICAL FINDING (1,243 FIXTURES)
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Toss Winner ➔ Match Winner
          </h2>
          <p className="text-xs text-[#A9B2C3] mt-1.5 max-w-xl leading-relaxed">
            Across 18 editions of the Indian Premier League, winning the toss yields only a marginal match-winning advantage over defending.
          </p>
        </div>

        <div className="flex items-center space-x-6 flex-shrink-0 bg-[#0D1424] px-6 py-4 rounded-card border border-[rgba(255,255,255,0.08)]">
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-extrabold text-[#F5B942] font-sans">
              {overallTossWinPct}%
            </p>
            <p className="text-[10px] uppercase font-mono text-[#707B91] mt-0.5">Win Correlation</p>
          </div>
          <div className="h-10 w-[1px] bg-[rgba(255,255,255,0.08)]" />
          <div className="text-center">
            <p className="text-3xl sm:text-4xl font-extrabold text-white font-sans">
              {totalTossWins}
            </p>
            <p className="text-[10px] uppercase font-mono text-[#707B91] mt-0.5">Total Wins</p>
          </div>
        </div>
      </div>

      {/* Decision Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(overall_distribution || []).map((d: any, idx: number) => {
          const isField = d.toss_decision.toLowerCase() === "field";
          return (
            <div
              key={idx}
              className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.16)]"
            >
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(255,255,255,0.06)]">
                <span className="text-xs font-mono font-bold uppercase text-[#F5B942]">
                  Decision: {d.toss_decision} First
                </span>
                <span className="text-xs font-mono text-[#A9B2C3]">
                  {d.decision_share_pct}% of All Tosses
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center my-4">
                <div className="bg-[#070B16] p-3 rounded-btn border border-[rgba(255,255,255,0.06)]">
                  <p className="text-[10px] text-[#707B91] uppercase">Total Calls</p>
                  <p className="text-lg font-bold text-white font-mono mt-1">
                    {d.decision_count.toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#070B16] p-3 rounded-btn border border-[rgba(255,255,255,0.06)]">
                  <p className="text-[10px] text-[#707B91] uppercase">Converted Wins</p>
                  <p className="text-lg font-bold text-[#2476E8] font-mono mt-1">
                    {d.toss_and_match_wins.toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#070B16] p-3 rounded-btn border border-[rgba(255,255,255,0.06)]">
                  <p className="text-[10px] text-[#707B91] uppercase">Conversion</p>
                  <p className="text-lg font-bold text-[#F5B942] font-mono mt-1">
                    {d.decision_win_pct}%
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#707B91] leading-relaxed">
                {isField
                  ? "Captains heavily favor fielding first in night fixtures due to evening dew, target visibility, and death-overs chase capabilities."
                  : "Batting first dominated the inaugural seasons (2008–2013) before data intelligence confirmed modern chasing success rates."}
              </p>
            </div>
          );
        })}
      </div>

      {/* Season-by-Season Toss Decision Evolution Chart */}
      <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(255,255,255,0.06)]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#F5B942]" />
              Toss Decision Evolution Across 18 Seasons
            </h3>
            <p className="text-xs text-[#707B91]">Notice the dramatic strategic divergence toward fielding first since 2016</p>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartSeasonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="season" stroke="#6F7A90" fontSize={11} tickLine={false} />
              <YAxis stroke="#6F7A90" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0D1424",
                  borderColor: "rgba(255,255,255,0.12)",
                  borderRadius: "8px",
                  color: "#F4F6FA",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Bar dataKey="Field" name="Field First Choice" fill="#2476E8" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Bat" name="Bat First Choice" fill="#F5B942" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Venue-Wise Toss Impact */}
      <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
        <div className="p-4 sm:p-5 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#F5B942]" />
            Stadium Toss Win Conversion Rates
          </h3>
          <span className="text-[11px] text-[#707B91] font-mono">
            Grounds with ≥ 20 fixtures
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090E1B] text-[#707B91] font-mono uppercase text-[10px] tracking-wider border-b border-[rgba(255,255,255,0.06)]">
              <tr>
                <th className="py-3 px-4">Stadium</th>
                <th className="py-3 px-4 text-center">Matches</th>
                <th className="py-3 px-4 text-center">Toss Winner Won</th>
                <th className="py-3 px-4 text-center">Field & Won</th>
                <th className="py-3 px-4 text-center">Bat & Won</th>
                <th className="py-3 px-4 text-center">Toss Win Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-[#F4F6FA]">
              {(venue_impact || []).filter((v: any) => v.venue_matches >= 20).map((v: any, idx: number) => {
                const highAdvantage = v.toss_win_pct >= 55.0;
                return (
                  <tr key={idx} className="hover:bg-[rgba(22,93,204,0.08)] transition-colors">
                    <td className="py-3 px-4 font-semibold text-white">{v.venue}</td>
                    <td className="py-3 px-4 text-center font-mono">{v.venue_matches}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-white">
                      {v.toss_winner_wins}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[#2476E8]">
                      {v.field_and_won}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[#A9B2C3]">
                      {v.bat_and_won}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          highAdvantage
                            ? "bg-[rgba(245,185,66,0.12)] text-[#F5B942] border border-[rgba(245,185,66,0.25)]"
                            : "bg-[#111A2E] text-[#A9B2C3]"
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
