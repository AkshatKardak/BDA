"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  Award, 
  ArrowRight,
  Database,
  Shield,
  Zap,
  Flame,
  Activity,
  AlertTriangle
} from "lucide-react";
import StatCard from "@/components/StatCard";
import ArchitectureFlow from "@/components/ArchitectureFlow";
import { api } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await api.getOverview();
        setData(res);
      } catch (err: any) {
        console.error("Error loading overview:", err);
        setError("Unable to connect to FastAPI backend at http://127.0.0.1:8000. Ensure the backend server is running.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[55vh] space-y-4">
        <div className="w-10 h-10 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin"></div>
        <p className="text-xs text-[#A9B2C3] font-mono tracking-wider">
          Querying Big Data Lake Telemetry...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-card border border-[rgba(230,57,70,0.3)] bg-[#0D1424] p-8 text-center max-w-xl mx-auto my-12 shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
        <div className="w-11 h-11 mx-auto mb-4 rounded-full bg-[rgba(230,57,70,0.1)] border border-[rgba(230,57,70,0.25)] flex items-center justify-center text-[#E63946]">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Backend Connection Notice</h3>
        <p className="text-xs text-[#A9B2C3] mb-6 leading-relaxed">{error}</p>
        <div className="bg-[#070B16] rounded-btn p-3 font-mono text-xs text-left text-[#A9B2C3] border border-[rgba(255,255,255,0.06)] mb-6 overflow-x-auto">
          <code>python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload</code>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="h-[40px] px-6 bg-[#165DCC] hover:bg-[#2476E8] text-white rounded-btn text-xs font-semibold transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { kpis, top_teams, top_batters, top_bowlers, recent_seasons } = data;

  const chartTeamData = (top_teams || []).map((t: any) => ({
    name: t.team
      .replace("Royal Challengers Bengaluru", "RCB")
      .replace("Chennai Super Kings", "CSK")
      .replace("Mumbai Indians", "MI")
      .replace("Kolkata Knight Riders", "KKR")
      .replace("Delhi Capitals", "DC"),
    wins: t.wins,
    win_pct: t.win_pct,
  }));

  const seasonTrendData = (recent_seasons || []).map((s: any) => ({
    season: s.season.toString(),
    rpo: s.run_rate,
    runs: s.total_runs,
  }));

  return (
    <div className="space-y-8">
      {/* Editorial Sports Hero Section */}
      <section className="relative overflow-hidden rounded-card bg-[#0B1222] border border-[rgba(255,255,255,0.07)] p-6 sm:p-10 shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
        {/* Subtle diagonal stadium-light lighting effect */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_85%_15%,rgba(22,93,204,0.14),transparent_70%)]" />

        <div className="relative z-10 max-w-[760px]">
          {/* Eyebrow */}
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-widest text-[#F5B942] uppercase">
            <span>IPL DATA INTELLIGENCE</span>
            <span>·</span>
            <span>2008–2026</span>
          </div>

          {/* Thin Gold Rule */}
          <div className="h-[3px] w-[54px] bg-[#F5B942] my-3.5 rounded-full" />

          {/* Sports/Editorial Heading */}
          <h1 className="text-3xl sm:text-[44px] lg:text-[48px] font-extrabold text-white tracking-tight leading-[1.08]">
            IPL Large-Scale Cricket Data Analytics
          </h1>

          {/* Editorial Subtitle */}
          <p className="mt-3.5 text-sm sm:text-base text-[#A9B2C3] leading-relaxed max-w-[720px]">
            Explore 19 seasons of ball-by-ball IPL data through distributed analytics powered by Apache Flume, Hadoop HDFS, Hive and PySpark.
          </p>

          {/* Action Buttons */}
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Link
              href="/teams"
              className="inline-flex items-center justify-center h-[44px] px-5 rounded-btn bg-[#165DCC] hover:bg-[#2476E8] text-white text-xs font-semibold transition-colors space-x-2"
            >
              <span>Explore Franchises</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/pipeline"
              className="inline-flex items-center justify-center h-[44px] px-5 rounded-btn bg-transparent border border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.05)] text-[#F7F8FC] text-xs font-semibold transition-colors space-x-2"
            >
              <Database className="w-3.5 h-3.5 text-[#F5B942]" />
              <span>Big Data Architecture</span>
            </Link>
          </div>
        </div>
      </section>

      {/* KPI Cards Grid */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          label="Total Matches"
          value={kpis.total_matches}
          subtitle="2008–2026 Editions"
          icon={Trophy}
          accent="gold"
        />
        <StatCard
          label="Total Deliveries"
          value={kpis.total_deliveries}
          subtitle="Cricsheet Real Data"
          icon={Activity}
          accent="blue"
        />
        <StatCard
          label="Total Runs"
          value={kpis.total_runs}
          subtitle={`Avg RPO: ${kpis.average_run_rate}`}
          icon={Zap}
          accent="gold"
        />
        <StatCard
          label="Total Wickets"
          value={kpis.total_wickets}
          subtitle="Across All Innings"
          icon={Target}
          accent="white"
        />
        <StatCard
          label="Total Sixes"
          value={kpis.total_sixes}
          subtitle={`Fours: ${kpis.total_fours.toLocaleString()}`}
          icon={Flame}
          accent="gold"
        />
        <StatCard
          label="Franchises"
          value={kpis.total_teams}
          subtitle={`${kpis.total_venues} Historic Venues`}
          icon={Shield}
          accent="blue"
        />
      </section>

      {/* Big Data Pipeline Section */}
      <section>
        <ArchitectureFlow />
      </section>

      {/* Core Analytical Visualizations */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Franchises Chart */}
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <div>
              <span className="text-[10px] font-mono text-[#F5B942] uppercase tracking-wider font-bold block mb-0.5">
                ALL-TIME RANKINGS
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-[#F5B942]" />
                Most Successful Franchises
              </h3>
            </div>
            <Link
              href="/teams"
              className="text-xs text-[#2476E8] hover:text-[#F5B942] transition-colors flex items-center gap-1 font-medium"
            >
              <span>Full Standings</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartTeamData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="name" stroke="#6F7A90" fontSize={11} tickLine={false} />
                <YAxis stroke="#6F7A90" fontSize={11} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(22,93,204,0.08)" }}
                  contentStyle={{
                    backgroundColor: "#0D1424",
                    borderColor: "rgba(255,255,255,0.12)",
                    borderRadius: "8px",
                    color: "#F4F6FA",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="wins" name="Match Wins" radius={[4, 4, 0, 0]}>
                  {chartTeamData.map((entry: any, index: number) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={index === 0 ? "#F5B942" : "#2476E8"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Season Run Rate Evolution */}
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <div>
              <span className="text-[10px] font-mono text-[#2476E8] uppercase tracking-wider font-bold block mb-0.5">
                SCORING INTENSITY
              </span>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#F5B942]" />
                Scoring Evolution (Runs Per Over)
              </h3>
            </div>
            <Link
              href="/seasons"
              className="text-xs text-[#2476E8] hover:text-[#F5B942] transition-colors flex items-center gap-1 font-medium"
            >
              <span>18 Seasons</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={seasonTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="season" stroke="#6F7A90" fontSize={11} tickLine={false} />
                <YAxis stroke="#6F7A90" fontSize={11} domain={[7.5, 10.5]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0D1424",
                    borderColor: "rgba(255,255,255,0.12)",
                    borderRadius: "8px",
                    color: "#F4F6FA",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rpo"
                  name="Run Rate (RPO)"
                  stroke="#F5B942"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#F5B942" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Top Players Sports Statistics Showcases */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top 5 Batters */}
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[#F5B942]" />
              All-Time Career Run Leaders
            </h3>
            <Link
              href="/players"
              className="text-xs text-[#2476E8] hover:text-[#F5B942] transition-colors flex items-center gap-1 font-medium"
            >
              <span>Full Table</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-[rgba(255,255,255,0.06)]">
            {top_batters.map((b: any, idx: number) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3 min-w-0">
                  <span className={`w-5 h-5 rounded-btn flex items-center justify-center font-mono font-bold text-[11px] ${
                    idx === 0
                      ? "bg-[#F5B942] text-[#070B16]"
                      : "bg-[#111A2E] text-[#A9B2C3]"
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <p className="font-semibold text-white truncate">{b.batter}</p>
                    <p className="text-[11px] text-[#707B91]">{b.innings} innings · SR {b.strike_rate}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 pl-2">
                  <span className="font-bold text-[#F4F6FA] font-sans text-sm">
                    {b.total_runs.toLocaleString()}
                  </span>
                  <p className="text-[10px] text-[#707B91]">{b.fours} 4s · {b.sixes} 6s</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Bowlers */}
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(255,255,255,0.06)]">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-[#2476E8]" />
              All-Time Career Wicket Leaders
            </h3>
            <Link
              href="/players"
              className="text-xs text-[#2476E8] hover:text-[#F5B942] transition-colors flex items-center gap-1 font-medium"
            >
              <span>Full Table</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-[rgba(255,255,255,0.06)]">
            {top_bowlers.map((bw: any, idx: number) => (
              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3 min-w-0">
                  <span className={`w-5 h-5 rounded-btn flex items-center justify-center font-mono font-bold text-[11px] ${
                    idx === 0
                      ? "bg-[#F5B942] text-[#070B16]"
                      : "bg-[#111A2E] text-[#A9B2C3]"
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <p className="font-semibold text-white truncate">{bw.bowler}</p>
                    <p className="text-[11px] text-[#707B91]">{bw.matches} matches · Econ {bw.economy_rate}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 pl-2">
                  <span className="font-bold text-[#F4F6FA] font-sans text-sm">
                    {bw.wickets} wkts
                  </span>
                  <p className="text-[10px] text-[#707B91]">{bw.dot_balls.toLocaleString()} dots</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
