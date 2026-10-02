"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Trophy, 
  Swords, 
  Calendar,
  ArrowRight
} from "lucide-react";
import { api } from "@/lib/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [teamDetail, setTeamDetail] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    async function loadTeams() {
      try {
        setLoading(true);
        const res = await api.getTeams();
        setTeams(res.franchises || []);
        if (res.franchises && res.franchises.length > 0) {
          handleSelectTeam(res.franchises[0].team);
        }
      } catch (err) {
        console.error("Failed to load teams:", err);
      } finally {
        setLoading(false);
      }
    }
    loadTeams();
  }, []);

  const handleSelectTeam = async (teamName: string) => {
    try {
      setDetailLoading(true);
      const detail = await api.getTeamDetail(teamName);
      setSelectedTeam(teamName);
      setTeamDetail(detail);
    } catch (err) {
      console.error(`Failed to load details for ${teamName}:`, err);
    } finally {
      setDetailLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin"></div>
        <p className="text-xs text-[#A9B2C3] font-mono tracking-wider">Loading franchise standings...</p>
      </div>
    );
  }

  const seasonChartData = (teamDetail?.season_history || []).map((s: any) => ({
    season: s.season.toString(),
    wins: s.wins,
    matches: s.matches,
    win_pct: s.season_win_pct,
  }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-[#F5B942] uppercase mb-0.5">
          <span>FRANCHISE INTELLIGENCE</span>
          <span>·</span>
          <span>2008–2026</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          IPL Franchise Records & Head-to-Head Analytics
        </h1>
        <p className="text-xs text-[#A9B2C3] mt-0.5 max-w-3xl leading-normal">
          Historical win percentages, batting first vs chasing defense ratios, and head-to-head match outcomes across 15 franchises.
        </p>
      </div>

      {/* Standings Table */}
      <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <div className="p-3 sm:p-3.5 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-[#F5B942]" />
            All-Time Franchise Standings
          </h2>
          <span className="text-[10px] text-[#707B91] font-mono hidden sm:inline">
            Click any row to view season charts and rivalries
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#090E1B] text-[#707B91] font-mono uppercase text-[10px] tracking-wider border-b border-[rgba(255,255,255,0.06)]">
              <tr>
                <th className="py-2 px-3">#</th>
                <th className="py-2 px-3">Franchise</th>
                <th className="py-2 px-3 text-center">Played</th>
                <th className="py-2 px-3 text-center">Wins</th>
                <th className="py-2 px-3 text-center">Losses</th>
                <th className="py-2 px-3 text-center">Win %</th>
                <th className="py-2 px-3 text-center">Bat 1st Win %</th>
                <th className="py-2 px-3 text-center">Chase Win %</th>
                <th className="py-2 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-[#F4F6FA]">
              {teams.map((t, idx) => {
                const isSelected = selectedTeam === t.team;
                return (
                  <tr
                    key={t.team}
                    onClick={() => handleSelectTeam(t.team)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-[rgba(22,93,204,0.14)] border-l-4 border-l-[#F5B942]"
                        : "hover:bg-[rgba(255,255,255,0.02)]"
                    }`}
                  >
                    <td className="py-2 px-3 font-mono font-bold text-[#707B91]">{idx + 1}</td>
                    <td className="py-2 px-3 font-bold text-white flex items-center gap-1.5">
                      <span>{t.team}</span>
                      {idx === 0 && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-[rgba(245,185,66,0.12)] text-[#F5B942] border border-[rgba(245,185,66,0.25)] font-mono font-bold">
                          Leader
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center font-mono">{t.matches_played}</td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-white">{t.wins}</td>
                    <td className="py-2 px-3 text-center font-mono text-[#707B91]">{t.losses}</td>
                    <td className="py-2 px-3 text-center font-mono font-bold text-[#F5B942]">
                      {t.win_pct}%
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-[#A9B2C3]">
                      {t.bat_first_win_pct}% <span className="text-[#707B91]">({t.bat_first_wins})</span>
                    </td>
                    <td className="py-2 px-3 text-center font-mono text-[#A9B2C3]">
                      {t.chase_win_pct}% <span className="text-[#707B91]">({t.chase_wins})</span>
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        className={`h-[24px] px-2.5 rounded-btn text-[10px] font-semibold transition-colors ${
                          isSelected
                            ? "bg-[#165DCC] text-white"
                            : "bg-[#111A2E] text-[#A9B2C3] hover:text-white"
                        }`}
                      >
                        {isSelected ? "Inspecting" : "Select"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Team Deep Dive */}
      {selectedTeam && teamDetail && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[rgba(255,255,255,0.06)]">
            <div>
              <span className="text-[10px] font-mono text-[#F5B942] uppercase tracking-wider font-bold block mb-0.5">
                DEEP DIVE TELEMETRY
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white flex items-center gap-1.5">
                <Users className="w-4 h-4 text-[#2476E8]" />
                {selectedTeam}
              </h2>
            </div>
            {detailLoading && (
              <span className="text-xs text-[#F5B942] font-mono animate-pulse">
                Updating...
              </span>
            )}
          </div>

          {/* Snapshot KPI Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-3 sm:p-3.5">
              <p className="text-[10px] text-[#707B91] uppercase font-mono font-semibold">Total Fixtures</p>
              <p className="text-xl font-bold text-white font-sans mt-0.5">{teamDetail.matches_played}</p>
              <p className="text-[10px] text-[#A9B2C3] mt-0.5">{teamDetail.wins} Wins · {teamDetail.losses} Losses</p>
            </div>
            <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-3 sm:p-3.5">
              <p className="text-[10px] text-[#707B91] uppercase font-mono font-semibold">Overall Win Rate</p>
              <p className="text-xl font-bold text-[#F5B942] font-sans mt-0.5">{teamDetail.win_pct}%</p>
              <p className="text-[10px] text-[#707B91] mt-0.5">Across all editions</p>
            </div>
            <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-3 sm:p-3.5">
              <p className="text-[10px] text-[#707B91] uppercase font-mono font-semibold">Defending (Bat 1st)</p>
              <p className="text-xl font-bold text-[#2476E8] font-sans mt-0.5">{teamDetail.bat_first_win_pct}%</p>
              <p className="text-[10px] text-[#A9B2C3] mt-0.5">{teamDetail.bat_first_wins} Wins Defending</p>
            </div>
            <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-3 sm:p-3.5">
              <p className="text-[10px] text-[#707B91] uppercase font-mono font-semibold">Chasing (Field 1st)</p>
              <p className="text-xl font-bold text-white font-sans mt-0.5">{teamDetail.chase_win_pct}%</p>
              <p className="text-[10px] text-[#A9B2C3] mt-0.5">{teamDetail.chase_wins} Wins Chasing</p>
            </div>
          </div>

          {/* Season-by-Season Progression Chart */}
          {seasonChartData.length > 0 && (
            <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-4 sm:p-5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
              <h3 className="text-xs sm:text-sm font-bold text-white mb-3 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#F5B942]" />
                Season-by-Season Win Percentage Progression
              </h3>
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={seasonChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis dataKey="season" stroke="#6F7A90" fontSize={10} tickLine={false} />
                    <YAxis stroke="#6F7A90" fontSize={10} domain={[0, 100]} tickLine={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0D1424",
                        borderColor: "rgba(255,255,255,0.12)",
                        borderRadius: "6px",
                        color: "#F4F6FA",
                        fontSize: "11px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="win_pct"
                      name="Win %"
                      stroke="#F5B942"
                      strokeWidth={2}
                      dot={{ r: 3, fill: "#F5B942" }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Head-to-Head Rivalries */}
          <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
            <div className="p-3 sm:p-3.5 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                <Swords className="w-3.5 h-3.5 text-[#F5B942]" />
                Head-to-Head Matchups vs Other Franchises
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#090E1B] text-[#707B91] font-mono uppercase text-[10px] tracking-wider border-b border-[rgba(255,255,255,0.06)]">
                  <tr>
                    <th className="py-2 px-3">Opponent</th>
                    <th className="py-2 px-3 text-center">Played</th>
                    <th className="py-2 px-3 text-center">{selectedTeam} Wins</th>
                    <th className="py-2 px-3 text-center">Opponent Wins</th>
                    <th className="py-2 px-3 text-center">Win Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-[#F4F6FA]">
                  {(teamDetail.h2h_rivalries || []).map((h: any, idx: number) => {
                    const isTeamA = h.team_a === selectedTeam;
                    const opponent = isTeamA ? h.team_b : h.team_a;
                    const myWins = isTeamA ? h.team_a_wins : h.team_b_wins;
                    const oppWins = isTeamA ? h.team_b_wins : h.team_a_wins;
                    const myWinPct = isTeamA ? h.team_a_win_pct : h.team_b_win_pct;
                    const dominant = myWins > oppWins;

                    return (
                      <tr key={idx} className="hover:bg-[rgba(255,255,255,0.02)]">
                        <td className="py-1.5 px-3 font-semibold text-white">{opponent}</td>
                        <td className="py-1.5 px-3 text-center font-mono">{h.total_encounters}</td>
                        <td className="py-1.5 px-3 text-center font-mono font-bold text-[#2476E8]">
                          {myWins}
                        </td>
                        <td className="py-1.5 px-3 text-center font-mono text-[#707B91]">{oppWins}</td>
                        <td className="py-1.5 px-3 text-center font-mono">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              dominant
                                ? "bg-[rgba(245,185,66,0.12)] text-[#F5B942] border border-[rgba(245,185,66,0.25)]"
                                : myWins === oppWins
                                ? "bg-[#111A2E] text-[#A9B2C3]"
                                : "bg-[rgba(230,57,70,0.1)] text-[#E63946] border border-[rgba(230,57,70,0.2)]"
                            }`}
                          >
                            {myWinPct}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
