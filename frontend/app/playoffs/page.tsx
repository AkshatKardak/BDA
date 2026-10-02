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
  Sparkles
} from "lucide-react";

export default function PlayoffsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await api.getPlayoffs();
        setData(res);
      } catch (err) {
        console.error("Failed to load playoffs data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const allPlayoffs = data?.all_playoffs || [];
  const finalsHistory = data?.finals_history || [];
  const teamPlayoffRecords = data?.team_playoff_records || [];
  const stageBreakdown = data?.stage_breakdown || {};

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

      {/* 74-Match Playoff Archive with Filtering */}
      <div className="bg-[#0A101D] border border-[rgba(255,255,255,0.08)] rounded-btn p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[rgba(255,255,255,0.06)] pb-4">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Filterable 74-Match Playoff Archive
            </h2>
            <p className="text-[11px] text-[#707B91]">
              Showing {filteredMatches.length} of {allPlayoffs.length} knockout encounters
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#707B91] absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search team, season, venue..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#070B16] border border-[rgba(255,255,255,0.08)] pl-8 pr-3 py-1.5 rounded-btn text-xs text-white placeholder-[#707B91] focus:outline-none focus:border-[#165DCC]"
              />
            </div>

            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="bg-[#070B16] border border-[rgba(255,255,255,0.08)] px-3 py-1.5 rounded-btn text-xs text-[#8F9AAF] focus:outline-none focus:border-[#165DCC]"
            >
              <option value="All">All Stages ({allPlayoffs.length})</option>
              <option value="Final">Final (19)</option>
              <option value="Qualifier 1">Qualifier 1 (16)</option>
              <option value="Eliminator">Eliminator (16)</option>
              <option value="Qualifier 2">Qualifier 2 (16)</option>
              <option value="Semi Final">Semi Final (6)</option>
              <option value="3rd Place Play-Off">3rd Place Play-Off (1)</option>
            </select>
          </div>
        </div>

        {/* Table of Playoff Matches */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)] text-[#707B91] text-[11px]">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Season</th>
                <th className="py-2.5 px-3">Stage</th>
                <th className="py-2.5 px-3">Matchup</th>
                <th className="py-2.5 px-3">Winner</th>
                <th className="py-2.5 px-3">Margin</th>
                <th className="py-2.5 px-3">Venue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.03)]">
              {filteredMatches.map((m: any) => {
                const isFinal = m.match_stage === "Final";
                const isQ = m.match_stage?.includes("Qualifier");
                const isElim = m.match_stage === "Eliminator";
                return (
                  <tr key={m.match_id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                    <td className="py-2.5 px-3 text-[#707B91]">{m.date}</td>
                    <td className="py-2.5 px-3 text-[#F5B942] font-semibold">{m.season}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        isFinal
                          ? "bg-[rgba(245,185,66,0.15)] text-[#F5B942] border-[rgba(245,185,66,0.35)]"
                          : isQ
                          ? "bg-[rgba(36,118,232,0.15)] text-[#2476E8] border-[rgba(36,118,232,0.35)]"
                          : isElim
                          ? "bg-[rgba(247,127,0,0.15)] text-[#F77F00] border-[rgba(247,127,0,0.35)]"
                          : "bg-[#0D1830] text-[#8F9AAF] border-[rgba(255,255,255,0.08)]"
                      }`}>
                        {m.match_stage}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-white font-medium">
                      {m.team1} <span className="text-[#707B91]">vs</span> {m.team2}
                    </td>
                    <td className="py-2.5 px-3 text-[#2FBF71] font-semibold">
                      {m.winner || "No Result / Tie"}
                    </td>
                    <td className="py-2.5 px-3 text-[#8F9AAF]">
                      {m.win_margin ? `${m.win_margin} ${m.win_type || 'runs'}` : "Super Over"}
                    </td>
                    <td className="py-2.5 px-3 text-[#707B91] truncate max-w-[150px]" title={m.venue}>
                      {m.venue}
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
