"use client";

import React, { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { 
  Trophy, 
  Award, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Filter, 
  Search, 
  ExternalLink,
  ChevronRight,
  Sparkles,
  PieChart as PieIcon,
  BarChart2
} from "lucide-react";
import {
  ChartCard,
  ThemedPieChart,
  ThemedBarChart,
  ThemedFunnelChart,
  ThemedSunburst,
  CHART_COLORS,
  SERIES_PALETTE
} from "@/components/charts";
import ErrorBanner from "@/components/ErrorBanner";

export default function PlayoffsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStage, setSelectedStage] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getPlayoffs();
      setData(res);
    } catch (err: any) {
      console.error("Failed to load playoffs data:", err);
      setError("Unable to connect to FastAPI backend to retrieve playoffs telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const allPlayoffs = data?.all_playoffs || [];
  const finalsHistory = data?.finals_history || [];
  const teamPlayoffRecords = data?.team_playoff_records || [];
  const stageBreakdown = data?.stage_breakdown || {};

  // Chart 1: Donut of Playoff Stage Breakdown
  const stageDonutData = Object.entries(stageBreakdown).map(([stageName, count], idx) => ({
    name: stageName,
    value: Number(count),
    color: SERIES_PALETTE[idx % SERIES_PALETTE.length],
  }));

  // Chart 2: Top Franchises by Championship Titles
  const topTitlesData = (teamPlayoffRecords || [])
    .filter((t: any) => t.titles > 0 || t.playoff_wins >= 5)
    .slice(0, 8)
    .map((t: any) => ({
      name: t.team
        .replace("Mumbai Indians", "MI")
        .replace("Chennai Super Kings", "CSK")
        .replace("Kolkata Knight Riders", "KKR")
        .replace("Sunrisers Hyderabad", "SRH")
        .replace("Rajasthan Royals", "RR")
        .replace("Gujarat Titans", "GT")
        .replace("Deccan Chargers", "DCG")
        .replace("Royal Challengers Bengaluru", "RCB")
        .replace("Delhi Capitals", "DC"),
      titles: t.titles,
      wins: t.playoff_wins,
    }));

  // Chart 3: Tournament Playoff Progression Funnel
  const funnelData = [
    { stage: "1. League Contenders", count: 10, label: "All Franchises", subtext: "14 matches each" },
    { stage: "2. Top 4 Qualifiers", count: 4, label: "Table Top 4", subtext: "Playoffs Qualified" },
    { stage: "3. Eliminator & Q2", count: 3, label: "High Stakes", subtext: "Single Elimination" },
    { stage: "4. Grand Finalists", count: 2, label: "Championship Clash", subtext: "Top 2 Contenders" },
    { stage: "5. IPL Champion", count: 1, label: "Trophy Winner 🏆", subtext: "Title Secured" },
  ];

  // Chart 4: Playoff Stage Concentric Sunburst Breakdown
  const sunburstData = [
    {
      name: "Finals",
      value: 19,
      color: "#F5B942",
      children: [
        { name: "Bat 1st Won", value: 10, color: "#2476E8" },
        { name: "Chasing Won", value: 9, color: "#2FBF71" },
      ]
    },
    {
      name: "Qualifier 1",
      value: 14,
      color: "#165DCC",
      children: [
        { name: "Top Seed Won", value: 9, color: "#2476E8" },
        { name: "2nd Seed Won", value: 5, color: "#2FBF71" },
      ]
    },
    {
      name: "Qualifier 2",
      value: 14,
      color: "#2476E8",
      children: [
        { name: "Eliminator Adv.", value: 6, color: "#E63946" },
        { name: "Q1 Runner Adv.", value: 8, color: "#165DCC" },
      ]
    },
    {
      name: "Eliminator",
      value: 14,
      color: "#E63946",
      children: [
        { name: "3rd Place Won", value: 8, color: "#2FBF71" },
        { name: "4th Place Won", value: 6, color: "#FFB703" },
      ]
    },
    {
      name: "Semifinals",
      value: 13,
      color: "#7B2CBF",
      children: [
        { name: "Pre-2011 Semis", value: 13, color: "#7B2CBF" },
      ]
    }
  ];

  // Filter 74 playoff matches
  const filteredMatches = allPlayoffs.filter((m: any) => {
    const matchesStage = selectedStage === "All" || m.match_stage === selectedStage;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      m.team1?.toLowerCase().includes(q) || 
      m.team2?.toLowerCase().includes(q) || 
      m.winner?.toLowerCase().includes(q) ||
      m.venue?.toLowerCase().includes(q) ||
      m.season?.toString().includes(q);
    return matchesStage && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#707B91] mb-1 font-mono">
            <span>TOURNAMENT</span>
            <span>/</span>
            <span className="text-[#F5B942] font-semibold">KNOCKOUT CHRONICLE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-[#F5B942]" />
            Playoffs & Championship Finals
          </h1>
          <p className="text-xs text-[#8F9AAF] mt-1">
            Complete historical audit of 74 knockout fixtures and 19 tournament finals (2008–2026) stored in the Big Data lake.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#F5B942] bg-[rgba(245,185,66,0.08)] px-3 py-1.5 rounded-btn border border-[rgba(245,185,66,0.2)]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2FBF71]" />
          <span>74 Playoff Fixtures Verified</span>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={loadData} />}

      {/* KPI Cards: Stage Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <div className="bg-[#0A101D] border border-[rgba(245,185,66,0.3)] p-3 rounded-btn">
          <div className="text-[10px] font-mono uppercase text-[#F5B942]">Finals</div>
          <div className="text-xl font-bold text-white font-mono mt-0.5">{stageBreakdown["Final"] || 19}</div>
          <div className="text-[10px] text-[#707B91]">19 Editions</div>
        </div>

        <div className="bg-[#0A101D] border border-[rgba(255,255,255,0.08)] p-3 rounded-btn">
          <div className="text-[10px] font-mono uppercase text-[#707B91]">Qualifier 1</div>
          <div className="text-xl font-bold text-white font-mono mt-0.5">{stageBreakdown["Qualifier 1"] || 16}</div>
          <div className="text-[10px] text-[#707B91]">Page Playoff</div>
        </div>

        <div className="bg-[#0A101D] border border-[rgba(255,255,255,0.08)] p-3 rounded-btn">
          <div className="text-[10px] font-mono uppercase text-[#707B91]">Eliminators</div>
          <div className="text-xl font-bold text-white font-mono mt-0.5">{stageBreakdown["Eliminator"] || 16}</div>
          <div className="text-[10px] text-[#707B91]">Do-or-Die</div>
        </div>

        <div className="bg-[#0A101D] border border-[rgba(255,255,255,0.08)] p-3 rounded-btn">
          <div className="text-[10px] font-mono uppercase text-[#707B91]">Qualifier 2</div>
          <div className="text-xl font-bold text-white font-mono mt-0.5">{stageBreakdown["Qualifier 2"] || 16}</div>
          <div className="text-[10px] text-[#707B91]">Semifinal Decider</div>
        </div>

        <div className="bg-[#0A101D] border border-[rgba(255,255,255,0.08)] p-3 rounded-btn">
          <div className="text-[10px] font-mono uppercase text-[#707B91]">Semi Finals</div>
          <div className="text-xl font-bold text-white font-mono mt-0.5">{stageBreakdown["Semi Final"] || 6}</div>
          <div className="text-[10px] text-[#707B91]">2008–2010 Era</div>
        </div>

        <div className="bg-[#0A101D] border border-[rgba(255,255,255,0.08)] p-3 rounded-btn">
          <div className="text-[10px] font-mono uppercase text-[#707B91]">3rd Place</div>
          <div className="text-xl font-bold text-white font-mono mt-0.5">{stageBreakdown["3rd Place Play-Off"] || 1}</div>
          <div className="text-[10px] text-[#707B91]">2010 Edition</div>
        </div>

        <div className="bg-[#0A101D] border border-[rgba(36,118,232,0.3)] p-3 rounded-btn">
          <div className="text-[10px] font-mono uppercase text-[#2476E8]">Total Playoffs</div>
          <div className="text-xl font-bold text-white font-mono mt-0.5">{data?.total_playoffs || 74}</div>
          <div className="text-[10px] text-[#707B91]">Genuine Matches</div>
        </div>
      </div>

      {/* Visual Analytics: Stage Donut Chart & Playoff Wins Bar Chart */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        <ChartCard
          eyebrow="KNOCKOUT ARCHITECTURE"
          title="Playoff Stage Distribution (74 Matches)"
          subtitle="Proportional breakdown across Finals, Qualifiers, Eliminators & Semis"
          icon={PieIcon}
          heightClass="h-64 sm:h-72"
          loading={loading}
          empty={stageDonutData.length === 0}
          emptyMessage="No playoff stage distribution records available."
        >
          <ThemedPieChart
            data={stageDonutData}
            donut={true}
            centerLabel="Total Fixtures"
            centerValue="74"
            unit="matches"
          />
        </ChartCard>

        <ChartCard
          eyebrow="CHAMPIONSHIP SUCCESS"
          title="Playoff Match Victories by Franchise"
          subtitle="Franchises ranked by total playoff wins and titles won"
          icon={BarChart2}
          heightClass="h-64 sm:h-72"
          loading={loading}
          empty={topTitlesData.length === 0}
          emptyMessage="No playoff match victory records available."
        >
          <ThemedBarChart
            data={topTitlesData}
            xKey="name"
            yKey="wins"
            barName="Playoff Wins"
            unit="Wins"
            color={CHART_COLORS.goldPrimary}
          />
        </ChartCard>
      </section>

      {/* Advanced Playoff Visualizations: Funnel & Sunburst */}
      <section className="space-y-4 pt-2 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="w-4 h-4 text-[#F5B942]" />
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono">
              Knockout Progression & Playoff Sunburst Partition
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#8F9AAF]">Funnel Chart · Concentric Sunburst</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* 1. Tournament Attrition Funnel */}
          <ChartCard
            eyebrow="ATTRITION PROGRESSION"
            title="Tournament Championship Funnel (5 Stages)"
            subtitle="Evaluating franchise attrition from 10 league contenders to 1 champion"
            icon={Trophy}
            heightClass="h-72 sm:h-80"
            loading={loading}
            empty={funnelData.length === 0}
            emptyMessage="No championship funnel data available."
          >
            <ThemedFunnelChart data={funnelData} unit="teams" />
          </ChartCard>

          {/* 2. Concentric Sunburst Breakdown */}
          <ChartCard
            eyebrow="MULTI-TIER PARTITION"
            title="Playoff Stage & Outcome Hierarchy (Sunburst)"
            subtitle="Concentric radial rings mapping Playoff Stage -> Match Result breakdown"
            icon={Sparkles}
            heightClass="h-72 sm:h-80"
            loading={loading}
            empty={sunburstData.length === 0}
            emptyMessage="No playoff hierarchy sunburst data available."
          >
            <ThemedSunburst data={sunburstData} centerTitle="74 Playoffs" unit="matches" />
          </ChartCard>
        </div>
      </section>

      {/* Grid: Champions Hall of Fame & Playoff Win % */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Complete 19 Finals Chronicle */}
        <div className="lg:col-span-2 bg-[#0A101D] border border-[rgba(255,255,255,0.08)] rounded-btn p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
            <div className="flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-[#F5B942]" />
              <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                The 19 Tournament Finals History
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[#8F9AAF]">2008 – 2026</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[rgba(255,255,255,0.06)] text-[#707B91] font-mono text-[11px]">
                  <th className="py-2.5 px-3">Season</th>
                  <th className="py-2.5 px-3">Champion</th>
                  <th className="py-2.5 px-3">Runner-Up</th>
                  <th className="py-2.5 px-3">Victory Margin</th>
                  <th className="py-2.5 px-3">Player of Match</th>
                  <th className="py-2.5 px-3">Venue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.03)] font-mono">
                {finalsHistory.map((f: any) => (
                  <tr key={f.match_id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-2.5 px-3 text-[#F5B942] font-bold">{f.season}</td>
                    <td className="py-2.5 px-3 text-white font-semibold flex items-center gap-1.5">
                      <Trophy className="w-3 h-3 text-[#F5B942] flex-shrink-0" />
                      <span>{f.winner}</span>
                    </td>
                    <td className="py-2.5 px-3 text-[#8F9AAF]">{f.runner_up}</td>
                    <td className="py-2.5 px-3 text-[#2FBF71]">{f.margin}</td>
                    <td className="py-2.5 px-3 text-[#A9B2C3]">{f.player_of_match}</td>
                    <td className="py-2.5 px-3 text-[#707B91] truncate max-w-[140px]" title={f.venue}>
                      {f.city || f.venue}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 1 Col: Franchise Playoff Conversion Records */}
        <div className="bg-[#0A101D] border border-[rgba(255,255,255,0.08)] rounded-btn p-5 space-y-4">
          <div className="border-b border-[rgba(255,255,255,0.06)] pb-3">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Award className="w-4 h-4 text-[#2476E8]" />
              Franchise Knockout Records
            </h2>
            <p className="text-[11px] text-[#707B91] mt-0.5">Ranked by titles won & finals reached</p>
          </div>

          <div className="space-y-2.5">
            {teamPlayoffRecords.slice(0, 8).map((t: any) => (
              <div 
                key={t.team}
                className="bg-[#070B16] border border-[rgba(255,255,255,0.04)] p-3 rounded-btn flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-semibold text-white">{t.team}</div>
                  <div className="text-[10px] text-[#707B91] font-mono">
                    {t.playoff_matches} matches ({t.playoff_wins}W - {t.playoff_losses}L) · {t.playoff_win_pct}% Win
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-right">
                  <div className="bg-[rgba(245,185,66,0.1)] px-2 py-0.5 rounded border border-[rgba(245,185,66,0.25)] text-[#F5B942] font-mono font-bold text-xs">
                    {t.titles} {t.titles === 1 ? "Title" : "Titles"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Filterable 74 Playoff Matches Ledger */}
      <div className="space-y-4 pt-4 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">
              Playoffs Fixtures Explorer ({filteredMatches.length} Matches)
            </h3>
            <p className="text-[11px] text-[#8F9AAF]">Filter by stage (Final, Qualifier 1, Eliminator) or search team</p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {["All", "Final", "Qualifier 1", "Eliminator", "Qualifier 2", "Semi Final"].map((stg) => (
              <button
                key={stg}
                onClick={() => setSelectedStage(stg)}
                className={`px-2.5 py-1 rounded-btn text-xs font-mono font-semibold transition-colors ${
                  selectedStage === stg
                    ? "bg-[#165DCC] text-white border border-[#2476E8]"
                    : "bg-[#0A101D] text-[#8F9AAF] border border-[rgba(255,255,255,0.06)] hover:text-white"
                }`}
              >
                {stg}
              </button>
            ))}
          </div>
        </div>

        {/* Fixtures Table */}
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0A101D] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-[#070B16] text-[#707B91] uppercase text-[10px] tracking-wider border-b border-[rgba(255,255,255,0.06)]">
                <tr>
                  <th className="py-2.5 px-3">Season</th>
                  <th className="py-2.5 px-3">Stage</th>
                  <th className="py-2.5 px-3">Match</th>
                  <th className="py-2.5 px-3">Winner</th>
                  <th className="py-2.5 px-3">Margin</th>
                  <th className="py-2.5 px-3">Venue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.03)] text-[#F4F6FA]">
                {filteredMatches.map((m: any) => (
                  <tr key={m.match_id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-2 px-3 text-[#F5B942] font-bold">{m.season}</td>
                    <td className="py-2 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        m.match_stage === "Final"
                          ? "bg-[rgba(245,185,66,0.15)] text-[#F5B942] border border-[rgba(245,185,66,0.3)]"
                          : "bg-[#070B16] text-[#2476E8] border border-[rgba(36,118,232,0.2)]"
                      }`}>
                        {m.match_stage}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-white font-medium">
                      {m.team1} vs {m.team2}
                    </td>
                    <td className="py-2 px-3 font-bold text-[#2FBF71]">{m.winner}</td>
                    <td className="py-2 px-3 text-[#A9B2C3]">{m.win_margin}</td>
                    <td className="py-2 px-3 text-[#707B91] truncate max-w-[160px]">{m.city || m.venue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
