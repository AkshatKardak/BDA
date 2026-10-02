"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Trophy, 
  Swords, 
  Calendar,
  Shield,
  TrendingUp,
  PieChart as PieIcon,
  BarChart2
} from "lucide-react";
import { api } from "@/lib/api";
import {
  ChartCard,
  ThemedBarChart,
  ThemedGroupedBarChart,
  ThemedLineChart,
  ThemedPieChart,
  CHART_COLORS,
  SERIES_PALETTE
} from "@/components/charts";
import ErrorBanner from "@/components/ErrorBanner";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teamDetail, setTeamDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getTeams();
      setTeams(res.franchises || []);
      if (res.franchises && res.franchises.length > 0) {
        handleSelectTeam(res.franchises[0].team);
      }
    } catch (err: any) {
      console.error("Failed to load teams:", err);
      setError("Unable to connect to the backend API to retrieve franchise data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const handleSelectTeam = async (teamName: string) => {
    try {
      setDetailLoading(true);
      const detail = await api.getTeamDetail(teamName);
      setSelectedTeam(teamName);
      setTeamDetail(detail);
    } catch (err) {
      console.error(`Failed to load details for ${teamName}:`, err);
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin"></div>
        <p className="text-xs text-[#A9B2C3] font-mono tracking-wider">Loading franchise standings & visual telemetry...</p>
      </div>
    );
  }

  // Abbreviate team names for clean chart axis display
  const cleanTeamName = (name: string) =>
    name
      .replace("Royal Challengers Bengaluru", "RCB")
      .replace("Chennai Super Kings", "CSK")
      .replace("Mumbai Indians", "MI")
      .replace("Kolkata Knight Riders", "KKR")
      .replace("Delhi Capitals", "DC")
      .replace("Punjab Kings", "PBKS")
      .replace("Rajasthan Royals", "RR")
      .replace("Sunrisers Hyderabad", "SRH")
      .replace("Gujarat Titans", "GT")
      .replace("Lucknow Super Giants", "LSG")
      .replace("Deccan Chargers", "DCG")
      .replace("Rising Pune Supergiant", "RPS")
      .replace("Rising Pune Supergiants", "RPS")
      .replace("Gujarat Lions", "GL")
      .replace("Kochi Tuskers Kerala", "KTK")
      .replace("Pune Warriors", "PWI");

  // Chart Dataset 1: Top 10 Franchises Wins
  const topWinsData = [...teams]
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 10)
    .map((t) => ({
      name: cleanTeamName(t.team),
      fullName: t.team,
      wins: t.wins,
      matches: t.matches_played,
      win_pct: t.win_pct,
      color: t.wins >= 140 ? CHART_COLORS.goldPrimary : CHART_COLORS.blueVibrant
    }));

  // Chart Dataset 2: Win Percentage
  const topWinPctData = [...teams]
    .sort((a, b) => b.win_pct - a.win_pct)
    .slice(0, 10)
    .map((t) => ({
      name: cleanTeamName(t.team),
      win_pct: t.win_pct,
    }));

  // Chart Dataset 3: Bat-First vs Chase Wins Grouped Bar
  const batVsChaseData = [...teams]
    .sort((a, b) => b.wins - a.wins)
    .slice(0, 8)
    .map((t) => ({
      name: cleanTeamName(t.team),
      bat_first: t.bat_first_wins || 0,
      chasing: t.chase_wins || 0,
    }));

  // Chart Dataset 4: Win Share Donut Chart (Top 6 Franchises)
  const top6Wins = teams.slice(0, 6);
  const otherWins = teams.slice(6).reduce((acc, t) => acc + (t.wins || 0), 0);
  const winShareDonutData = [
    ...top6Wins.map((t, idx) => ({
      name: cleanTeamName(t.team),
      value: t.wins,
      color: SERIES_PALETTE[idx % SERIES_PALETTE.length],
    })),
    { name: "Others", value: otherWins, color: CHART_COLORS.slateDim },
  ];

  // Chart Dataset 5: Selected Team Season Trend Line
  const seasonTrendData = (teamDetail?.season_history || []).map((s: any) => ({
    season: s.season.toString(),
    wins: s.wins,
    win_pct: s.season_win_pct,
    matches: s.matches,
  }));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-[#F5B942] uppercase mb-0.5">
          <span>FRANCHISE INTELLIGENCE</span>
          <span>·</span>
          <span>2008–2026 ARCHIVE</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          IPL Franchise Records & Performance Analytics
        </h1>
        <p className="text-xs text-[#A9B2C3] mt-0.5 max-w-3xl leading-normal">
          Empirical evaluation of all-time victories, defending vs chasing win modes, win conversion percentages, and seasonal momentum curves across 15 franchises.
        </p>
      </div>

      {error && <ErrorBanner message={error} onRetry={loadTeams} />}

      {/* 4 Required Visualizations: Grid of Themed Charts */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        
        {/* 1. All-Time Match Victories Bar Chart */}
        <ChartCard
          eyebrow="HISTORICAL WINS"
          title="All-Time Match Victories by Franchise"
          subtitle="Top 10 franchises ranked by total match wins (2008–2026)"
          icon={Trophy}
          heightClass="h-64 sm:h-72"
        >
          <ThemedBarChart
            data={topWinsData}
            xKey="name"
            yKey="wins"
            barName="Wins"
            unit="Wins"
            colorMap={(entry) => entry.color}
          />
        </ChartCard>

        {/* 2. Win Percentage (%) Bar Chart */}
        <ChartCard
          eyebrow="EFFICIENCY"
          title="Franchise Win Percentage (Win Rate %)"
          subtitle="Top 10 franchises ranked by all-time match win efficiency"
          icon={BarChart2}
          heightClass="h-64 sm:h-72"
        >
          <ThemedBarChart
            data={topWinPctData}
            xKey="name"
            yKey="win_pct"
            barName="Win Rate"
            unit="%"
            color={CHART_COLORS.goldPrimary}
          />
        </ChartCard>

        {/* 3. Bat-First vs Chasing Wins Grouped Bar Chart */}
        <ChartCard
          eyebrow="TACTICAL DEFENSE"
          title="Victory Mode: Bat First vs Chasing Wins"
          subtitle="Comparing defending (bat first) vs chasing victories for top teams"
          icon={Shield}
          heightClass="h-64 sm:h-72"
        >
          <ThemedGroupedBarChart
            data={batVsChaseData}
            xKey="name"
            bars={[
              { key: "bat_first", name: "Bat 1st (Defended)", color: CHART_COLORS.blueVibrant },
              { key: "chasing", name: "Chased Target", color: CHART_COLORS.greenSuccess },
            ]}
            unit="Wins"
          />
        </ChartCard>

        {/* 4. All-Time Win Share Donut Chart */}
        <ChartCard
          eyebrow="DOMINANCE"
          title="All-Time Tournament Win Share"
          subtitle="Proportional share of total IPL match victories among franchises"
          icon={PieIcon}
          heightClass="h-64 sm:h-72"
        >
          <ThemedPieChart
            data={winShareDonutData}
            donut={true}
            centerLabel="Total Wins"
            centerValue="1,243"
            unit="wins"
          />
        </ChartCard>
      </section>

      {/* Selected Team Deep Dive & Season Trend Line */}
      {selectedTeam && teamDetail && (
        <section className="space-y-4 pt-2 border-t border-[rgba(255,255,255,0.06)]">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-[#F5B942] uppercase tracking-wider font-bold block mb-0.5">
                INDIVIDUAL FRANCHISE PROFILE
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-1.5 font-mono">
                <Users className="w-4 h-4 text-[#2476E8]" />
                {selectedTeam}
              </h2>
            </div>
            {detailLoading && (
              <span className="text-xs text-[#F5B942] font-mono animate-pulse">
                Updating telemetry...
              </span>
            )}
          </div>

          {/* Snapshot KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0A101D] p-3 sm:p-3.5">
              <p className="text-[10px] text-[#707B91] uppercase font-mono font-semibold">Total Fixtures</p>
              <p className="text-xl font-bold text-white font-sans mt-0.5">{teamDetail.matches_played}</p>
              <p className="text-[10px] text-[#A9B2C3] mt-0.5">{teamDetail.wins} Wins · {teamDetail.losses} Losses</p>
            </div>
            <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0A101D] p-3 sm:p-3.5">
              <p className="text-[10px] text-[#707B91] uppercase font-mono font-semibold">Win Percentage</p>
              <p className="text-xl font-bold text-[#F5B942] font-sans mt-0.5">{teamDetail.win_pct}%</p>
              <p className="text-[10px] text-[#A9B2C3] mt-0.5">All-time efficiency</p>
            </div>
            <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0A101D] p-3 sm:p-3.5">
              <p className="text-[10px] text-[#707B91] uppercase font-mono font-semibold">Defending (Bat 1st)</p>
              <p className="text-xl font-bold text-[#2476E8] font-sans mt-0.5">{teamDetail.bat_first_wins}</p>
              <p className="text-[10px] text-[#A9B2C3] mt-0.5">{teamDetail.bat_first_win_pct}% Win Rate</p>
            </div>
            <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0A101D] p-3 sm:p-3.5">
              <p className="text-[10px] text-[#707B91] uppercase font-mono font-semibold">Chasing (Bat 2nd)</p>
              <p className="text-xl font-bold text-[#2FBF71] font-sans mt-0.5">{teamDetail.chase_wins}</p>
              <p className="text-[10px] text-[#A9B2C3] mt-0.5">{teamDetail.chase_win_pct}% Win Rate</p>
            </div>
          </div>

          {/* Season Trend Line Chart */}
          <ChartCard
            eyebrow="SEASONAL MOMENTUM"
            title={`${selectedTeam} · Win Rate Trajectory Across Seasons`}
            subtitle="Season-by-season win percentage (%) evolution"
            icon={TrendingUp}
            heightClass="h-56 sm:h-64"
            empty={seasonTrendData.length === 0}
          >
            <ThemedLineChart
              data={seasonTrendData}
              xKey="season"
              yKey="win_pct"
              lineName="Win Rate"
              unit="%"
              color={CHART_COLORS.goldPrimary}
            />
          </ChartCard>
        </section>
      )}

      {/* Standings Table with Selection */}
      <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0A101D] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <div className="p-3 sm:p-3.5 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 font-mono">
            <Trophy className="w-3.5 h-3.5 text-[#F5B942]" />
            Complete 15-Franchise Standings Matrix
          </h2>
          <span className="text-[10px] text-[#707B91] font-mono hidden sm:inline">
            Click any franchise to load individual telemetry & season trajectory
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-[#070B16] text-[#707B91] uppercase text-[10px] tracking-wider border-b border-[rgba(255,255,255,0.06)]">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Franchise</th>
                <th className="py-2.5 px-3 text-center">Played</th>
                <th className="py-2.5 px-3 text-center">Wins</th>
                <th className="py-2.5 px-3 text-center">Losses</th>
                <th className="py-2.5 px-3 text-center">Win %</th>
                <th className="py-2.5 px-3 text-center">Bat 1st Win %</th>
                <th className="py-2.5 px-3 text-center">Chase Win %</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.03)] text-[#F4F6FA]">
              {teams.map((t, idx) => {
                const isSelected = selectedTeam === t.team;
                return (
                  <tr
                    key={t.team}
                    onClick={() => handleSelectTeam(t.team)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[rgba(22,93,204,0.16)] border-l-4 border-l-[#F5B942]"
                        : "hover:bg-[rgba(255,255,255,0.02)]"
                    }`}
                  >
                    <td className="py-2.5 px-3 font-bold text-[#707B91]">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-white flex items-center gap-1.5">
                      <span>{t.team}</span>
                      {idx === 0 && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[rgba(245,185,66,0.12)] text-[#F5B942] border border-[rgba(245,185,66,0.25)] font-bold">
                          #1 Wins
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-center text-white">{t.matches_played}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-white">{t.wins}</td>
                    <td className="py-2.5 px-3 text-center text-[#707B91]">{t.losses}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-[#F5B942]">
                      {t.win_pct}%
                    </td>
                    <td className="py-2.5 px-3 text-center text-[#2476E8]">
                      {t.bat_first_win_pct}% <span className="text-[#707B91]">({t.bat_first_wins})</span>
                    </td>
                    <td className="py-2.5 px-3 text-center text-[#2FBF71]">
                      {t.chase_win_pct}% <span className="text-[#707B91]">({t.chase_wins})</span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        className={`h-[24px] px-2.5 rounded-btn text-[10px] font-semibold transition-colors ${
                          isSelected
                            ? "bg-[#165DCC] text-white"
                            : "bg-[#070B16] border border-[rgba(255,255,255,0.08)] text-[#A9B2C3] hover:text-white"
                        }`}
                      >
                        {isSelected ? "Active" : "Inspect"}
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
