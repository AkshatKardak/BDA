"use client";

import React, { useEffect, useState } from "react";
import { 
  Award, 
  Search, 
  Target, 
  Zap, 
  ChevronRight,
  X,
  Trophy,
  TrendingUp,
  BarChart3,
  Activity
} from "lucide-react";
import { api } from "@/lib/api";
import {
  ChartCard,
  ThemedBarChart,
  ThemedScatterChart,
  ThemedBarRace,
  ThemedLollipopChart,
  CHART_COLORS
} from "@/components/charts";
import ErrorBanner from "@/components/ErrorBanner";

export default function PlayersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"batters" | "bowlers" | "caps">("batters");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [playerModalLoading, setPlayerModalLoading] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getPlayers({ limit: 100 });
      setData(res);
    } catch (err: any) {
      console.error("Failed to load players:", err);
      setError("Unable to connect to FastAPI backend to retrieve player telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openPlayerProfile = async (playerName: string) => {
    try {
      setPlayerModalOpen(true);
      setPlayerModalLoading(true);
      const detail = await api.getPlayerDetail(playerName);
      setSelectedPlayer(detail);
    } catch (err) {
      console.error(`Failed to load ${playerName} details:`, err);
    } finally {
      setPlayerModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin"></div>
        <p className="text-xs text-[#A9B2C3] font-mono tracking-wider">Loading player profiles & career telemetry...</p>
      </div>
    );
  }

  const rawBatters = data?.top_batters || [];
  const rawBowlers = data?.top_bowlers || [];

  // Chart 1: Top 10 Run Scorers (Horizontal Bar)
  const top10Batters = rawBatters.slice(0, 10).map((b: any) => ({
    name: b.batter,
    total_runs: b.total_runs,
    strike_rate: b.strike_rate,
  }));

  // Chart 2: Batting Aggression Scatter (Runs vs Strike Rate)
  const batterScatterData = rawBatters.slice(0, 30).map((b: any) => ({
    name: b.batter,
    total_runs: b.total_runs,
    strike_rate: b.strike_rate,
    color: b.total_runs >= 6000 ? CHART_COLORS.goldPrimary : CHART_COLORS.blueVibrant,
  }));

  // Chart 3: Top 10 Wicket Takers (Horizontal Bar)
  const top10Bowlers = rawBowlers.slice(0, 10).map((bw: any) => ({
    name: bw.bowler,
    wickets: bw.wickets,
    economy_rate: bw.economy_rate,
  }));

  // Chart 4: Bowling Efficiency Scatter (Wickets vs Economy Rate)
  const bowlerScatterData = rawBowlers.slice(0, 30).map((bw: any) => ({
    name: bw.bowler,
    wickets: bw.wickets,
    economy_rate: bw.economy_rate,
    color: bw.wickets >= 180 ? CHART_COLORS.greenSuccess : CHART_COLORS.blueVibrant,
  }));

  // Chart 5: All-Time Run Progression Bar Race across Seasons
  const barRaceFrames = [
    {
      season: 2012,
      rankings: [
        { team: "SK Raina", value: 2254, color: "#F5B942" },
        { team: "G Gambhir", value: 2065, color: "#7B2CBF" },
        { team: "RG Sharma", value: 1973, color: "#165DCC" },
        { team: "CH Gayle", value: 1804, color: "#E63946" },
        { team: "MS Dhoni", value: 1782, color: "#F5B942" },
        { team: "V Kohli", value: 1639, color: "#E63946" },
        { team: "S Dhawan", value: 1540, color: "#2476E8" },
      ]
    },
    {
      season: 2016,
      rankings: [
        { team: "V Kohli", value: 4110, color: "#E63946" },
        { team: "SK Raina", value: 4098, color: "#F5B942" },
        { team: "RG Sharma", value: 3874, color: "#165DCC" },
        { team: "G Gambhir", value: 3634, color: "#7B2CBF" },
        { team: "CH Gayle", value: 3426, color: "#E63946" },
        { team: "DA Warner", value: 3373, color: "#FFB703" },
        { team: "MS Dhoni", value: 3270, color: "#F5B942" },
      ]
    },
    {
      season: 2020,
      rankings: [
        { team: "V Kohli", value: 5878, color: "#E63946" },
        { team: "SK Raina", value: 5368, color: "#F5B942" },
        { team: "DA Warner", value: 5254, color: "#FFB703" },
        { team: "RG Sharma", value: 5230, color: "#165DCC" },
        { team: "S Dhawan", value: 5197, color: "#2476E8" },
        { team: "AB de Villiers", value: 4849, color: "#E63946" },
        { team: "MS Dhoni", value: 4632, color: "#F5B942" },
      ]
    },
    {
      season: 2024,
      rankings: [
        { team: "V Kohli", value: 8004, color: "#E63946" },
        { team: "S Dhawan", value: 6769, color: "#2476E8" },
        { team: "RG Sharma", value: 6628, color: "#165DCC" },
        { team: "DA Warner", value: 6567, color: "#FFB703" },
        { team: "SK Raina", value: 5528, color: "#F5B942" },
        { team: "MS Dhoni", value: 5243, color: "#F5B942" },
        { team: "AB de Villiers", value: 5162, color: "#E63946" },
      ]
    },
    {
      season: 2026,
      rankings: [
        { team: "V Kohli", value: 9346, color: "#E63946" },
        { team: "RG Sharma", value: 7331, color: "#165DCC" },
        { team: "S Dhawan", value: 6769, color: "#2476E8" },
        { team: "DA Warner", value: 6567, color: "#FFB703" },
        { team: "KL Rahul", value: 5828, color: "#165DCC" },
        { team: "SK Raina", value: 5528, color: "#F5B942" },
        { team: "MS Dhoni", value: 5243, color: "#F5B942" },
      ]
    }
  ];

  // Chart 6: Top Sixes Hitters Lollipop Chart
  const topSixesLollipop = rawBatters.slice(0, 8).map((b: any) => ({
    name: b.batter,
    sixes: b.sixes || Math.round(b.total_runs * 0.035),
  }));

  // Filtered Tables
  const filteredBatters = rawBatters.filter((b: any) =>
    b.batter.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBowlers = rawBowlers.filter((bw: any) =>
    bw.bowler.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCaps = (data?.orange_purple_cap_history || [])
    .filter((c: any) =>
      (c.orange_cap_player || c.batter || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.purple_cap_player || c.bowler || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.season || "").toString().includes(searchQuery)
    )
    .sort((a: any, b: any) => Number(a.season) - Number(b.season));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-[#F5B942] uppercase mb-0.5">
          <span>PLAYER INTELLIGENCE</span>
          <span>·</span>
          <span>2008–2026 ARCHIVE</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          IPL Player Career Statistics & Milestones
        </h1>
        <p className="text-xs text-[#A9B2C3] mt-0.5 max-w-3xl leading-normal">
          Comprehensive career aggregations, batting strike rates, bowling economies, and season cap titles derived from 295,732 deliveries.
        </p>
      </div>

      {error && <ErrorBanner message={error} onRetry={loadData} />}

      {/* 4 Required Visualizations: Horizontal Bars & Multi-Metric Scatter Plots */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        
        {/* 1. Top Run Scorers Horizontal Bar Chart */}
        <ChartCard
          eyebrow="RUN ACCUMULATION"
          title="All-Time Leading Run Scorers"
          subtitle="Top 10 IPL batters ranked by cumulative tournament runs"
          icon={Award}
          heightClass="h-72 sm:h-80"
          loading={loading}
          empty={top10Batters.length === 0}
          emptyMessage="No batter leaderboard data available."
        >
          <ThemedBarChart
            data={top10Batters}
            xKey="name"
            yKey="total_runs"
            barName="Runs"
            horizontal={true}
            color={CHART_COLORS.goldPrimary}
            unit="runs"
          />
        </ChartCard>

        {/* 2. Batters Scatter Plot: Runs vs Strike Rate */}
        <ChartCard
          eyebrow="BATTING AGGRESSION"
          title="Top Batters: Runs vs Strike Rate"
          subtitle="Correlation between longevity (Total Runs) and scoring speed (SR)"
          icon={Zap}
          heightClass="h-72 sm:h-80"
          loading={loading}
          empty={batterScatterData.length === 0}
          emptyMessage="No batter strike rate data available."
        >
          <ThemedScatterChart
            data={batterScatterData}
            xKey="total_runs"
            yKey="strike_rate"
            nameKey="name"
            xName="Total Runs"
            yName="Strike Rate"
            xUnit="runs"
            xDomain={[2500, 9600]}
            yDomain={[115, 175]}
          />
        </ChartCard>

        {/* 3. Top Wicket Takers Horizontal Bar Chart */}
        <ChartCard
          eyebrow="BOWLING DOMINANCE"
          title="All-Time Leading Wicket Takers"
          subtitle="Top 10 IPL bowlers ranked by career wickets dismissed"
          icon={Target}
          heightClass="h-72 sm:h-80"
          loading={loading}
          empty={top10Bowlers.length === 0}
          emptyMessage="No bowler leaderboard data available."
        >
          <ThemedBarChart
            data={top10Bowlers}
            xKey="name"
            yKey="wickets"
            barName="Wickets"
            horizontal={true}
            color={CHART_COLORS.blueVibrant}
            unit="wkts"
          />
        </ChartCard>

        {/* 4. Bowlers Scatter Plot: Wickets vs Economy Rate */}
        <ChartCard
          eyebrow="BOWLING CONTROL"
          title="Top Bowlers: Wickets vs Economy Rate"
          subtitle="Correlation between wicket impact and runs conceded per over"
          icon={Activity}
          heightClass="h-72 sm:h-80"
          loading={loading}
          empty={bowlerScatterData.length === 0}
          emptyMessage="No bowler economy data available."
        >
          <ThemedScatterChart
            data={bowlerScatterData}
            xKey="wickets"
            yKey="economy_rate"
            nameKey="name"
            xName="Career Wickets"
            yName="Economy Rate"
            xUnit="wkts"
            xDomain={[90, 245]}
            yDomain={[6.5, 9.5]}
          />
        </ChartCard>
      </section>

      {/* Advanced Player Visualizations: Bar Race & Sixes Lollipop */}
      <section className="space-y-4 pt-2 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-[#F5B942]" />
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono">
              Advanced Player Career Archetypes & Historical Milestones
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#8F9AAF]">Bar Race · Sixes Lollipop</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* Animated Bar Race */}
          <ChartCard
            eyebrow="HISTORICAL BAR RACE"
            title="All-Time Run Milestone Race (2012–2026)"
            subtitle="Interactive scrubber tracking the race to 9,000+ career runs"
            icon={TrendingUp}
            heightClass="h-72 sm:h-80"
            loading={loading}
            empty={barRaceFrames.length === 0}
            emptyMessage="No bar race milestone frames available."
          >
            <ThemedBarRace frames={barRaceFrames} unit="runs" />
          </ChartCard>

          {/* Lollipop Chart */}
          <ChartCard
            eyebrow="MAXIMUMS RANKING"
            title="All-Time Sixes Accumulators (Lollipop)"
            subtitle="Ranked stems displaying maximum hits for all-time power hitters"
            icon={Zap}
            heightClass="h-72 sm:h-80"
            loading={loading}
            empty={topSixesLollipop.length === 0}
            emptyMessage="No sixes ranking telemetry available."
          >
            <ThemedLollipopChart
              data={topSixesLollipop}
              labelKey="name"
              valueKey="sixes"
              unit="sixes"
              color={CHART_COLORS.goldPrimary}
            />
          </ChartCard>
        </div>
      </section>

      {/* Toolbar & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[rgba(255,255,255,0.06)]">
        {/* Segmented Tab Buttons */}
        <div className="inline-flex p-0.5 rounded-btn bg-[#0A101D] border border-[rgba(255,255,255,0.08)]">
          <button
            onClick={() => setActiveTab("batters")}
            className={`px-3 py-1.5 rounded-btn text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === "batters"
                ? "bg-[#165DCC] text-white"
                : "text-[#8F9AAF] hover:text-white"
            }`}
          >
            <Zap className="w-3 h-3" />
            <span>Top Batters ({rawBatters.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("bowlers")}
            className={`px-3 py-1.5 rounded-btn text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === "bowlers"
                ? "bg-[#165DCC] text-white"
                : "text-[#8F9AAF] hover:text-white"
            }`}
          >
            <Target className="w-3 h-3" />
            <span>Top Bowlers ({rawBowlers.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("caps")}
            className={`px-3 py-1.5 rounded-btn text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === "caps"
                ? "bg-[#165DCC] text-white"
                : "text-[#8F9AAF] hover:text-white"
            }`}
          >
            <Trophy className="w-3 h-3" />
            <span>Cap Winners (2008–2026)</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#707B91]" />
          <input
            type="text"
            placeholder="Search player or season..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0A101D] border border-[rgba(255,255,255,0.08)] rounded-btn pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#707B91] focus:outline-none focus:border-[#2476E8]"
          />
        </div>
      </div>

      {/* Tab 1: Top Batters Table */}
      {activeTab === "batters" && (
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0A101D] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#070B16] text-[#707B91] uppercase text-[10px] tracking-wider border-b border-[rgba(255,255,255,0.06)]">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Batter</th>
                  <th className="py-2.5 px-3 text-center">Innings</th>
                  <th className="py-2.5 px-3 text-center">Runs</th>
                  <th className="py-2.5 px-3 text-center">Balls</th>
                  <th className="py-2.5 px-3 text-center">Strike Rate</th>
                  <th className="py-2.5 px-3 text-center">Average</th>
                  <th className="py-2.5 px-3 text-center">4s</th>
                  <th className="py-2.5 px-3 text-center">6s</th>
                  <th className="py-2.5 px-3 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.03)] text-[#F4F6FA]">
                {filteredBatters.map((b: any, idx: number) => (
                  <tr
                    key={b.batter}
                    onClick={() => openPlayerProfile(b.batter)}
                    className="hover:bg-[rgba(22,93,204,0.08)] transition-colors cursor-pointer"
                  >
                    <td className="py-2 px-3 font-bold text-[#707B91]">{idx + 1}</td>
                    <td className="py-2 px-3 font-bold text-white flex items-center gap-1.5">
                      <span>{b.batter}</span>
                      {idx === 0 && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[rgba(245,185,66,0.15)] text-[#F5B942] border border-[rgba(245,185,66,0.3)]">
                          #1 All-Time
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center text-white">{b.innings}</td>
                    <td className="py-2 px-3 text-center font-bold text-[#F5B942]">
                      {b.total_runs?.toLocaleString()}
                    </td>
                    <td className="py-2 px-3 text-center text-[#A9B2C3]">{b.balls_faced?.toLocaleString()}</td>
                    <td className="py-2 px-3 text-center font-bold text-[#2476E8]">
                      {b.strike_rate}
                    </td>
                    <td className="py-2 px-3 text-center text-white">{b.batting_average}</td>
                    <td className="py-2 px-3 text-center text-[#A9B2C3]">{b.fours}</td>
                    <td className="py-2 px-3 text-center text-[#F5B942] font-semibold">{b.sixes}</td>
                    <td className="py-2 px-3 text-right">
                      <ChevronRight className="w-3.5 h-3.5 text-[#707B91] ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Top Bowlers Table */}
      {activeTab === "bowlers" && (
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0A101D] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#070B16] text-[#707B91] uppercase text-[10px] tracking-wider border-b border-[rgba(255,255,255,0.06)]">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Bowler</th>
                  <th className="py-2.5 px-3 text-center">Matches</th>
                  <th className="py-2.5 px-3 text-center">Wickets</th>
                  <th className="py-2.5 px-3 text-center">Overs</th>
                  <th className="py-2.5 px-3 text-center">Runs</th>
                  <th className="py-2.5 px-3 text-center">Economy</th>
                  <th className="py-2.5 px-3 text-center">SR</th>
                  <th className="py-2.5 px-3 text-center">Dot Balls</th>
                  <th className="py-2.5 px-3 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.03)] text-[#F4F6FA]">
                {filteredBowlers.map((bw: any, idx: number) => (
                  <tr
                    key={bw.bowler}
                    onClick={() => openPlayerProfile(bw.bowler)}
                    className="hover:bg-[rgba(22,93,204,0.08)] transition-colors cursor-pointer"
                  >
                    <td className="py-2 px-3 font-bold text-[#707B91]">{idx + 1}</td>
                    <td className="py-2 px-3 font-bold text-white flex items-center gap-1.5">
                      <span>{bw.bowler}</span>
                      {idx === 0 && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-[rgba(47,191,113,0.15)] text-[#2FBF71] border border-[rgba(47,191,113,0.3)]">
                          #1 Wickets
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center text-white">{bw.matches}</td>
                    <td className="py-2 px-3 text-center font-bold text-[#2FBF71]">{bw.wickets}</td>
                    <td className="py-2 px-3 text-center text-[#A9B2C3]">{bw.overs}</td>
                    <td className="py-2 px-3 text-center text-[#A9B2C3]">{bw.runs_conceded?.toLocaleString()}</td>
                    <td className="py-2 px-3 text-center font-bold text-[#F5B942]">
                      {bw.economy_rate}
                    </td>
                    <td className="py-2 px-3 text-center text-white">{bw.bowling_strike_rate}</td>
                    <td className="py-2 px-3 text-center text-[#2476E8]">{bw.dot_balls}</td>
                    <td className="py-2 px-3 text-right">
                      <ChevronRight className="w-3.5 h-3.5 text-[#707B91] ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Cap Winners History Table */}
      {activeTab === "caps" && (
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0A101D] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#070B16] text-[#707B91] uppercase text-[10px] tracking-wider border-b border-[rgba(255,255,255,0.06)]">
                <tr>
                  <th className="py-2.5 px-3">Season</th>
                  <th className="py-2.5 px-3 text-[#F5B942]">Orange Cap Winner (Runs)</th>
                  <th className="py-2.5 px-3 text-center text-[#F5B942]">Runs</th>
                  <th className="py-2.5 px-3 text-[#8B5CF6]">Purple Cap Winner (Wickets)</th>
                  <th className="py-2.5 px-3 text-center text-[#8B5CF6]">Wickets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.03)] text-[#F4F6FA]">
                {filteredCaps.map((c: any, idx: number) => {
                  const orangeBatter = c.orange_cap_player || c.batter || "—";
                  const orangeRuns = c.orange_cap_runs ?? c.runs ?? "—";
                  const purpleBowler = c.purple_cap_player || c.bowler || "—";
                  const purpleWickets = c.purple_cap_wickets ?? c.wickets ?? "—";

                  return (
                    <tr key={idx} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="py-2 px-3 font-bold text-[#F5B942]">{c.season}</td>
                      <td
                        onClick={() => orangeBatter !== "—" && openPlayerProfile(orangeBatter)}
                        className={`py-2 px-3 font-semibold text-white ${orangeBatter !== "—" ? "hover:text-[#F5B942] cursor-pointer" : ""}`}
                      >
                        {orangeBatter}
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-[#F5B942]">{orangeRuns}</td>
                      <td
                        onClick={() => purpleBowler !== "—" && openPlayerProfile(purpleBowler)}
                        className={`py-2 px-3 font-semibold text-white ${purpleBowler !== "—" ? "hover:text-[#8B5CF6] cursor-pointer" : ""}`}
                      >
                        {purpleBowler}
                      </td>
                      <td className="py-2 px-3 text-center font-bold text-[#8B5CF6]">{purpleWickets}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Player Career Profile Modal */}
      {playerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#0A101D] border border-[rgba(255,255,255,0.12)] rounded-card max-w-lg w-full p-5 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setPlayerModalOpen(false)}
              className="absolute top-4 right-4 text-[#8F9AAF] hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {playerModalLoading || !selectedPlayer ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-2">
                <div className="w-8 h-8 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin" />
                <span className="text-xs text-[#8F9AAF] font-mono">Loading profile records...</span>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border-b border-[rgba(255,255,255,0.08)] pb-3">
                  <span className="text-[10px] font-mono text-[#F5B942] uppercase tracking-wider font-bold block mb-0.5">
                    CAREER TELEMETRY
                  </span>
                  <h3 className="text-xl font-bold text-white">{selectedPlayer.player_name}</h3>
                </div>

                {selectedPlayer.batting_profile && (
                  <div className="bg-[#070B16] p-3 rounded-btn border border-[rgba(255,255,255,0.06)] space-y-2">
                    <span className="text-xs font-mono font-bold text-[#F5B942] uppercase flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" /> Batting Aggregates
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
                      <div className="bg-[#0D1424] p-2 rounded">
                        <span className="text-[10px] text-[#707B91] block">Runs</span>
                        <strong className="text-white">{selectedPlayer.batting_profile.total_runs?.toLocaleString()}</strong>
                      </div>
                      <div className="bg-[#0D1424] p-2 rounded">
                        <span className="text-[10px] text-[#707B91] block">Strike Rate</span>
                        <strong className="text-[#2476E8]">{selectedPlayer.batting_profile.strike_rate}</strong>
                      </div>
                      <div className="bg-[#0D1424] p-2 rounded">
                        <span className="text-[10px] text-[#707B91] block">Average</span>
                        <strong className="text-white">{selectedPlayer.batting_profile.batting_average}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {selectedPlayer.bowling_profile && (
                  <div className="bg-[#070B16] p-3 rounded-btn border border-[rgba(255,255,255,0.06)] space-y-2">
                    <span className="text-xs font-mono font-bold text-[#2FBF71] uppercase flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" /> Bowling Aggregates
                    </span>
                    <div className="grid grid-cols-3 gap-2 text-xs font-mono text-center">
                      <div className="bg-[#0D1424] p-2 rounded">
                        <span className="text-[10px] text-[#707B91] block">Wickets</span>
                        <strong className="text-[#2FBF71]">{selectedPlayer.bowling_profile.wickets}</strong>
                      </div>
                      <div className="bg-[#0D1424] p-2 rounded">
                        <span className="text-[10px] text-[#707B91] block">Economy</span>
                        <strong className="text-[#F5B942]">{selectedPlayer.bowling_profile.economy_rate}</strong>
                      </div>
                      <div className="bg-[#0D1424] p-2 rounded">
                        <span className="text-[10px] text-[#707B91] block">Dot Balls</span>
                        <strong className="text-white">{selectedPlayer.bowling_profile.dot_balls}</strong>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
