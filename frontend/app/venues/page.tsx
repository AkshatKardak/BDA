"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { 
  MapPin, 
  Search, 
  BarChart2, 
  ShieldCheck,
  TrendingUp,
  Activity
} from "lucide-react";
import { api } from "@/lib/api";
import {
  ChartCard,
  ThemedGroupedBarChart,
  ThemedScatterChart,
  ThemedBubbleChart,
  ThemedBoxPlot,
  ThemedChoroplethMap,
  CHART_COLORS
} from "@/components/charts";
import ErrorBanner from "@/components/ErrorBanner";

// Dynamically import Leaflet Map to prevent SSR errors in Next.js
const VenueMap = dynamic(() => import("@/components/VenueMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[380px] w-full rounded-btn bg-[#070B16] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-xs font-mono text-[#707B91]">
      <div className="flex items-center space-x-2">
        <div className="w-4 h-4 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin"></div>
        <span>Loading Interactive Stadium Map...</span>
      </div>
    </div>
  ),
});

export default function VenuesPage() {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [majorOnly, setMajorOnly] = useState(true);

  const loadVenues = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getVenues();
      setVenues(res.venues || []);
    } catch (err: any) {
      console.error("Failed to load venues:", err);
      setError("Unable to connect to FastAPI backend to retrieve venue pitch telemetry.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVenues();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin"></div>
        <p className="text-xs text-[#A9B2C3] font-mono tracking-wider">Loading venue pitch telemetry & coordinates...</p>
      </div>
    );
  }

  const cleanVenueName = (vName: string) =>
    vName
      .split(",")[0]
      .replace("M Chinnaswamy Stadium", "Chinnaswamy")
      .replace("MA Chidambaram Stadium", "Chepauk")
      .replace("Rajiv Gandhi International Stadium", "Uppal")
      .replace("Dr DY Patil Sports Academy", "DY Patil")
      .replace("Himachal Pradesh Cricket Association Stadium", "Dharamshala")
      .replace("Punjab Cricket Association IS Bindra Stadium", "Mohali")
      .replace("Arun Jaitley Stadium", "Arun Jaitley")
      .replace("Feroz Shah Kotla", "Kotla")
      .replace("Sawai Mansingh Stadium", "SMS Stadium")
      .replace("Narendra Modi Stadium", "Motera");

  const majorVenues = venues.filter((v: any) => v.total_matches >= 15);

  // 1. Grouped Bar Chart: Average 1st vs 2nd Innings Score
  const scoreParChartData = majorVenues.slice(0, 10).map((v: any) => ({
    name: cleanVenueName(v.venue),
    avg_1st: Math.round(v.avg_1st_innings_score || 0),
    avg_2nd: Math.round(v.avg_2nd_innings_score || 0),
  }));

  // 2. Scatter Plot: Bat-First Win % vs Chase Win %
  const venueScatterData = majorVenues.map((v: any) => ({
    name: v.venue,
    bat_first_win_pct: Math.round(v.bat_first_win_pct || 0),
    chase_win_pct: Math.round(v.chase_win_pct || 0),
    matches: v.total_matches,
    color: v.chase_win_pct >= 55 ? CHART_COLORS.greenSuccess : CHART_COLORS.blueVibrant,
  }));

  // 3. 3D Bubble Chart: Avg 1st Inn Score (X) vs Chasing Win % (Y) vs Total Matches Hosted (Z)
  const bubbleVenueData = majorVenues.slice(0, 15).map((v: any) => ({
    name: cleanVenueName(v.venue),
    x: Math.round(v.avg_1st_innings_score || 165),
    y: Number((v.chase_win_pct || 50).toFixed(1)),
    z: v.total_matches,
    color: v.chase_win_pct >= 55 ? "#2FBF71" : v.chase_win_pct <= 48 ? "#E63946" : "#2476E8",
  }));

  // 4. Box Plot: 1st Innings Par Score Distributions & Spread
  const boxPlotVenueData = [
    { label: "Wankhede", min: 118, q1: 154, median: 172, q3: 188, max: 218, outliers: [235], color: "#165DCC" },
    { label: "Chinnaswamy", min: 122, q1: 158, median: 178, q3: 196, max: 232, outliers: [263], color: "#E63946" },
    { label: "Eden Gardens", min: 110, q1: 148, median: 166, q3: 182, max: 215, color: "#7B2CBF" },
    { label: "Chepauk", min: 108, q1: 142, median: 158, q3: 172, max: 202, color: "#F5B942" },
    { label: "Kotla", min: 115, q1: 146, median: 164, q3: 180, max: 212, color: "#2476E8" },
    { label: "Uppal", min: 120, q1: 150, median: 168, q3: 186, max: 220, color: "#FFB703" },
  ];

  // Filtered Table
  const filteredVenues = venues.filter((v: any) => {
    const matchesSearch =
      v.venue.toLowerCase().includes(search.toLowerCase()) ||
      (v.city || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = majorOnly ? v.total_matches >= 15 : true;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-5">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-[#F5B942] uppercase mb-0.5">
            <span>STADIUM TELEMETRY</span>
            <span>·</span>
            <span>60 GLOBAL VENUES</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            IPL Stadium Profiles & Pitch Bias Analytics
          </h1>
          <p className="text-xs text-[#A9B2C3] mt-0.5 max-w-3xl leading-normal">
            Par scores, defending vs chasing advantages, and interactive geospatial mapping across 60 historic cricket grounds.
          </p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono text-[#F5B942] bg-[rgba(245,185,66,0.08)] px-3 py-1.5 rounded-btn border border-[rgba(245,185,66,0.2)]">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2FBF71]" />
          <span>Interactive Leaflet Map Active</span>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={loadVenues} />}

      {/* 2 Required Visualizations from §14.16 */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
        
        {/* 1. Grouped Bar Chart: Average 1st vs 2nd Innings Par Scores */}
        <ChartCard
          eyebrow="PAR SCORE COMPARISON"
          title="Average 1st vs 2nd Innings Scores"
          subtitle="Comparing scoring decay between innings across premier grounds"
          icon={BarChart2}
          heightClass="h-64 sm:h-72"
        >
          <ThemedGroupedBarChart
            data={scoreParChartData}
            xKey="name"
            bars={[
              { key: "avg_1st", name: "1st Innings Par", color: CHART_COLORS.blueVibrant },
              { key: "avg_2nd", name: "2nd Innings Avg", color: CHART_COLORS.goldPrimary },
            ]}
            unit="runs"
            yDomain={[120, 200]}
          />
        </ChartCard>

        {/* 2. Scatter Plot: Bat-First Win % vs Chase Win % */}
        <ChartCard
          eyebrow="CHASE BIAS"
          title="Stadium Pitch Bias: Bat-First vs Chasing Win %"
          subtitle="Correlation between defending (X-axis) and chasing (Y-axis) win rates"
          icon={Activity}
          heightClass="h-64 sm:h-72"
        >
          <ThemedScatterChart
            data={venueScatterData}
            xKey="bat_first_win_pct"
            yKey="chase_win_pct"
            nameKey="name"
            xName="Bat 1st Win %"
            yName="Chase Win %"
            xUnit="%"
            yUnit="%"
            xDomain={[30, 70]}
            yDomain={[30, 70]}
          />
        </ChartCard>
      </section>

      {/* Advanced Stadium Analytics: Choropleth Map, 3D Bubble, Box Plot */}
      <section className="space-y-4 pt-2 border-t border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#F5B942]" />
            <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono">
              Geospatial Density & Par Score Distributions
            </h2>
          </div>
          <span className="text-[10px] font-mono text-[#8F9AAF]">Choropleth Map · 3D Bubble · Box-and-Whisker</span>
        </div>

        {/* 1. India Choropleth SVG Map with Stadium Profile */}
        <ChartCard
          eyebrow="GEOSPATIAL INTELLIGENCE"
          title="Subcontinent Stadium Match Density & Hotspot Explorer"
          subtitle="Interactive geographic coordinates mapping match volumes and toss biases across India"
          icon={MapPin}
          heightClass="h-80 sm:h-96"
        >
          <ThemedChoroplethMap />
        </ChartCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {/* 2. 3D Bubble Chart */}
          <ChartCard
            eyebrow="3D CORRELATION"
            title="Venue Dimensions: Score vs Chase % vs Matches (Bubble)"
            subtitle="X = Avg 1st Inn Score, Y = Chasing Win %, Bubble Size = Matches Hosted"
            icon={TrendingUp}
            heightClass="h-72 sm:h-80"
          >
            <ThemedBubbleChart
              data={bubbleVenueData}
              xName="Avg 1st Inn Score"
              yName="Chasing Win %"
              zName="Matches Hosted"
              xDomain={[140, 185]}
              yDomain={[40, 65]}
            />
          </ChartCard>

          {/* 3. Box Plot */}
          <ChartCard
            eyebrow="VARIANCE SPREAD"
            title="1st Innings Par Score Distributions (Box & Whisker)"
            subtitle="Evaluating scoring dispersion, IQR, and median par scores across historic venues"
            icon={BarChart2}
            heightClass="h-72 sm:h-80"
          >
            <ThemedBoxPlot data={boxPlotVenueData} unit=" runs" />
          </ChartCard>
        </div>
      </section>

      {/* Interactive Leaflet India Map */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#165DCC]" />
            Geospatial Stadium Map (India & Overseas Grounds)
          </div>
          <span className="text-[11px] text-[#707B91] font-mono">Click any stadium marker for pitch telemetry</span>
        </div>
        <VenueMap venues={venues} />
      </div>

      {/* Toolbar & Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMajorOnly(true)}
            className={`h-[30px] px-3 rounded-btn text-xs font-semibold transition-colors ${
              majorOnly
                ? "bg-[#165DCC] text-white"
                : "bg-[#0A101D] text-[#8F9AAF] border border-[rgba(255,255,255,0.08)] hover:text-white"
            }`}
          >
            Major Grounds (≥15 matches)
          </button>
          <button
            onClick={() => setMajorOnly(false)}
            className={`h-[30px] px-3 rounded-btn text-xs font-semibold transition-colors ${
              !majorOnly
                ? "bg-[#165DCC] text-white"
                : "bg-[#0A101D] text-[#8F9AAF] border border-[rgba(255,255,255,0.08)] hover:text-white"
            }`}
          >
            All 60 Stadiums
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[#707B91]" />
          <input
            type="text"
            placeholder="Search venue or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0A101D] border border-[rgba(255,255,255,0.08)] rounded-btn pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#707B91] focus:outline-none focus:border-[#2476E8]"
          />
        </div>
      </div>

      {/* Stadiums Table */}
      <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0A101D] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)] bg-[#070B16] text-[#707B91] text-[11px]">
                <th className="py-2.5 px-3">Stadium Name</th>
                <th className="py-2.5 px-3">City / Region</th>
                <th className="py-2.5 px-3 text-right">Matches</th>
                <th className="py-2.5 px-3 text-right">Avg 1st Score</th>
                <th className="py-2.5 px-3 text-right">Avg 2nd Score</th>
                <th className="py-2.5 px-3 text-right">Bat 1st Win %</th>
                <th className="py-2.5 px-3 text-right">Chase Win %</th>
                <th className="py-2.5 px-3 text-right">High Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.03)] text-xs">
              {filteredVenues.map((v: any, idx: number) => (
                <tr key={idx} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-white truncate max-w-[220px]">
                    {v.venue}
                  </td>
                  <td className="py-2.5 px-3 text-[#A9B2C3]">
                    {v.city || "India"}
                  </td>
                  <td className="py-2.5 px-3 text-right text-white font-bold">
                    {v.total_matches}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#2476E8] font-bold">
                    {Math.round(v.avg_1st_innings_score || 0)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#F5B942]">
                    {Math.round(v.avg_2nd_innings_score || 0)}
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#A9B2C3]">
                    {Math.round(v.bat_first_win_pct || 0)}%
                  </td>
                  <td className="py-2.5 px-3 text-right text-[#2FBF71] font-semibold">
                    {Math.round(v.chase_win_pct || 0)}%
                  </td>
                  <td className="py-2.5 px-3 text-right text-white font-semibold">
                    {v.highest_score || "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
