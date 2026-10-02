"use client";

import React, { useEffect, useState } from "react";
import { 
  Trophy, 
  Flame, 
  Zap, 
  Target, 
  Shield, 
  TrendingUp, 
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
        <div className="w-10 h-10 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin"></div>
        <p className="text-xs text-[#A9B2C3] font-mono tracking-wider">Loading all-time leaderboards...</p>
      </div>
    );
  }

  const { most_runs, most_wickets, highest_strike_rate, best_economy, most_sixes, most_fours } = data;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-[#F5B942] uppercase mb-0.5">
          <span>ALL-TIME TITANS</span>
          <span>·</span>
          <span>2008–2026</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          IPL All-Time Leaderboards
        </h1>
        <p className="text-[11px] text-[#A9B2C3] mt-0.5 max-w-3xl leading-relaxed">
          Historical records computed over 295,732 deliveries by PySpark and Hive distributed algorithms.
        </p>
      </div>

      {/* Grid of 6 Leaderboards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 1. Most Runs */}
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-3.5 sm:p-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2 mb-2">
            <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#F5B942]" />
              Most Career Runs
            </h2>
            <span className="text-[9px] font-mono text-[#707B91]">All-Time</span>
          </div>
          <div className="divide-y divide-[rgba(255,255,255,0.04)] text-xs">
            {(most_runs || []).slice(0, 7).map((b: any, idx: number) => (
              <div key={idx} className="py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-4 h-4 rounded-btn flex items-center justify-center font-mono font-bold text-[9px] ${
                    idx === 0 ? "bg-[#F5B942] text-[#070B16]" : "bg-[#111A2E] text-[#707B91]"
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-medium text-white truncate text-[11px] sm:text-xs">{b.batter}</span>
                </div>
                <div className="text-right font-mono flex-shrink-0 pl-2">
                  <span className="font-bold text-white text-[11px] sm:text-xs">{b.total_runs.toLocaleString()}</span>
                  <span className="text-[9px] text-[#707B91] ml-1">({b.innings} inngs)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 2. Most Wickets */}
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-3.5 sm:p-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2 mb-2">
            <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[#2476E8]" />
              Most Career Wickets
            </h2>
            <span className="text-[9px] font-mono text-[#707B91]">All-Time</span>
          </div>
          <div className="divide-y divide-[rgba(255,255,255,0.04)] text-xs">
            {(most_wickets || []).slice(0, 7).map((bw: any, idx: number) => (
              <div key={idx} className="py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-4 h-4 rounded-btn flex items-center justify-center font-mono font-bold text-[9px] ${
                    idx === 0 ? "bg-[#F5B942] text-[#070B16]" : "bg-[#111A2E] text-[#707B91]"
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-medium text-white truncate text-[11px] sm:text-xs">{bw.bowler}</span>
                </div>
                <div className="text-right font-mono flex-shrink-0 pl-2">
                  <span className="font-bold text-white text-[11px] sm:text-xs">{bw.wickets}</span>
                  <span className="text-[9px] text-[#707B91] ml-1">({bw.matches} mtchs)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Highest Strike Rate */}
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-3.5 sm:p-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2 mb-2">
            <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#F5B942]" />
              Highest Strike Rate
            </h2>
            <span className="text-[9px] font-mono text-[#707B91]">Min 1,500 Runs</span>
          </div>
          <div className="divide-y divide-[rgba(255,255,255,0.04)] text-xs">
            {(highest_strike_rate || []).slice(0, 7).map((b: any, idx: number) => (
              <div key={idx} className="py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-4 h-4 rounded-btn flex items-center justify-center font-mono font-bold text-[9px] ${
                    idx === 0 ? "bg-[#F5B942] text-[#070B16]" : "bg-[#111A2E] text-[#707B91]"
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-medium text-white truncate text-[11px] sm:text-xs">{b.batter}</span>
                </div>
                <div className="text-right font-mono flex-shrink-0 pl-2">
                  <span className="font-bold text-[#F5B942] text-[11px] sm:text-xs">{b.strike_rate}</span>
                  <span className="text-[9px] text-[#707B91] ml-1">SR</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Best Economy Rate */}
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-3.5 sm:p-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2 mb-2">
            <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-[#2476E8]" />
              Best Economy Rate
            </h2>
            <span className="text-[9px] font-mono text-[#707B91]">Min 50 Wickets</span>
          </div>
          <div className="divide-y divide-[rgba(255,255,255,0.04)] text-xs">
            {(best_economy || []).slice(0, 7).map((bw: any, idx: number) => (
              <div key={idx} className="py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-4 h-4 rounded-btn flex items-center justify-center font-mono font-bold text-[9px] ${
                    idx === 0 ? "bg-[#F5B942] text-[#070B16]" : "bg-[#111A2E] text-[#707B91]"
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-medium text-white truncate text-[11px] sm:text-xs">{bw.bowler}</span>
                </div>
                <div className="text-right font-mono flex-shrink-0 pl-2">
                  <span className="font-bold text-[#2476E8] text-[11px] sm:text-xs">{bw.economy_rate}</span>
                  <span className="text-[9px] text-[#707B91] ml-1">RPO</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Most Sixes */}
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-3.5 sm:p-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2 mb-2">
            <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-[#F5B942]" />
              Most Career Sixes
            </h2>
            <span className="text-[9px] font-mono text-[#707B91]">Maximums</span>
          </div>
          <div className="divide-y divide-[rgba(255,255,255,0.04)] text-xs">
            {(most_sixes || []).slice(0, 7).map((b: any, idx: number) => (
              <div key={idx} className="py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-4 h-4 rounded-btn flex items-center justify-center font-mono font-bold text-[9px] ${
                    idx === 0 ? "bg-[#F5B942] text-[#070B16]" : "bg-[#111A2E] text-[#707B91]"
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-medium text-white truncate text-[11px] sm:text-xs">{b.batter}</span>
                </div>
                <div className="text-right font-mono flex-shrink-0 pl-2">
                  <span className="font-bold text-[#F5B942] text-[11px] sm:text-xs">{b.sixes}</span>
                  <span className="text-[9px] text-[#707B91] ml-1">sixes</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 6. Most Fours */}
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-3.5 sm:p-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-2 mb-2">
            <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#2476E8]" />
              Most Career Fours
            </h2>
            <span className="text-[9px] font-mono text-[#707B91]">Boundaries</span>
          </div>
          <div className="divide-y divide-[rgba(255,255,255,0.04)] text-xs">
            {(most_fours || []).slice(0, 7).map((b: any, idx: number) => (
              <div key={idx} className="py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`w-4 h-4 rounded-btn flex items-center justify-center font-mono font-bold text-[9px] ${
                    idx === 0 ? "bg-[#F5B942] text-[#070B16]" : "bg-[#111A2E] text-[#707B91]"
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-medium text-white truncate text-[11px] sm:text-xs">{b.batter}</span>
                </div>
                <div className="text-right font-mono flex-shrink-0 pl-2">
                  <span className="font-bold text-white text-[11px] sm:text-xs">{b.fours}</span>
                  <span className="text-[9px] text-[#707B91] ml-1">fours</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
