"use client";

import React, { useEffect, useState } from "react";
import { 
  MapPin, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  Search, 
  Flame, 
  BarChart2
} from "lucide-react";
import { api } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";

export default function VenuesPage() {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [majorOnly, setMajorOnly] = useState(true);

  useEffect(() => {
    async function loadVenues() {
      try {
        setLoading(true);
        const res = await api.getVenues();
        setVenues(res.venues || []);
      } catch (err) {
        console.error("Failed to load venues:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVenues();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-xs text-gray-400 font-mono">Loading venue pitch telemetry...</p>
      </div>
    );
  }

  const filteredVenues = venues.filter((v: any) => {
    const matchesSearch = v.venue.toLowerCase().includes(search.toLowerCase()) || 
                          (v.city || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = majorOnly ? v.total_matches >= 15 : true;
    return matchesSearch && matchesFilter;
  });

  const chartData = filteredVenues.slice(0, 10).map((v: any) => ({
    name: v.venue.split(",")[0].replace("M Chinnaswamy Stadium", "Chinnaswamy").replace("MA Chidambaram Stadium", "Chepauk").replace("Rajiv Gandhi International Stadium", "Uppal").replace("Dr DY Patil Sports Academy", "DY Patil").replace("Himachal Pradesh Cricket Association Stadium", "Dharamshala"),
    avg_1st: v.avg_1st_innings_score,
    avg_2nd: v.avg_2nd_innings_score
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-2">
          <MapPin className="w-3.5 h-3.5" />
          Stadium Telemetry & Pitch Profiles
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          IPL Stadium & Venue Insights (2008–2026)
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Scoring averages, bat-first vs chasing biases, and historic score extremes across 60 grounds.
        </p>
      </div>

      {/* Scoring Comparison Chart for Top Grounds */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-emerald-400" />
              1st Innings Par Score vs 2nd Innings Score
            </h3>
            <p className="text-xs text-gray-400">Comparing run dynamics across premier IPL venues</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={10} />
              <YAxis stroke="#9CA3AF" fontSize={11} domain={[130, 200]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#111827",
                  borderColor: "#374151",
                  borderRadius: "8px",
                  color: "#F3F4F6",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Bar dataKey="avg_1st" name="Avg 1st Innings Runs" fill="#3B82F6" radius={[3, 3, 0, 0]} />
              <Bar dataKey="avg_2nd" name="Avg 2nd Innings Runs" fill="#10B981" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMajorOnly(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              majorOnly
                ? "bg-emerald-600 text-white"
                : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white"
            }`}
          >
            Major Stadiums (≥15 matches)
          </button>
          <button
            onClick={() => setMajorOnly(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              !majorOnly
                ? "bg-emerald-600 text-white"
                : "bg-gray-900 text-gray-400 border border-gray-800 hover:text-white"
            }`}
          >
            All 60 Stadiums
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search venue or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-900/80 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Stadiums Table */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 overflow-hidden backdrop-blur-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-800/50 text-gray-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Stadium Name</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4 text-center">Fixtures</th>
                <th className="py-3 px-4 text-center">Bat 1st Win %</th>
                <th className="py-3 px-4 text-center">Chase Win %</th>
                <th className="py-3 px-4 text-center">Avg 1st Inn</th>
                <th className="py-3 px-4 text-center">Avg 2nd Inn</th>
                <th className="py-3 px-4 text-center">Ground Bias</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {filteredVenues.map((v: any, idx: number) => {
                const isChasingGround = v.chase_win_pct >= 55.0;
                const isDefendingGround = v.bat_first_win_pct >= 55.0;
                return (
                  <tr key={idx} className="hover:bg-gray-800/40">
                    <td className="py-3 px-4 font-bold text-white">{v.venue}</td>
                    <td className="py-3 px-4 text-gray-400">{v.city || "—"}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold">{v.total_matches}</td>
                    <td className="py-3 px-4 text-center font-mono text-blue-400">
                      {v.bat_first_win_pct}% ({v.bat_first_wins})
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-emerald-400">
                      {v.chase_win_pct}% ({v.chase_wins})
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{v.avg_1st_innings_score}</td>
                    <td className="py-3 px-4 text-center font-mono">{v.avg_2nd_innings_score}</td>
                    <td className="py-3 px-4 text-center font-mono">
                      {isChasingGround ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Chasing Bias
                        </span>
                      ) : isDefendingGround ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          Defending Bias
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] text-gray-400 bg-gray-800">
                          Balanced
                        </span>
                      )}
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
