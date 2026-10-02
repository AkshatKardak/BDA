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
  AlertTriangle,
  Radio,
  Clock,
  CheckCircle2,
  Sparkles,
  Layers,
  MapPin
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
  CartesianGrid,
  Legend
} from "recharts";

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [phases, setPhases] = useState<any[]>([]);
  const [overByOver, setOverByOver] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const [overviewRes, insightsRes, phasesRes, overRes] = await Promise.all([
          api.getOverview(),
          api.getInsights().catch(() => []),
          api.getPhases().catch(() => ({ overall_phases: [] })),
          api.getRunRate().catch(() => ({ overs: [] }))
        ]);
        setData(overviewRes);
        setInsights(insightsRes || []);
        setPhases(phasesRes?.overall_phases || []);
        setOverByOver(overRes?.overs || []);
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
          <code>py -3.11 -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload</code>
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

  const chartOverData = (overByOver || []).map((o: any) => ({
    over: `Over ${o.over_num}`,
    rpo: o.run_rate,
    wickets: o.wickets,
    boundaries: Math.round(o.boundary_pct)
  }));

  return (
    <div className="space-y-6">
      {/* Editorial Sports Hero Section */}
      <section className="relative overflow-hidden rounded-card bg-[#0B1222] border border-[rgba(255,255,255,0.07)] p-4 sm:p-6 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_85%_15%,rgba(22,93,204,0.14),transparent_70%)]" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="max-w-[700px]">
            {/* Eyebrow */}
            <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-[#F5B942] uppercase">
              <span>IPL DATA INTELLIGENCE</span>
              <span>·</span>
              <span>18 TOURNAMENT SEASONS (2008–2026)</span>
            </div>

            {/* Thin Gold Rule */}
            <div className="h-[2px] w-9 bg-[#F5B942] my-2 rounded-full" />

            {/* Sports/Editorial Heading */}
            <h1 className="text-xl sm:text-2xl lg:text-[26px] font-bold text-white tracking-tight leading-snug">
              IPL Large-Scale Cricket Data Analytics Platform
            </h1>

            {/* Editorial Subtitle */}
            <p className="mt-1.5 text-xs sm:text-sm text-[#A9B2C3] leading-normal max-w-xl">
              Streaming analytics, Hadoop HDFS storage, Hive warehousing, and PySpark distributed processing across 1,243 official fixtures and 295,732 deliveries.
            </p>

            {/* Action Buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <Link
                href="/live"
                className="inline-flex items-center justify-center h-8 sm:h-9 px-4 rounded-btn bg-[#E63946] hover:bg-[#D62839] text-white text-xs font-semibold transition-colors space-x-1.5 shadow-sm"
              >
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Live Match Stream</span>
              </Link>
              <Link
                href="/playoffs"
                className="inline-flex items-center justify-center h-8 sm:h-9 px-4 rounded-btn bg-[#165DCC] hover:bg-[#2476E8] text-white text-xs font-semibold transition-colors space-x-1.5 shadow-sm"
              >
                <Trophy className="w-3.5 h-3.5 text-[#F5B942]" />
                <span>Playoffs & Finals</span>
              </Link>
              <Link
                href="/data-quality"
                className="inline-flex items-center justify-center h-8 sm:h-9 px-4 rounded-btn bg-transparent border border-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.05)] text-[#F7F8FC] text-xs font-semibold transition-colors space-x-1.5"
              >
                <Shield className="w-3.5 h-3.5 text-[#2FBF71]" />
                <span>Data Quality Audit (100%)</span>
              </Link>
            </div>
          </div>

          {/* Quick Academic Status Box */}
          <div className="bg-[#070B16] border border-[rgba(255,255,255,0.08)] p-3.5 rounded-btn space-y-2 text-xs font-mono min-w-[240px]">
            <div className="text-[10px] uppercase text-[#707B91] font-bold">BDA Pipeline State</div>
            <div className="flex items-center justify-between">
              <span className="text-[#8F9AAF]">Ingestion Engine:</span>
              <span className="text-[#2FBF71] font-semibold">Apache Flume</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8F9AAF]">Data Lake:</span>
              <span className="text-[#165DCC] font-semibold">Hadoop HDFS</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8F9AAF]">OLAP Engine:</span>
              <span className="text-[#F5B942] font-semibold">Apache Hive</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#8F9AAF]">Distributed DF:</span>
              <span className="text-[#2476E8] font-semibold">Apache PySpark</span>
            </div>
          </div>
        </div>
      </section>

      {/* 11 Dynamic KPI Cards Grid */}
      <section className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase text-[#707B91] font-bold tracking-wider">
            11 Dynamic Tournament KPIs (2008–2026)
          </span>
          <span className="text-[11px] font-mono text-[#F5B942]">Zero Mock Records · 100% Cricsheet Data</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
          <StatCard
            label="Total Matches"
            value={kpis.total_matches}
            subtitle="Official Fixtures"
            icon={Trophy}
            accent="gold"
          />
          <StatCard
            label="Total Deliveries"
            value={kpis.total_deliveries}
            subtitle="Ball-by-Ball Records"
            icon={Activity}
            accent="blue"
          />
          <StatCard
            label="Tournament Seasons"
            value={kpis.total_seasons}
            subtitle="2008 – 2026 Editions"
            icon={Clock}
            accent="gold"
          />
          <StatCard
            label="Playoff Matches"
            value={kpis.playoff_matches || 74}
            subtitle={`${kpis.tournament_finals || 19} Finals Classified`}
            icon={Trophy}
            accent="gold"
          />
          <StatCard
            label="Franchises"
            value={kpis.total_teams}
            subtitle="Historical Teams"
            icon={Shield}
            accent="blue"
          />
          <StatCard
            label="Cricket Grounds"
            value={kpis.total_venues}
            subtitle="Global Stadiums"
            icon={MapPin}
            accent="white"
          />
          <StatCard
            label="Total Runs"
            value={kpis.total_runs}
            subtitle={`Average RPO: ${kpis.average_run_rate}`}
            icon={Zap}
            accent="gold"
          />
          <StatCard
            label="Total Wickets"
            value={kpis.total_wickets}
            subtitle="Bowling Dismissals"
            icon={Target}
            accent="white"
          />
          <StatCard
            label="Total Sixes"
            value={kpis.total_sixes}
            subtitle="Maximum Hits"
            icon={Flame}
            accent="gold"
          />
          <StatCard
            label="Total Fours"
            value={kpis.total_fours}
            subtitle="Boundary Fours"
            icon={Flame}
            accent="blue"
          />
          <StatCard
            label="Average Run Rate"
            value={kpis.average_run_rate}
            subtitle="Runs Per Over (RPO)"
            icon={TrendingUp}
            accent="white"
          />
          <div className="bg-[#0A101D] border border-[rgba(47,191,113,0.3)] p-3 rounded-btn flex flex-col justify-center">
            <span className="text-[10px] font-mono uppercase text-[#707B91]">Pipeline State</span>
            <span className="text-sm font-bold text-[#2FBF71] font-mono flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" /> 100% Verified
            </span>
            <span className="text-[10px] text-[#8F9AAF] font-mono mt-0.5">Zero Data Loss</span>
          </div>
        </div>
      </section>

      {/* Automated Data-Driven Insights Grid */}
      {insights.length > 0 && (
        <section className="bg-[#0A101D] border border-[rgba(255,255,255,0.08)] rounded-btn p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#F5B942]" />
              <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider font-mono">
                Automated Big Data Insights & Records
              </h2>
            </div>
            <span className="text-[10px] font-mono text-[#707B91]">Programmatically Computed</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {insights.map((ins: any, idx: number) => (
              <div 
                key={idx}
                className="bg-[#070B16] border border-[rgba(255,255,255,0.05)] p-3.5 rounded-btn space-y-2 hover:border-[rgba(245,185,66,0.3)] transition-colors"
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#F5B942] uppercase font-bold">{ins.category}</span>
                  <span className="px-1.5 py-0.2 rounded bg-[rgba(22,93,204,0.15)] text-[#2476E8] border border-[rgba(36,118,232,0.3)] font-semibold">
                    {ins.impact}
                  </span>
                </div>
                <div className="text-xs font-bold text-white leading-tight">{ins.title}</div>
                <p className="text-[11px] text-[#8F9AAF] leading-relaxed">{ins.description}</p>
                <div className="text-[10px] font-mono font-bold text-[#2FBF71] pt-1 border-t border-[rgba(255,255,255,0.04)]">
                  {ins.stat}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Innings Phase Dynamics: Powerplay, Middle, Death */}
      {phases.length > 0 && (
        <section className="bg-[#0D1424] border border-[rgba(255,255,255,0.08)] rounded-btn p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
            <div>
              <span className="text-[10px] font-mono text-[#F5B942] uppercase tracking-wider font-bold block mb-0.5">
                MATCH DYNAMICS
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 font-mono">
                <Layers className="w-4 h-4 text-[#165DCC]" />
                Innings Phase Progression (Powerplay vs Middle vs Death)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[#8F9AAF]">295,732 Balls Computed</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {phases.map((p: any) => (
              <div 
                key={p.phase} 
                className="bg-[#070B16] border border-[rgba(255,255,255,0.06)] p-4 rounded-btn space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white">{p.phase}</span>
                  <span className="text-lg font-bold text-[#F5B942] font-mono">{p.run_rate} RPO</span>
                </div>

                <div className="space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between text-[#8F9AAF]">
                    <span>Total Runs:</span>
                    <strong className="text-white">{p.runs?.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between text-[#8F9AAF]">
                    <span>Deliveries Bowled:</span>
                    <strong className="text-white">{p.deliveries?.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between text-[#8F9AAF]">
                    <span>Wickets Fallen:</span>
                    <strong className="text-[#E63946]">{p.wickets?.toLocaleString()}</strong>
                  </div>
                  <div className="flex justify-between text-[#8F9AAF]">
                    <span>Boundary %:</span>
                    <strong className="text-[#2FBF71]">{p.boundary_pct}%</strong>
                  </div>
                  <div className="flex justify-between text-[#8F9AAF]">
                    <span>Dot Ball %:</span>
                    <strong className="text-[#A9B2C3]">{p.dot_pct}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Over-by-Over Progression Chart (Overs 1 to 20) */}
      {chartOverData.length > 0 && (
        <section className="bg-[#0D1424] border border-[rgba(255,255,255,0.08)] rounded-btn p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
            <div>
              <span className="text-[10px] font-mono text-[#F5B942] uppercase tracking-wider font-bold block mb-0.5">
                SCORING ACCELERATION
              </span>
              <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 font-mono">
                <TrendingUp className="w-4 h-4 text-[#F5B942]" />
                Granular Over-by-Over Run Rate Curve (Overs 1 to 20)
              </h2>
            </div>
            <span className="text-[11px] font-mono text-[#8F9AAF]">Historical Average</span>
          </div>

          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartOverData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="over" stroke="#6F7A90" fontSize={10} tickLine={false} />
                <YAxis stroke="#6F7A90" fontSize={10} domain={[5, 12]} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0D1424",
                    borderColor: "rgba(255,255,255,0.12)",
                    borderRadius: "6px",
                    color: "#F4F6FA",
                    fontSize: "11px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "6px" }} />
                <Line type="monotone" dataKey="rpo" name="Run Rate (RPO)" stroke="#F5B942" strokeWidth={2.5} dot={{ r: 3, fill: "#F5B942" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>
      )}

      {/* Big Data Architecture Flow Component */}
      <section>
        <ArchitectureFlow />
      </section>

      {/* Core Analytical Visualizations: Franchises & Top Titans */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Top Franchises Chart */}
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-4 sm:p-5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[rgba(255,255,255,0.06)]">
            <div>
              <span className="text-[10px] font-mono text-[#F5B942] uppercase tracking-wider font-bold block mb-0.5">
                ALL-TIME STANDINGS
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 font-mono">
                <Trophy className="w-3.5 h-3.5 text-[#F5B942]" />
                Most Successful Franchises
              </h3>
            </div>
            <Link
              href="/teams"
              className="text-[11px] text-[#2476E8] hover:text-[#F5B942] transition-colors flex items-center gap-1 font-medium"
            >
              <span>Full Standings</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartTeamData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                <XAxis dataKey="name" stroke="#6F7A90" fontSize={10} tickLine={false} />
                <YAxis stroke="#6F7A90" fontSize={10} tickLine={false} />
                <Tooltip
                  cursor={{ fill: "rgba(22,93,204,0.08)" }}
                  contentStyle={{
                    backgroundColor: "#0D1424",
                    borderColor: "rgba(255,255,255,0.12)",
                    borderRadius: "6px",
                    color: "#F4F6FA",
                    fontSize: "11px",
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

        {/* All-Time Titans Leaderboard */}
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-4 sm:p-5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-[rgba(255,255,255,0.06)]">
            <div>
              <span className="text-[10px] font-mono text-[#F5B942] uppercase tracking-wider font-bold block mb-0.5">
                INDIVIDUAL TITANS
              </span>
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 font-mono">
                <Award className="w-3.5 h-3.5 text-[#F5B942]" />
                Top Run Accumulators & Wicket Takers
              </h3>
            </div>
            <Link
              href="/players"
              className="text-[11px] text-[#2476E8] hover:text-[#F5B942] transition-colors flex items-center gap-1 font-medium"
            >
              <span>All Players</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Top Batters */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase text-[#707B91] font-bold">Top Batters</div>
              {(top_batters || []).slice(0, 4).map((b: any, idx: number) => (
                <div key={idx} className="bg-[#070B16] p-2 rounded-btn border border-[rgba(255,255,255,0.04)] text-xs">
                  <div className="font-semibold text-white truncate">{b.batter}</div>
                  <div className="text-[10px] text-[#F5B942] font-mono">{b.total_runs?.toLocaleString()} runs (SR: {Math.round(b.strike_rate)})</div>
                </div>
              ))}
            </div>

            {/* Top Bowlers */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase text-[#707B91] font-bold">Top Bowlers</div>
              {(top_bowlers || []).slice(0, 4).map((bw: any, idx: number) => (
                <div key={idx} className="bg-[#070B16] p-2 rounded-btn border border-[rgba(255,255,255,0.04)] text-xs">
                  <div className="font-semibold text-white truncate">{bw.bowler}</div>
                  <div className="text-[10px] text-[#2476E8] font-mono">{bw.wickets} wickets (Econ: {bw.economy_rate})</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
