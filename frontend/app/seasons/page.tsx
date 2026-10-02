"use client";

import React, { useEffect, useState } from "react";
import { 
  Calendar, 
  TrendingUp, 
  Flame, 
  Trophy,
  BarChart3,
  Layers,
  ArrowRight
} from "lucide-react";
import { api } from "@/lib/api";
import {
  ChartCard,
  ThemedLineChart,
  ThemedGroupedBarChart,
  ThemedBarChart,
  ThemedAreaChart,
  CHART_COLORS
} from "@/components/charts";
import ErrorBanner from "@/components/ErrorBanner";

export default function SeasonsPage() {
  const [timeline, setTimeline] = useState<any[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<string>("2026");
  const [seasonDetail, setSeasonDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSeasons = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getSeasons();
      setTimeline(res.timeline || []);
      if (res.timeline && res.timeline.length > 0) {
        const latest = res.timeline[res.timeline.length - 1].season.toString();
        setSelectedSeason(latest);
        handleSelectSeason(latest);
      }
    } catch (err: any) {
      console.error("Failed to load seasons:", err);
      setError("Unable to connect to FastAPI backend to retrieve seasonal timeline data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        <p className="text-xs text-[#A9B2C3] font-mono tracking-wider">Loading seasonal timeline data & macro trends...</p>
      </div>
    );
  }

  // Chart 1: Run-Rate Trajectory (2008–2026)
  const runRateData = timeline.map((s: any) => ({
    season: s.season.toString(),
    run_rate: s.run_rate,
  }));

  // Chart 2: Stacked Boundaries (Sixes + Fours)
  const boundaryStackedData = timeline.map((s: any) => ({
    season: s.season.toString(),
    sixes: s.sixes,
    fours: s.fours,
  }));

  // Chart 3: Matches Hosted per Season
  const matchesPerSeasonData = timeline.map((s: any) => ({
    season: s.season.toString(),
    matches: s.season_matches,
  }));

  // Chart 4: Chasing Win % Trajectory
  const chasingWinData = timeline.map((s: any) => ({
    season: s.season.toString(),
    chase_pct: s.chasing_win_pct,
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-[#F5B942] uppercase mb-0.5">
          <span>HISTORICAL EVOLUTION</span>
          <span>·</span>
          <span>18 EDITIONS (2008–2026)</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          IPL Scoring Evolution & Macro-Trends
        </h1>
        <p className="text-xs text-[#A9B2C3] mt-0.5 max-w-3xl leading-normal">
          Tracking the explosive rise in run-rates (8.31 to 9.88 RPO), sixes escalation (1,400+ per season), and tournament expansion across 18 editions.
        </p>
      </div>

      {error && <ErrorBanner message={error} onRetry={loadSeasons} />}

      {/* 4 Required Visualizations: Run Rate Line, Stacked Boundaries, Matches Bar, and Chase Area */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        
        {/* 1. Run-Rate Trajectory Line Chart */}
        <ChartCard
          eyebrow="SCORING ACCELERATION"
          title="IPL Run Rate Evolution (Runs Per Over)"
          subtitle="Progressive run rate trajectory from 8.31 RPO (2008) to 9.88 RPO (2026)"
          icon={TrendingUp}
          heightClass="h-64 sm:h-72"
        >
          <ThemedLineChart
            data={runRateData}
            xKey="season"
            yKey="run_rate"
            lineName="Run Rate"
            unit="RPO"
            yDomain={[7, 10.5]}
            color={CHART_COLORS.goldPrimary}
          />
        </ChartCard>

        {/* 2. Stacked Bar Chart: Fours vs Sixes Evolution */}
        <ChartCard
          eyebrow="BOUNDARY POWER"
          title="Boundary Evolution: Fours and Sixes per Edition"
          subtitle="Stacked boundary counts showcasing the explosion of maximum hits"
          icon={Flame}
          heightClass="h-64 sm:h-72"
        >
          <ThemedGroupedBarChart
            data={boundaryStackedData}
            xKey="season"
            stacked={true}
            bars={[
              { key: "fours", name: "Boundary Fours", color: CHART_COLORS.blueVibrant },
              { key: "sixes", name: "Maximum Sixes", color: CHART_COLORS.goldPrimary },
            ]}
            unit="hits"
          />
        </ChartCard>

        {/* 3. Bar Chart: Matches Played Per Season */}
        <ChartCard
          eyebrow="LEAGUE EXPANSION"
          title="Matches Hosted per Tournament Edition"
          subtitle="Tournament format expansion from 58 fixtures to 74 matches"
          icon={BarChart3}
          heightClass="h-64 sm:h-72"
        >
          <ThemedBarChart
            data={matchesPerSeasonData}
            xKey="season"
            yKey="matches"
            barName="Fixtures"
            unit="Matches"
            yDomain={[50, 80]}
            color={CHART_COLORS.bluePrimary}
          />
        </ChartCard>

        {/* 4. Area Chart: Chasing Win % Trajectory */}
        <ChartCard
          eyebrow="CHASE SUCCESS"
          title="Chasing Win % Trajectory by Season"
          subtitle="Percentage of fixtures won by the side batting second"
          icon={Layers}
          heightClass="h-64 sm:h-72"
        >
          <ThemedAreaChart
            data={chasingWinData}
            xKey="season"
            yKey="chase_pct"
            areaName="Chasing Win %"
            unit="%"
            yDomain={[40, 70]}
            color={CHART_COLORS.greenSuccess}
          />
        </ChartCard>

      </section>

      {/* Season Selection & Deep Dive */}
      <div className="space-y-4 pt-2 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <span className="text-[10px] font-mono text-[#F5B942] uppercase tracking-wider font-bold block mb-0.5">
              SEASON SELECTION
            </span>
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5 font-mono">
              <Calendar className="w-4 h-4 text-[#165DCC]" />
              Inspect Season {selectedSeason} Telemetry
            </h3>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {timeline.map((s: any) => (
              <button
                key={s.season}
                onClick={() => handleSelectSeason(s.season.toString())}
                className={`px-2.5 py-1 rounded-btn text-xs font-mono font-semibold transition-colors ${
                  selectedSeason === s.season.toString()
                    ? "bg-[#165DCC] text-white border border-[#2476E8]"
                    : "bg-[#0A101D] text-[#8F9AAF] border border-[rgba(255,255,255,0.06)] hover:text-white"
                }`}
              >
                {s.season}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Season Detail Overview */}
        {seasonDetail && (
          <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0A101D] p-5 space-y-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-3 border-b border-[rgba(255,255,255,0.06)]">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#F5B942]" />
                  IPL {selectedSeason} Edition Summary
                </h4>
                <p className="text-xs text-[#8F9AAF] mt-0.5">
                  Winner: <strong className="text-white">{seasonDetail.champion || seasonDetail.winner || "Historical Champion"}</strong> · Runner Up: {seasonDetail.runner_up || "Finalist"}
                </p>
              </div>

              <span className="text-xs font-mono text-[#F5B942] bg-[rgba(245,185,66,0.1)] px-2.5 py-1 rounded border border-[rgba(245,185,66,0.25)]">
                Run Rate: {seasonDetail.run_rate} RPO
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 text-xs font-mono">
              <div className="bg-[#070B16] p-2.5 rounded-btn border border-[rgba(255,255,255,0.04)]">
                <span className="text-[10px] text-[#707B91] uppercase block">Fixtures</span>
                <strong className="text-white text-sm">{seasonDetail.matches_count || seasonDetail.matches?.length || 74}</strong>
              </div>
              <div className="bg-[#070B16] p-2.5 rounded-btn border border-[rgba(255,255,255,0.04)]">
                <span className="text-[10px] text-[#707B91] uppercase block">Total Runs</span>
                <strong className="text-white text-sm">{seasonDetail.total_runs?.toLocaleString()}</strong>
              </div>
              <div className="bg-[#070B16] p-2.5 rounded-btn border border-[rgba(255,255,255,0.04)]">
                <span className="text-[10px] text-[#707B91] uppercase block">Total Fours</span>
                <strong className="text-[#2476E8] text-sm">{seasonDetail.fours?.toLocaleString()}</strong>
              </div>
              <div className="bg-[#070B16] p-2.5 rounded-btn border border-[rgba(255,255,255,0.04)]">
                <span className="text-[10px] text-[#707B91] uppercase block">Total Sixes</span>
                <strong className="text-[#F5B942] text-sm">{seasonDetail.sixes?.toLocaleString()}</strong>
              </div>
              <div className="bg-[#070B16] p-2.5 rounded-btn border border-[rgba(255,255,255,0.04)]">
                <span className="text-[10px] text-[#707B91] uppercase block">Wickets</span>
                <strong className="text-white text-sm">{seasonDetail.total_wickets?.toLocaleString()}</strong>
              </div>
              <div className="bg-[#070B16] p-2.5 rounded-btn border border-[rgba(255,255,255,0.04)]">
                <span className="text-[10px] text-[#707B91] uppercase block">Chase Win %</span>
                <strong className="text-[#2FBF71] text-sm">{seasonDetail.chasing_win_pct}%</strong>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Historical Seasons Matrix Table */}
      <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0A101D] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <div className="p-3 sm:p-3.5 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 font-mono">
            <Calendar className="w-3.5 h-3.5 text-[#F5B942]" />
            Season Macro-Trends Matrix (2008–2026)
          </h3>
          <span className="text-[10px] text-[#707B91] font-mono">18 Tournament Seasons</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#070B16] text-[#707B91] uppercase text-[10px] tracking-wider border-b border-[rgba(255,255,255,0.06)]">
              <tr>
                <th className="py-2.5 px-3">Season</th>
                <th className="py-2.5 px-3 text-center">Matches</th>
                <th className="py-2.5 px-3 text-center">Total Runs</th>
                <th className="py-2.5 px-3 text-center">Run Rate</th>
                <th className="py-2.5 px-3 text-center">Fours</th>
                <th className="py-2.5 px-3 text-center">Sixes</th>
                <th className="py-2.5 px-3 text-center">Boundary %</th>
                <th className="py-2.5 px-3 text-center">Chase Win %</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.03)] text-[#F4F6FA]">
              {timeline.map((s: any) => {
                const isSelected = selectedSeason === s.season.toString();
                return (
                  <tr
                    key={s.season}
                    onClick={() => handleSelectSeason(s.season.toString())}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[rgba(22,93,204,0.16)] border-l-4 border-l-[#F5B942]"
                        : "hover:bg-[rgba(255,255,255,0.02)]"
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-white">{s.season}</td>
                    <td className="py-2.5 px-3 text-center text-white">{s.season_matches}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-white">{s.total_runs?.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-[#F5B942]">{s.run_rate}</td>
                    <td className="py-2.5 px-3 text-center text-[#2476E8]">{s.fours?.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-center font-semibold text-[#F5B942]">{s.sixes?.toLocaleString()}</td>
                    <td className="py-2.5 px-3 text-center text-white">{s.boundary_run_pct}%</td>
                    <td className="py-2.5 px-3 text-center text-[#2FBF71]">{s.chasing_win_pct}%</td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        className={`h-[24px] px-2.5 rounded-btn text-[10px] font-semibold transition-colors ${
                          isSelected
                            ? "bg-[#165DCC] text-white"
                            : "bg-[#070B16] border border-[rgba(255,255,255,0.08)] text-[#A9B2C3] hover:text-white"
                        }`}
                      >
                        {isSelected ? "Inspecting" : "Select"}
                      </button>
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
