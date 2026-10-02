"use client";

import React, { useEffect, useState } from "react";
import { 
  MapPin, 
  Search, 
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
        <div className="w-10 h-10 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin"></div>
        <p className="text-xs text-[#A9B2C3] font-mono tracking-wider">Loading venue pitch telemetry...</p>
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
    avg_1st: v.avg_1st_innings_score,
    avg_2nd: v.avg_2nd_innings_score,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-widest text-[#F5B942] uppercase mb-1">
          <span>STADIUM TELEMETRY</span>
          <span>·</span>
          <span>60 VENUES</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          IPL Stadium Profiles & Ground Pitch Biases
        </h1>
        <p className="text-xs text-[#A9B2C3] mt-1 max-w-3xl leading-relaxed">
          Par scores, defending vs chasing records, and ground characteristics across 60 historic IPL cricket grounds.
        </p>
      </div>

      {/* Scoring Comparison Chart for Top Grounds */}
      <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[rgba(255,255,255,0.06)]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#F5B942]" />
              1st Innings Par Score vs 2nd Innings Score
            </h3>
            <p className="text-xs text-[#707B91]">Comparing scoring dynamics across premier IPL grounds</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
              <XAxis dataKey="name" stroke="#6F7A90" fontSize={10} tickLine={false} />
              <YAxis stroke="#6F7A90" fontSize={11} domain={[130, 200]} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0D1424",
                  borderColor: "rgba(255,255,255,0.12)",
                  borderRadius: "8px",
                  color: "#F4F6FA",
                  fontSize: "12px",
                }}
              />
              <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
              <Bar dataKey="avg_1st" name="1st Innings Avg" fill="#2476E8" radius={[3, 3, 0, 0]} />
              <Bar dataKey="avg_2nd" name="2nd Innings Avg" fill="#F5B942" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setMajorOnly(true)}
            className={`h-[36px] px-3.5 rounded-btn text-xs font-semibold transition-colors ${
              majorOnly
                ? "bg-[#165DCC] text-white"
                : "bg-[#0D1424] text-[#8F9AAF] border border-[rgba(255,255,255,0.08)] hover:text-white"
            }`}
          >
            Major Grounds (≥15 matches)
          </button>
          <button
            onClick={() => setMajorOnly(false)}
            className={`h-[36px] px-3.5 rounded-btn text-xs font-semibold transition-colors ${
              !majorOnly
                ? "bg-[#165DCC] text-white"
                : "bg-[#0D1424] text-[#8F9AAF] border border-[rgba(255,255,255,0.08)] hover:text-white"
            }`}
          >
            All 60 Stadiums
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#707B91]" />
          <input
            type="text"
            placeholder="Search venue or city..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#0D1424] border border-[rgba(255,255,255,0.08)] rounded-btn pl-9 pr-4 py-2 text-xs text-white placeholder-[#707B91] focus:outline-none focus:border-[#2476E8]"
          />
        </div>
      </div>

      {/* Stadiums Table */}
      <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090E1B] text-[#707B91] font-mono uppercase text-[10px] tracking-wider border-b border-[rgba(255,255,255,0.06)]">
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
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-[#F4F6FA]">
              {filteredVenues.map((v: any, idx: number) => {
                const isChasingGround = v.chase_win_pct >= 55.0;
                const isDefendingGround = v.bat_first_win_pct >= 55.0;
                return (
                  <tr key={idx} className="hover:bg-[rgba(22,93,204,0.08)] transition-colors">
                    <td className="py-3 px-4 font-bold text-white">{v.venue}</td>
                    <td className="py-3 px-4 text-[#A9B2C3]">{v.city || "—"}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-white">{v.total_matches}</td>
                    <td className="py-3 px-4 text-center font-mono text-[#2476E8]">
                      {v.bat_first_win_pct}% ({v.bat_first_wins})
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[#F5B942]">
                      {v.chase_win_pct}% ({v.chase_wins})
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-white">{v.avg_1st_innings_score}</td>
                    <td className="py-3 px-4 text-center font-mono text-[#A9B2C3]">{v.avg_2nd_innings_score}</td>
                    <td className="py-3 px-4 text-center font-mono">
                      {isChasingGround ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[rgba(245,185,66,0.12)] text-[#F5B942] border border-[rgba(245,185,66,0.25)]">
                          Chasing Bias
                        </span>
                      ) : isDefendingGround ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[rgba(36,118,232,0.15)] text-[#2476E8] border border-[rgba(36,118,232,0.25)]">
                          Defending Bias
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] text-[#707B91] bg-[#111A2E]">
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
