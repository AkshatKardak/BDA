"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { 
  MapPin, 
  Search, 
  BarChart2,
  Trophy,
  Layers,
  ShieldCheck
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
        <div className="w-10 h-10 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin"></div>
        <p className="text-xs text-[#A9B2C3] font-mono tracking-wider">Loading venue pitch telemetry & coordinates...</p>
      </div>
    );
  }

  const filteredVenues = venues.filter((v: any) => {
    const matchesSearch =
      v.venue.toLowerCase().includes(search.toLowerCase()) ||
      (v.city || "").toLowerCase().includes(search.toLowerCase());
    const matchesFilter = majorOnly ? v.total_matches >= 15 : true;
    return matchesSearch && matchesFilter;
  });

  const chartData = filteredVenues.slice(0, 10).map((v: any) => ({
    name: v.venue
      .split(",")[0]
      .replace("M Chinnaswamy Stadium", "Chinnaswamy")
      .replace("MA Chidambaram Stadium", "Chepauk")
      .replace("Rajiv Gandhi International Stadium", "Uppal")
      .replace("Dr DY Patil Sports Academy", "DY Patil")
      .replace("Himachal Pradesh Cricket Association Stadium", "Dharamshala"),
    avg_1st: Math.round(v.avg_1st_innings_score || 0),
    avg_2nd: Math.round(v.avg_2nd_innings_score || 0),
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[rgba(255,255,255,0.08)] pb-5">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-[#F5B942] uppercase mb-0.5">
            <span>STADIUM TELEMETRY</span>
            <span>·</span>
            <span>60 VENUES</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            IPL Stadium Profiles & Geospatial Pitch Biases
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

      {/* Scoring Comparison Chart for Top Grounds */}
      <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-4 sm:p-5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[rgba(255,255,255,0.06)]">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-[#F5B942]" />
              1st Innings Par Score vs 2nd Innings Score
            </h3>
            <p className="text-[11px] text-[#707B91]">Comparing scoring dynamics across premier IPL grounds</p>
          </div>
        </div>

        <div className="h-56 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="name" stroke="#6F7A90" fontSize={10} tickLine={false} />
              <YAxis stroke="#6F7A90" fontSize={10} domain={[130, 200]} tickLine={false} />
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
              <Bar dataKey="avg_1st" name="1st Innings Avg" fill="#2476E8" radius={[2, 2, 0, 0]} />
              <Bar dataKey="avg_2nd" name="2nd Innings Avg" fill="#F5B942" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMajorOnly(true)}
            className={`h-[30px] px-3 rounded-btn text-xs font-semibold transition-colors ${
              majorOnly
                ? "bg-[#165DCC] text-white"
                : "bg-[#0D1424] text-[#8F9AAF] border border-[rgba(255,255,255,0.08)] hover:text-white"
            }`}
          >
            Major Grounds (≥15 matches)
          </button>
          <button
            onClick={() => setMajorOnly(false)}
            className={`h-[30px] px-3 rounded-btn text-xs font-semibold transition-colors ${
              !majorOnly
                ? "bg-[#165DCC] text-white"
                : "bg-[#0D1424] text-[#8F9AAF] border border-[rgba(255,255,255,0.08)] hover:text-white"
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
            className="w-full bg-[#0D1424] border border-[rgba(255,255,255,0.08)] rounded-btn pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#707B91] focus:outline-none focus:border-[#2476E8]"
          />
        </div>
      </div>

      {/* Stadiums Table */}
      <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)] bg-[#080D19] text-[#707B91] text-[11px]">
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
