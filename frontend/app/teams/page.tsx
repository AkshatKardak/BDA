"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  Trophy, 
  Target, 
  TrendingUp, 
  Swords, 
  CheckCircle2, 
  XCircle,
  Calendar,
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
  LineChart,
  Line,
  CartesianGrid
} from "recharts";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
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
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-xs text-gray-400 font-mono">Loading franchise analytics...</p>
      </div>
    );
  }

  const seasonChartData = (teamDetail?.season_history || []).map((s: any) => ({
    season: s.season.toString(),
    wins: s.wins,
    matches: s.matches,
    win_pct: s.season_win_pct
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-2">
          <Users className="w-3.5 h-3.5" />
          Franchise Performance & Rivalries
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          IPL Franchise Analytics (2008–2026)
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Historical win percentages, batting first vs chasing biases, and head-to-head records across 15 franchises.
        </p>
      </div>

      {/* Standings Table */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 overflow-hidden backdrop-blur-sm">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            All-Time Franchise Standings
          </h3>
          <span className="text-[11px] text-gray-400 font-mono">
            Click any franchise to inspect deep-dive telemetry
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-800/50 text-gray-400 font-mono uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Franchise</th>
                <th className="py-3 px-4 text-center">Played</th>
                <th className="py-3 px-4 text-center">Wins</th>
                <th className="py-3 px-4 text-center">Losses</th>
                <th className="py-3 px-4 text-center">Win %</th>
                <th className="py-3 px-4 text-center">Bat 1st Win %</th>
                <th className="py-3 px-4 text-center">Chase Win %</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800 text-gray-300">
              {teams.map((t, idx) => {
                const isSelected = selectedTeam === t.team;
                return (
                  <tr
                    key={t.team}
                    onClick={() => handleSelectTeam(t.team)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-emerald-950/30 text-white border-l-4 border-l-emerald-500"
                        : "hover:bg-gray-800/40"
                    }`}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-gray-400">{idx + 1}</td>
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      {t.team}
                      {idx === 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Most Wins
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{t.matches_played}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">{t.wins}</td>
                    <td className="py-3 px-4 text-center font-mono text-gray-400">{t.losses}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-white">
                      {t.win_pct}%
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-gray-400">
                      {t.bat_first_win_pct}% ({t.bat_first_wins})
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-gray-400">
                      {t.chase_win_pct}% ({t.chase_wins})
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                          isSelected
                            ? "bg-emerald-600 text-white"
                            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
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
      {selectedTeam && (
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" />
                {selectedTeam} — Deep Dive Analytics
              </h2>
              <p className="text-xs text-gray-400">
                Season progression, victory breakdown, and historical head-to-head records
              </p>
            </div>
            {detailLoading && (
              <span className="text-xs text-emerald-400 font-mono animate-pulse">
                Fetching stats...
              </span>
            )}
          </div>

          {teamDetail && (
            <>
              {/* Franchise Snapshot Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
                  <p className="text-xs text-gray-400 uppercase font-mono">Overall Matches</p>
                  <p className="text-2xl font-bold text-white font-mono mt-1">{teamDetail.matches_played}</p>
                  <p className="text-[11px] text-emerald-400 mt-1">{teamDetail.wins} Wins · {teamDetail.losses} Losses</p>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
                  <p className="text-xs text-gray-400 uppercase font-mono">Win Percentage</p>
                  <p className="text-2xl font-bold text-emerald-400 font-mono mt-1">{teamDetail.win_pct}%</p>
                  <p className="text-[11px] text-gray-400 mt-1">Across all editions</p>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
                  <p className="text-xs text-gray-400 uppercase font-mono">Defending (Bat 1st)</p>
                  <p className="text-2xl font-bold text-blue-400 font-mono mt-1">{teamDetail.bat_first_win_pct}%</p>
                  <p className="text-[11px] text-gray-400 mt-1">{teamDetail.bat_first_wins} Wins Defending</p>
                </div>
                <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-4">
                  <p className="text-xs text-gray-400 uppercase font-mono">Chasing (Field 1st)</p>
                  <p className="text-2xl font-bold text-purple-400 font-mono mt-1">{teamDetail.chase_win_pct}%</p>
                  <p className="text-[11px] text-gray-400 mt-1">{teamDetail.chase_wins} Wins Chasing</p>
                </div>
              </div>

              {/* Season By Season Performance Chart */}
              {seasonChartData.length > 0 && (
                <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6">
                  <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    Season-by-Season Win Percentage Progression
                  </h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={seasonChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                        <XAxis dataKey="season" stroke="#9CA3AF" fontSize={11} />
                        <YAxis stroke="#9CA3AF" fontSize={11} domain={[0, 100]} />
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
                          dataKey="win_pct"
                          name="Win %"
                          stroke="#10B981"
                          strokeWidth={2.5}
                          dot={{ r: 4, fill: "#10B981" }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Head-to-Head Rivalries */}
              <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
                  <Swords className="w-4 h-4 text-amber-400" />
                  Head-to-Head Matchups vs Other Franchises
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-gray-800/50 text-gray-400 font-mono uppercase text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3">Opponent</th>
                        <th className="py-2.5 px-3 text-center">Played</th>
                        <th className="py-2.5 px-3 text-center">{selectedTeam} Wins</th>
                        <th className="py-2.5 px-3 text-center">Opponent Wins</th>
                        <th className="py-2.5 px-3 text-center">Win Ratio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800 text-gray-300">
                      {(teamDetail.h2h_rivalries || []).map((h: any, idx: number) => {
                        const isTeamA = h.team_a === selectedTeam;
                        const opponent = isTeamA ? h.team_b : h.team_a;
                        const myWins = isTeamA ? h.team_a_wins : h.team_b_wins;
                        const oppWins = isTeamA ? h.team_b_wins : h.team_a_wins;
                        const myWinPct = isTeamA ? h.team_a_win_pct : h.team_b_win_pct;
                        const dominant = myWins > oppWins;

                        return (
                          <tr key={idx} className="hover:bg-gray-800/40">
                            <td className="py-2.5 px-3 font-semibold text-white">{opponent}</td>
                            <td className="py-2.5 px-3 text-center font-mono">{h.total_encounters}</td>
                            <td className="py-2.5 px-3 text-center font-mono font-bold text-emerald-400">
                              {myWins}
                            </td>
                            <td className="py-2.5 px-3 text-center font-mono text-gray-400">{oppWins}</td>
                            <td className="py-2.5 px-3 text-center font-mono">
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  dominant
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : myWins === oppWins
                                    ? "bg-gray-800 text-gray-300"
                                    : "bg-red-500/10 text-red-400 border border-red-500/20"
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
            </>
          )}
        </div>
      )}
    </div>
  );
}
