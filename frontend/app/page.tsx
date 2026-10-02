"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Trophy, 
  Flame, 
  Target, 
  Compass, 
  TrendingUp, 
  Award, 
  Activity, 
  ArrowRight,
  Database,
  Shield,
  Zap
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-sm text-gray-400 font-mono">Loading IPL Big Data Analytics Lake...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-8 text-center max-w-2xl mx-auto my-12">
        <Flame className="w-10 h-10 text-red-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white mb-2">Backend Connection Notice</h3>
        <p className="text-sm text-gray-300 mb-6">{error}</p>
        <div className="bg-black/40 rounded-lg p-4 font-mono text-xs text-left text-gray-300 mb-6 overflow-x-auto">
          <code>uvicorn backend.main:app --port 8000 --reload</code>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { kpis, top_teams, top_batters, top_bowlers, recent_seasons } = data;

  const chartTeamData = (top_teams || []).map((t: any) => ({
    name: t.team.replace("Royal Challengers Bengaluru", "RCB").replace("Chennai Super Kings", "CSK").replace("Mumbai Indians", "MI").replace("Kolkata Knight Riders", "KKR").replace("Delhi Capitals", "DC"),
    wins: t.wins,
    win_pct: t.win_pct
  }));

  const seasonTrendData = (recent_seasons || []).map((s: any) => ({
    season: s.season.toString(),
    rpo: s.run_rate,
    runs: s.total_runs
  }));

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-950/40 via-gray-900 to-emerald-950/30 border border-gray-800 p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-4">
            <Shield className="w-3.5 h-3.5" />
            Verified Apache Big Data Ecosystem Pipeline
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
            IPL Large-Scale Cricket Data Analytics
          </h1>
          <p className="mt-3 text-sm text-gray-300 leading-relaxed">
            Streaming data capture and distributed analysis across <strong className="text-white">1,243 genuine matches</strong> and <strong className="text-emerald-400">295,732 ball-by-ball deliveries</strong> from 2008 through 2026.
            Powered by Apache Flume, Hadoop HDFS, Hive ORC warehousing, and PySpark distributed transformations.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/teams"
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-600/20"
          >
            Explore Franchises <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/pipeline"
            className="px-4 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700 text-xs font-bold transition-colors flex items-center gap-1.5"
          >
            <Database className="w-3.5 h-3.5 text-amber-400" />
            View Big Data Architecture
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard
          label="Total Matches"
          value={kpis.total_matches}
          subtitle="2008–2026 Editions"
          icon={Trophy}
          color="emerald"
        />
        <StatCard
          label="Total Deliveries"
          value={kpis.total_deliveries}
          subtitle="Genuine Cricsheet Records"
          icon={Activity}
          color="blue"
        />
        <StatCard
          label="Total Runs"
          value={kpis.total_runs}
          subtitle={`Avg RPO: ${kpis.average_run_rate}`}
          icon={Zap}
          color="amber"
        />
        <StatCard
          label="Total Wickets"
          value={kpis.total_wickets}
          subtitle="Across All Innings"
          icon={Target}
          color="purple"
        />
        <StatCard
          label="Total Sixes"
          value={kpis.total_sixes}
          subtitle={`Fours: ${kpis.total_fours.toLocaleString()}`}
          icon={Flame}
          color="cyan"
        />
        <StatCard
          label="Franchises"
          value={kpis.total_teams}
          subtitle={`${kpis.total_venues} Historic Venues`}
          icon={Shield}
          color="emerald"
        />
      </div>

      {/* Architecture Flow Banner */}
      <ArchitectureFlow />

      {/* Analytics Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Franchises Chart */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-400" />
                All-Time Most Successful Franchises
              </h3>
              <p className="text-xs text-gray-400">Total match victories (2008–2026)</p>
            </div>
            <Link href="/teams" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
              Full Standings <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartTeamData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="name" stroke="#9CA3AF" fontSize={11} />
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
                <Bar dataKey="wins" fill="#10B981" radius={[4, 4, 0, 0]}>
                  {chartTeamData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#10B981" : index === 1 ? "#3B82F6" : "#6366F1"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Season Run Rate Evolution */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                Recent Scoring Evolution (Runs Per Over)
              </h3>
              <p className="text-xs text-gray-400">Scoring intensity across recent seasons</p>
            </div>
            <Link href="/seasons" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
              All 18 Seasons <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={seasonTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis dataKey="season" stroke="#9CA3AF" fontSize={11} />
                <YAxis stroke="#9CA3AF" fontSize={11} domain={[7.5, 10.5]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#111827",
                    borderColor: "#374151",
                    borderRadius: "8px",
                    color: "#F3F4F6",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="rpo"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#F59E0B" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Players Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top 5 Batters */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              All-Time Top Run Scorers (Orange Cap Titans)
            </h3>
            <Link href="/players?role=batter" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {top_batters.map((b: any, idx: number) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center font-mono font-bold text-emerald-400">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-white text-sm">{b.batter}</p>
                    <p className="text-gray-400">{b.innings} innings · SR {b.strike_rate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-white text-sm">{b.total_runs.toLocaleString()}</span>
                  <p className="text-[11px] text-gray-500">{b.fours} 4s · {b.sixes} 6s</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Bowlers */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              All-Time Top Wicket Takers (Purple Cap Titans)
            </h3>
            <Link href="/players?role=bowler" className="text-xs text-emerald-400 hover:underline flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {top_bowlers.map((bw: any, idx: number) => (
              <div key={idx} className="py-3 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center font-mono font-bold text-purple-400">
                    {idx + 1}
                  </span>
                  <div>
                    <p className="font-bold text-white text-sm">{bw.bowler}</p>
                    <p className="text-gray-400">{bw.matches} matches · Econ {bw.economy_rate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-purple-400 text-sm">{bw.wickets} wkts</span>
                  <p className="text-[11px] text-gray-500">{bw.dot_balls.toLocaleString()} dots</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
