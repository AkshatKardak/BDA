"use client";

import React, { useEffect, useState } from "react";
import { 
  Trophy, 
  Flame, 
  Zap, 
  Target, 
  Shield, 
  TrendingUp, 
  Award,
  Crown
} from "lucide-react";
import { api } from "@/lib/api";

export default function LeaderboardsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await api.getLeaderboards();
        setData(res);
      } catch (err) {
        console.error("Failed to load leaderboards:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-xs text-gray-400 font-mono">Loading all-time Big Data leaderboards...</p>
      </div>
    );
  }

  const { most_runs, most_wickets, highest_strike_rate, best_economy, most_sixes, most_fours } = data;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-2">
          <Crown className="w-3.5 h-3.5" />
          Pantheon of Greats (2008–2026)
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          IPL All-Time Leaderboards
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Historical records computed over 295,732 deliveries by PySpark and Hive distributed algorithms.
        </p>
      </div>

      {/* Grid of 6 Leaderboards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* 1. Most Runs */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              Most Career Runs
            </h3>
            <span className="text-[10px] font-mono text-gray-400">All-Time</span>
          </div>
          <div className="divide-y divide-gray-800 text-xs">
            {(most_runs || []).slice(0, 7).map((b: any, idx: number) => (
              <div key={idx} className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                    idx === 0 ? "bg-amber-500 text-black" : "bg-gray-800 text-gray-400"
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-white">{b.batter}</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-emerald-400">{b.total_runs.toLocaleString()}</span>
                  <span className="text-[10px] text-gray-500 ml-1">({b.innings} inngs)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Most Wickets */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-purple-400" />
              Most Career Wickets
            </h3>
            <span className="text-[10px] font-mono text-gray-400">All-Time</span>
          </div>
          <div className="divide-y divide-gray-800 text-xs">
            {(most_wickets || []).slice(0, 7).map((bw: any, idx: number) => (
              <div key={idx} className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                    idx === 0 ? "bg-purple-500 text-white" : "bg-gray-800 text-gray-400"
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-white">{bw.bowler}</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-purple-400">{bw.wickets}</span>
                  <span className="text-[10px] text-gray-500 ml-1">({bw.matches} mtchs)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Highest Strike Rate */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-400" />
              Highest Strike Rate
            </h3>
            <span className="text-[10px] font-mono text-gray-400">Min 1,500 Runs</span>
          </div>
          <div className="divide-y divide-gray-800 text-xs">
            {(highest_strike_rate || []).slice(0, 7).map((b: any, idx: number) => (
              <div key={idx} className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                    idx === 0 ? "bg-emerald-500 text-black" : "bg-gray-800 text-gray-400"
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-white">{b.batter}</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-white">{b.strike_rate}</span>
                  <span className="text-[10px] text-emerald-400 ml-1">SR</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Best Economy Rate */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-400" />
              Best Economy Rate
            </h3>
            <span className="text-[10px] font-mono text-gray-400">Min 50 Wickets</span>
          </div>
          <div className="divide-y divide-gray-800 text-xs">
            {(best_economy || []).slice(0, 7).map((bw: any, idx: number) => (
              <div key={idx} className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                    idx === 0 ? "bg-blue-500 text-white" : "bg-gray-800 text-gray-400"
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-white">{bw.bowler}</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-blue-400">{bw.economy_rate}</span>
                  <span className="text-[10px] text-gray-500 ml-1">RPO</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Most Sixes */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              Most Career Sixes
            </h3>
            <span className="text-[10px] font-mono text-gray-400">Maximums</span>
          </div>
          <div className="divide-y divide-gray-800 text-xs">
            {(most_sixes || []).slice(0, 7).map((b: any, idx: number) => (
              <div key={idx} className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                    idx === 0 ? "bg-amber-600 text-white" : "bg-gray-800 text-gray-400"
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-white">{b.batter}</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-amber-400">{b.sixes}</span>
                  <span className="text-[10px] text-gray-500 ml-1">sixes</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Most Fours */}
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3 mb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Most Career Fours
            </h3>
            <span className="text-[10px] font-mono text-gray-400">Boundaries</span>
          </div>
          <div className="divide-y divide-gray-800 text-xs">
            {(most_fours || []).slice(0, 7).map((b: any, idx: number) => (
              <div key={idx} className="py-2 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
                    idx === 0 ? "bg-cyan-600 text-white" : "bg-gray-800 text-gray-400"
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-white">{b.batter}</span>
                </div>
                <div className="text-right font-mono">
                  <span className="font-bold text-cyan-400">{b.fours}</span>
                  <span className="text-[10px] text-gray-500 ml-1">fours</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
