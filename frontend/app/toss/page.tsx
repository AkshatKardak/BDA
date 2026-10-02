"use client";

import React, { useEffect, useState } from "react";
import { 
  Compass, 
  TrendingUp, 
  MapPin, 
  PieChart as PieIcon,
  BarChart2,
  Trophy,
  ShieldCheck
} from "lucide-react";
import { api } from "@/lib/api";
import {
  ChartCard,
  ThemedPieChart,
  ThemedBarChart,
  ThemedMultiLineChart,
  ThemedGroupedBarChart,
  CHART_COLORS
} from "@/components/charts";
import ErrorBanner from "@/components/ErrorBanner";

export default function TossPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadToss = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getToss();
      setData(res);
    } catch (err: any) {
      console.error("Failed to load toss analytics:", err);
      setError("Unable to connect to FastAPI backend to retrieve toss impact telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadToss();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin"></div>
        <p className="text-xs text-[#A9B2C3] font-mono tracking-wider">Analyzing 1,243 toss outcomes & decision distributions...</p>
      </div>
    );
  }

  const overall_distribution = data?.overall_distribution || [];
  const season_trends = data?.season_trends || [];
  const venue_impact = data?.venue_impact || [];

  // 1. Toss Decision Distribution (Pie / Donut Chart)
  const tossFieldItem = overall_distribution.find((d: any) => d.toss_decision.toLowerCase() === "field");
  const tossBatItem = overall_distribution.find((d: any) => d.toss_decision.toLowerCase() === "bat");
  const fieldCalls = tossFieldItem?.decision_count || 820;
  const batCalls = tossBatItem?.decision_count || 414;
  const totalCalls = fieldCalls + batCalls;

  const tossPieData = [
    {
      name: "Field First",
      value: fieldCalls,
      pct: ((fieldCalls / totalCalls) * 100).toFixed(1),
      color: CHART_COLORS.blueVibrant,
    },
    {
      name: "Bat First",
      value: batCalls,
      pct: ((batCalls / totalCalls) * 100).toFixed(1),
      color: CHART_COLORS.goldPrimary,
    },
  ];

  // 2. Toss Winner Won Match % by Season (Bar Chart)
  const seasonTossWinRateData = season_trends.map((s: any) => ({
    season: s.season.toString(),
    toss_win_pct: s.toss_advantage_pct,
    matches: s.season_matches,
  }));

  // 3. Tactical Evolution (Field First % vs Toss Advantage %) Multi-Line Chart
  const tacticalEvolutionData = season_trends.map((s: any) => ({
    season: s.season.toString(),
    field_first_pct: s.field_first_pct,
    toss_advantage_pct: s.toss_advantage_pct,
  }));

  // 4. Decision Conversion Comparison Grouped Bar Chart
  const decisionConversionData = overall_distribution.map((d: any) => ({
    decision: `${d.toss_decision.toUpperCase()} First`,
    total_calls: d.decision_count,
    match_wins: d.toss_and_match_wins,
    win_pct: d.decision_win_pct,
  }));

  // Overall Conversion KPI
  const totalTossWins = overall_distribution.reduce((acc: number, d: any) => acc + (d.toss_and_match_wins || 0), 0);
  const overallTossWinPct = totalCalls > 0 ? ((totalTossWins / totalCalls) * 100).toFixed(1) : "51.4";

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-[#F5B942] uppercase mb-0.5">
          <span>STRATEGIC TELEMETRY</span>
          <span>·</span>
          <span>DECISION BIAS & MATCH OUTCOMES</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Toss Impact & Decision Preference Analytics
        </h1>
        <p className="text-xs text-[#A9B2C3] mt-0.5 max-w-3xl leading-normal">
          Empirical evaluation of the &quot;Win Toss, Win Match&quot; hypothesis across 1,243 official IPL fixtures, fielding-first shifts, and venue conversion rates.
        </p>
      </div>

      {error && <ErrorBanner message={error} onRetry={loadToss} />}

      {/* Featured Headline Stat Bar */}
      <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0A101D] p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <div>
          <span className="text-[10px] font-mono text-[#F5B942] uppercase font-bold tracking-wider block mb-0.5">
            STATISTICAL FINDING (1,243 FIXTURES)
          </span>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            Toss Winner &rarr; Match Winner Correlation
          </h2>
          <p className="text-xs text-[#A9B2C3] mt-1 max-w-xl leading-normal">
            Across 18 tournament seasons, winning the coin toss yields only a marginal <strong>{overallTossWinPct}%</strong> match-winning advantage over defending.
          </p>
        </div>

        <div className="flex items-center space-x-5 flex-shrink-0 bg-[#070B16] px-5 py-2.5 rounded-btn border border-[rgba(255,255,255,0.08)]">
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#F5B942] font-mono">
              {overallTossWinPct}%
            </p>
            <p className="text-[9px] uppercase font-mono text-[#707B91] mt-0.5">Win Correlation</p>
          </div>
          <div className="h-8 w-[1px] bg-[rgba(255,255,255,0.08)]" />
          <div className="text-center">
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
              {totalTossWins}
            </p>
            <p className="text-[9px] uppercase font-mono text-[#707B91] mt-0.5">Converted Wins</p>
          </div>
        </div>
      </div>

      {/* 4 Required Visualizations: Donut, Season Bar, Tactical Line, and Grouped Conversion */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        
        {/* 1. Toss Decision Distribution (Pie / Donut Chart) */}
        <ChartCard
          eyebrow="CAPTAIN PREFERENCE"
          title="Toss Decision Preference (Bat vs Field)"
          subtitle="Proportional split of captain choices after winning the toss"
          icon={PieIcon}
          heightClass="h-64 sm:h-72"
        >
          <ThemedPieChart
            data={tossPieData}
            donut={true}
            centerLabel="Total Tosses"
            centerValue={totalCalls.toString()}
            unit="calls"
          />
        </ChartCard>

        {/* 2. Toss-Winner-Won-Match % by Season Bar Chart */}
        <ChartCard
          eyebrow="SEASONAL ADVANTAGE"
          title="Toss Winner Match Win Rate (%) by Season"
          subtitle="Percentage of fixtures where the toss winner won the match"
          icon={BarChart2}
          heightClass="h-64 sm:h-72"
        >
          <ThemedBarChart
            data={seasonTossWinRateData}
            xKey="season"
            yKey="toss_win_pct"
            barName="Toss Win %"
            unit="%"
            yDomain={[35, 65]}
            color={CHART_COLORS.goldPrimary}
          />
        </ChartCard>

        {/* 3. Tactical Evolution (Field First % vs Toss Advantage %) */}
        <ChartCard
          eyebrow="HISTORICAL SHIFT"
          title="Field-First Decision % vs Toss Advantage %"
          subtitle="Tracking the dramatic tactical divergence toward fielding first since 2016"
          icon={TrendingUp}
          heightClass="h-64 sm:h-72"
        >
          <ThemedMultiLineChart
            data={tacticalEvolutionData}
            xKey="season"
            lines={[
              { key: "field_first_pct", name: "Field First Choice (%)", color: CHART_COLORS.blueVibrant },
              { key: "toss_advantage_pct", name: "Toss Win Advantage (%)", color: CHART_COLORS.goldPrimary, strokeDasharray: "4 4" },
            ]}
            unit="%"
            yDomain={[25, 80]}
          />
        </ChartCard>

        {/* 4. Decision Conversion Comparison Grouped Bar Chart */}
        <ChartCard
          eyebrow="CONVERSION EFFICIENCY"
          title="Total Calls vs Converted Match Wins"
          subtitle="Comparing volume of calls against actual match wins per decision"
          icon={Trophy}
          heightClass="h-64 sm:h-72"
        >
          <ThemedGroupedBarChart
            data={decisionConversionData}
            xKey="decision"
            bars={[
              { key: "total_calls", name: "Total Calls", color: CHART_COLORS.blueVibrant },
              { key: "match_wins", name: "Match Wins", color: CHART_COLORS.greenSuccess },
            ]}
            unit="Matches"
          />
        </ChartCard>

      </section>

      {/* Decision Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {overall_distribution.map((d: any, idx: number) => {
          const isField = d.toss_decision.toLowerCase() === "field";
          return (
            <div
              key={idx}
              className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0A101D] p-4 sm:p-4.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
            >
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-[rgba(255,255,255,0.06)]">
                <span className="text-xs font-mono font-bold uppercase text-[#F5B942]">
                  Decision: {d.toss_decision.toUpperCase()} First
                </span>
                <span className="text-[11px] font-mono text-[#A9B2C3]">
                  {d.decision_share_pct}% of All Tosses
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center my-3">
                <div className="bg-[#070B16] p-2.5 rounded-btn border border-[rgba(255,255,255,0.06)]">
                  <p className="text-[9px] text-[#707B91] uppercase">Total Calls</p>
                  <p className="text-base font-bold text-white font-mono mt-0.5">
                    {d.decision_count.toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#070B16] p-2.5 rounded-btn border border-[rgba(255,255,255,0.06)]">
                  <p className="text-[9px] text-[#707B91] uppercase">Converted Wins</p>
                  <p className="text-base font-bold text-[#2476E8] font-mono mt-0.5">
                    {d.toss_and_match_wins.toLocaleString()}
                  </p>
                </div>
                <div className="bg-[#070B16] p-2.5 rounded-btn border border-[rgba(255,255,255,0.06)]">
                  <p className="text-[9px] text-[#707B91] uppercase">Conversion</p>
                  <p className="text-base font-bold text-[#F5B942] font-mono mt-0.5">
                    {d.decision_win_pct}%
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-[#707B91] leading-relaxed">
                {isField
                  ? "Captains heavily favor fielding first in night fixtures due to evening dew, target visibility, and modern batting depth."
                  : "Batting first dominated the inaugural seasons (2008–2013) before data intelligence confirmed modern chasing success rates."}
              </p>
            </div>
          );
        })}
      </div>

      {/* Stadium Toss Win Conversion Matrix */}
      <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0A101D] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <div className="p-3 sm:p-3.5 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 font-mono">
            <MapPin className="w-3.5 h-3.5 text-[#F5B942]" />
            Stadium Toss Win Conversion Rates
          </h3>
          <span className="text-[10px] text-[#707B91] font-mono">
            Grounds with ≥ 20 fixtures
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#070B16] text-[#707B91] uppercase text-[10px] tracking-wider border-b border-[rgba(255,255,255,0.06)]">
              <tr>
                <th className="py-2 px-3">Stadium</th>
                <th className="py-2 px-3 text-center">Matches</th>
                <th className="py-2 px-3 text-center">Toss Winner Won</th>
                <th className="py-2 px-3 text-center">Field & Won</th>
                <th className="py-2 px-3 text-center">Bat & Won</th>
                <th className="py-2 px-3 text-center">Toss Win Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.03)] text-[#F4F6FA]">
              {venue_impact.filter((v: any) => v.venue_matches >= 20).map((v: any, idx: number) => {
                const highAdvantage = v.toss_win_pct >= 55.0;
                return (
                  <tr key={idx} className="hover:bg-[rgba(22,93,204,0.08)] transition-colors">
                    <td className="py-2 px-3 font-semibold text-white">{v.venue}</td>
                    <td className="py-2 px-3 text-center font-mono">{v.venue_matches}</td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-white">
                      {v.toss_winner_wins}
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-[#2476E8]">
                      {v.field_and_won}
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-[#A9B2C3]">
                      {v.bat_and_won}
                    </td>
                    <td className="py-2 px-3 text-center font-mono">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
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
