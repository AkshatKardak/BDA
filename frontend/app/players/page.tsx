"use client";

import React, { useEffect, useState } from "react";
import { 
  Award, 
  Search, 
  Target, 
  Flame, 
  Zap, 
  Shield, 
  ChevronRight,
  X,
  TrendingUp,
  UserCheck
} from "lucide-react";
import { api } from "@/lib/api";

export default function PlayersPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"batters" | "bowlers" | "caps">("batters");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [playerModalOpen, setPlayerModalOpen] = useState(false);
  const [playerModalLoading, setPlayerModalLoading] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const res = await api.getPlayers({ limit: 100 });
        setData(res);
      } catch (err) {
        console.error("Failed to load players:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const openPlayerProfile = async (playerName: string) => {
    try {
      setPlayerModalOpen(true);
      setPlayerModalLoading(true);
      const detail = await api.getPlayerDetail(playerName);
      setSelectedPlayer(detail);
    } catch (err) {
      console.error(`Failed to load ${playerName} details:`, err);
    } finally {
      setPlayerModalLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-xs text-gray-400 font-mono">Loading player telemetry...</p>
      </div>
    );
  }

  const batters = (data?.top_batters || []).filter((b: any) =>
    b.batter.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const bowlers = (data?.top_bowlers || []).filter((b: any) =>
    b.bowler.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const caps = (data?.orange_purple_cap_history || []).filter((c: any) =>
    (c.batter || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.season || "").toString().includes(searchQuery)
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-2">
          <Award className="w-3.5 h-3.5" />
          Player Big Data Profiles
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">
          IPL Player Analytics (2008–2026)
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Career aggregations, batting strike rates, bowling economies, and Orange/Purple Cap milestones.
        </p>
      </div>

      {/* Search & Tabs Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Tab Buttons */}
        <div className="inline-flex p-1 rounded-xl bg-gray-900 border border-gray-800">
          <button
            onClick={() => setActiveTab("batters")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "batters"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Top Batters ({batters.length})
          </button>
          <button
            onClick={() => setActiveTab("bowlers")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "bowlers"
                ? "bg-purple-600 text-white shadow-md shadow-purple-600/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Target className="w-3.5 h-3.5" /> Top Bowlers ({bowlers.length})
          </button>
          <button
            onClick={() => setActiveTab("caps")}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === "caps"
                ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Season Leaders ({caps.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search player or season..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-900/80 border border-gray-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
          />
        </div>
      </div>

      {/* Tab 1: Top Batters Table */}
      {activeTab === "batters" && (
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-800/50 text-gray-400 font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Batter</th>
                  <th className="py-3 px-4 text-center">Innings</th>
                  <th className="py-3 px-4 text-center">Total Runs</th>
                  <th className="py-3 px-4 text-center">Balls Faced</th>
                  <th className="py-3 px-4 text-center">Strike Rate</th>
                  <th className="py-3 px-4 text-center">Average</th>
                  <th className="py-3 px-4 text-center">4s / 6s</th>
                  <th className="py-3 px-4 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {batters.map((b: any, idx: number) => (
                  <tr
                    key={b.batter}
                    onClick={() => openPlayerProfile(b.batter)}
                    className="hover:bg-gray-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-gray-400">
                      #{b.all_time_rank || idx + 1}
                    </td>
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      {b.batter}
                      {idx === 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Orange King
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{b.innings}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">
                      {b.total_runs.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-gray-400">{b.balls_faced.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-white">{b.strike_rate}</td>
                    <td className="py-3 px-4 text-center font-mono text-gray-300">{b.batting_average || "—"}</td>
                    <td className="py-3 px-4 text-center font-mono text-gray-400">
                      {b.fours} / <span className="text-amber-400 font-semibold">{b.sixes}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] text-emerald-400 flex items-center justify-end gap-1">
                        View <ChevronRight className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Top Bowlers Table */}
      {activeTab === "bowlers" && (
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-800/50 text-gray-400 font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Bowler</th>
                  <th className="py-3 px-4 text-center">Matches</th>
                  <th className="py-3 px-4 text-center">Overs</th>
                  <th className="py-3 px-4 text-center">Wickets</th>
                  <th className="py-3 px-4 text-center">Runs Conceded</th>
                  <th className="py-3 px-4 text-center">Economy</th>
                  <th className="py-3 px-4 text-center">Dot Balls</th>
                  <th className="py-3 px-4 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {bowlers.map((bw: any, idx: number) => (
                  <tr
                    key={bw.bowler}
                    onClick={() => openPlayerProfile(bw.bowler)}
                    className="hover:bg-gray-800/40 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-gray-400">
                      #{bw.all_time_rank || idx + 1}
                    </td>
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      {bw.bowler}
                      {idx === 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Purple King
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{bw.matches}</td>
                    <td className="py-3 px-4 text-center font-mono">{bw.overs}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-purple-400">
                      {bw.wickets}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-gray-400">{bw.runs_conceded.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-white">{bw.economy_rate}</td>
                    <td className="py-3 px-4 text-center font-mono text-gray-300">{bw.dot_balls.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] text-purple-400 flex items-center justify-end gap-1">
                        View <ChevronRight className="w-3 h-3" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Caps & Season Leaders */}
      {activeTab === "caps" && (
        <div className="rounded-xl border border-gray-800 bg-gray-900/60 overflow-hidden backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-800/50 text-gray-400 font-mono uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Season</th>
                  <th className="py-3 px-4">Top Batter (Orange Cap)</th>
                  <th className="py-3 px-4 text-center">Season Runs</th>
                  <th className="py-3 px-4 text-center">Balls Faced</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800 text-gray-300">
                {caps.map((c: any, idx: number) => (
                  <tr key={idx} className="hover:bg-gray-800/40">
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">{c.season}</td>
                    <td className="py-3 px-4 font-bold text-white">{c.batter}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-emerald-400">
                      {c.season_runs}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-gray-400">{c.balls_faced}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openPlayerProfile(c.batter)}
                        className="text-[11px] text-amber-400 hover:underline"
                      >
                        Inspect Batter
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Player Profile Modal */}
      {playerModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-xl w-full p-6 relative shadow-2xl">
            <button
              onClick={() => setPlayerModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            {playerModalLoading || !selectedPlayer ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-3 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
                <p className="text-xs text-gray-400 font-mono">Aggregating player analytics...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    Verified Cricsheet Profile
                  </span>
                  <h3 className="text-2xl font-black text-white mt-1">
                    {selectedPlayer.player_name}
                  </h3>
                  <p className="text-xs text-gray-400">
                    IPL Career Record (2008–2026)
                  </p>
                </div>

                {/* Batting Card if exists */}
                {selectedPlayer.batting_profile && (
                  <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
                    <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" /> Batting Discipline
                    </h4>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-gray-900/60 p-2 rounded-lg border border-gray-800">
                        <p className="text-[10px] text-gray-400">Runs</p>
                        <p className="text-base font-bold text-white font-mono">
                          {selectedPlayer.batting_profile.total_runs.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-gray-900/60 p-2 rounded-lg border border-gray-800">
                        <p className="text-[10px] text-gray-400">Strike Rate</p>
                        <p className="text-base font-bold text-emerald-400 font-mono">
                          {selectedPlayer.batting_profile.strike_rate}
                        </p>
                      </div>
                      <div className="bg-gray-900/60 p-2 rounded-lg border border-gray-800">
                        <p className="text-[10px] text-gray-400">Average</p>
                        <p className="text-base font-bold text-blue-400 font-mono">
                          {selectedPlayer.batting_profile.batting_average || "—"}
                        </p>
                      </div>
                      <div className="bg-gray-900/60 p-2 rounded-lg border border-gray-800">
                        <p className="text-[10px] text-gray-400">6s / 4s</p>
                        <p className="text-base font-bold text-purple-400 font-mono">
                          {selectedPlayer.batting_profile.sixes}/{selectedPlayer.batting_profile.fours}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bowling Card if exists */}
                {selectedPlayer.bowling_profile && (
                  <div className="rounded-xl border border-gray-800 bg-gray-950/60 p-4">
                    <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5" /> Bowling Discipline
                    </h4>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-gray-900/60 p-2 rounded-lg border border-gray-800">
                        <p className="text-[10px] text-gray-400">Wickets</p>
                        <p className="text-base font-bold text-purple-400 font-mono">
                          {selectedPlayer.bowling_profile.wickets}
                        </p>
                      </div>
                      <div className="bg-gray-900/60 p-2 rounded-lg border border-gray-800">
                        <p className="text-[10px] text-gray-400">Economy</p>
                        <p className="text-base font-bold text-emerald-400 font-mono">
                          {selectedPlayer.bowling_profile.economy_rate}
                        </p>
                      </div>
                      <div className="bg-gray-900/60 p-2 rounded-lg border border-gray-800">
                        <p className="text-[10px] text-gray-400">Overs</p>
                        <p className="text-base font-bold text-white font-mono">
                          {selectedPlayer.bowling_profile.overs}
                        </p>
                      </div>
                      <div className="bg-gray-900/60 p-2 rounded-lg border border-gray-800">
                        <p className="text-[10px] text-gray-400">Dot Balls</p>
                        <p className="text-base font-bold text-blue-400 font-mono">
                          {selectedPlayer.bowling_profile.dot_balls}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
