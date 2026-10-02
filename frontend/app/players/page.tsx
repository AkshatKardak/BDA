"use client";

import React, { useEffect, useState } from "react";
import { 
  Award, 
  Search, 
  Target, 
  Zap, 
  ChevronRight,
  X,
  Trophy
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
        <div className="w-10 h-10 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin"></div>
        <p className="text-xs text-[#A9B2C3] font-mono tracking-wider">Loading player profiles...</p>
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
        <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-widest text-[#F5B942] uppercase mb-1">
          <span>PLAYER DATABASE</span>
          <span>·</span>
          <span>2008–2026</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">
          IPL Player Career Statistics & Milestones
        </h1>
        <p className="text-xs text-[#A9B2C3] mt-1 max-w-3xl leading-relaxed">
          Comprehensive career aggregations, batting strike rates, bowling economies, and season cap titles derived from 295,732 deliveries.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Clean Segmented Tab Buttons */}
        <div className="inline-flex p-1 rounded-btn bg-[#0D1424] border border-[rgba(255,255,255,0.08)]">
          <button
            onClick={() => setActiveTab("batters")}
            className={`px-4 py-2 rounded-btn text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === "batters"
                ? "bg-[#165DCC] text-white"
                : "text-[#8F9AAF] hover:text-white"
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-[#F5B942]" /> Top Batters ({batters.length})
          </button>
          <button
            onClick={() => setActiveTab("bowlers")}
            className={`px-4 py-2 rounded-btn text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === "bowlers"
                ? "bg-[#165DCC] text-white"
                : "text-[#8F9AAF] hover:text-white"
            }`}
          >
            <Target className="w-3.5 h-3.5 text-[#F5B942]" /> Top Bowlers ({bowlers.length})
          </button>
          <button
            onClick={() => setActiveTab("caps")}
            className={`px-4 py-2 rounded-btn text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === "caps"
                ? "bg-[#165DCC] text-white"
                : "text-[#8F9AAF] hover:text-white"
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-[#F5B942]" /> Season Caps ({caps.length})
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#707B91]" />
          <input
            type="text"
            placeholder="Search player or season..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0D1424] border border-[rgba(255,255,255,0.08)] rounded-btn pl-9 pr-4 py-2 text-xs text-white placeholder-[#707B91] focus:outline-none focus:border-[#2476E8]"
          />
        </div>
      </div>

      {/* Tab 1: Top Batters Table */}
      {activeTab === "batters" && (
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090E1B] text-[#707B91] font-mono uppercase text-[10px] tracking-wider border-b border-[rgba(255,255,255,0.06)]">
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
              <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-[#F4F6FA]">
                {batters.map((b: any, idx: number) => (
                  <tr
                    key={b.batter}
                    onClick={() => openPlayerProfile(b.batter)}
                    className="hover:bg-[rgba(22,93,204,0.08)] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold">
                      <span className={idx === 0 ? "text-[#F5B942]" : "text-[#707B91]"}>
                        #{b.all_time_rank || idx + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <span>{b.batter}</span>
                      {idx === 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(245,185,66,0.12)] text-[#F5B942] border border-[rgba(245,185,66,0.25)] font-mono font-bold">
                          All-Time #1
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{b.innings}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-white">
                      {b.total_runs.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[#A9B2C3]">{b.balls_faced.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#F5B942]">{b.strike_rate}</td>
                    <td className="py-3 px-4 text-center font-mono text-[#A9B2C3]">{b.batting_average || "—"}</td>
                    <td className="py-3 px-4 text-center font-mono text-[#707B91]">
                      {b.fours} / <span className="text-[#F5B942]">{b.sixes}</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] text-[#2476E8] flex items-center justify-end gap-1">
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
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090E1B] text-[#707B91] font-mono uppercase text-[10px] tracking-wider border-b border-[rgba(255,255,255,0.06)]">
                <tr>
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Bowler</th>
                  <th className="py-3 px-4 text-center">Matches</th>
                  <th className="py-3 px-4 text-center">Overs</th>
                  <th className="py-3 px-4 text-center">Wickets</th>
                  <th className="py-3 px-4 text-center">Runs</th>
                  <th className="py-3 px-4 text-center">Economy</th>
                  <th className="py-3 px-4 text-center">Dot Balls</th>
                  <th className="py-3 px-4 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-[#F4F6FA]">
                {bowlers.map((bw: any, idx: number) => (
                  <tr
                    key={bw.bowler}
                    onClick={() => openPlayerProfile(bw.bowler)}
                    className="hover:bg-[rgba(22,93,204,0.08)] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold">
                      <span className={idx === 0 ? "text-[#F5B942]" : "text-[#707B91]"}>
                        #{bw.all_time_rank || idx + 1}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-white flex items-center gap-2">
                      <span>{bw.bowler}</span>
                      {idx === 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[rgba(245,185,66,0.12)] text-[#F5B942] border border-[rgba(245,185,66,0.25)] font-mono font-bold">
                          All-Time #1
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center font-mono">{bw.matches}</td>
                    <td className="py-3 px-4 text-center font-mono">{bw.overs}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-white">
                      {bw.wickets}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[#707B91]">{bw.runs_conceded.toLocaleString()}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#F5B942]">{bw.economy_rate}</td>
                    <td className="py-3 px-4 text-center font-mono text-[#A9B2C3]">{bw.dot_balls.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-[11px] text-[#2476E8] flex items-center justify-end gap-1">
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
        <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#090E1B] text-[#707B91] font-mono uppercase text-[10px] tracking-wider border-b border-[rgba(255,255,255,0.06)]">
                <tr>
                  <th className="py-3 px-4">Season</th>
                  <th className="py-3 px-4">Top Run Scorer</th>
                  <th className="py-3 px-4 text-center">Runs</th>
                  <th className="py-3 px-4 text-center">Balls Faced</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.04)] text-[#F4F6FA]">
                {caps.map((c: any, idx: number) => (
                  <tr key={idx} className="hover:bg-[rgba(255,255,255,0.02)]">
                    <td className="py-3 px-4 font-mono font-bold text-[#F5B942]">{c.season}</td>
                    <td className="py-3 px-4 font-bold text-white">{c.batter}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-white">
                      {c.season_runs}
                    </td>
                    <td className="py-3 px-4 text-center font-mono text-[#707B91]">{c.balls_faced}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => openPlayerProfile(c.batter)}
                        className="text-[11px] text-[#2476E8] hover:text-[#F5B942] transition-colors"
                      >
                        Inspect Profile
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
          <div className="bg-[#0D1424] border border-[rgba(255,255,255,0.12)] rounded-card max-w-lg w-full p-6 relative shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <button
              onClick={() => setPlayerModalOpen(false)}
              className="absolute top-4 right-4 text-[#707B91] hover:text-white p-1 rounded-btn hover:bg-[#111A2E]"
            >
              <X className="w-5 h-5" />
            </button>

            {playerModalLoading || !selectedPlayer ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <div className="w-8 h-8 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin"></div>
                <p className="text-xs text-[#A9B2C3] font-mono">Aggregating telemetry...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(245,185,66,0.12)] text-[#F5B942] border border-[rgba(245,185,66,0.25)] font-bold">
                    Official Historical Record
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mt-2">
                    {selectedPlayer.player_name}
                  </h3>
                  <p className="text-xs text-[#707B91]">IPL Career Telemetry (2008–2026)</p>
                </div>

                {/* Batting Card */}
                {selectedPlayer.batting_profile && (
                  <div className="rounded-card border border-[rgba(255,255,255,0.06)] bg-[#070B16] p-4">
                    <h4 className="text-xs font-bold text-[#F5B942] uppercase tracking-wider mb-3 flex items-center gap-1.5 font-mono">
                      <Zap className="w-3.5 h-3.5" /> Batting Discipline
                    </h4>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-[#0D1424] p-2.5 rounded-btn border border-[rgba(255,255,255,0.06)]">
                        <p className="text-[10px] text-[#707B91] uppercase">Runs</p>
                        <p className="text-base font-bold text-white font-mono mt-0.5">
                          {selectedPlayer.batting_profile.total_runs.toLocaleString()}
                        </p>
                      </div>
                      <div className="bg-[#0D1424] p-2.5 rounded-btn border border-[rgba(255,255,255,0.06)]">
                        <p className="text-[10px] text-[#707B91] uppercase">SR</p>
                        <p className="text-base font-bold text-[#F5B942] font-mono mt-0.5">
                          {selectedPlayer.batting_profile.strike_rate}
                        </p>
                      </div>
                      <div className="bg-[#0D1424] p-2.5 rounded-btn border border-[rgba(255,255,255,0.06)]">
                        <p className="text-[10px] text-[#707B91] uppercase">Avg</p>
                        <p className="text-base font-bold text-white font-mono mt-0.5">
                          {selectedPlayer.batting_profile.batting_average || "—"}
                        </p>
                      </div>
                      <div className="bg-[#0D1424] p-2.5 rounded-btn border border-[rgba(255,255,255,0.06)]">
                        <p className="text-[10px] text-[#707B91] uppercase">6s / 4s</p>
                        <p className="text-base font-bold text-white font-mono mt-0.5">
                          {selectedPlayer.batting_profile.sixes}/{selectedPlayer.batting_profile.fours}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Bowling Card */}
                {selectedPlayer.bowling_profile && (
                  <div className="rounded-card border border-[rgba(255,255,255,0.06)] bg-[#070B16] p-4">
                    <h4 className="text-xs font-bold text-[#2476E8] uppercase tracking-wider mb-3 flex items-center gap-1.5 font-mono">
                      <Target className="w-3.5 h-3.5" /> Bowling Discipline
                    </h4>
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div className="bg-[#0D1424] p-2.5 rounded-btn border border-[rgba(255,255,255,0.06)]">
                        <p className="text-[10px] text-[#707B91] uppercase">Wkts</p>
                        <p className="text-base font-bold text-white font-mono mt-0.5">
                          {selectedPlayer.bowling_profile.wickets}
                        </p>
                      </div>
                      <div className="bg-[#0D1424] p-2.5 rounded-btn border border-[rgba(255,255,255,0.06)]">
                        <p className="text-[10px] text-[#707B91] uppercase">Econ</p>
                        <p className="text-base font-bold text-[#F5B942] font-mono mt-0.5">
                          {selectedPlayer.bowling_profile.economy_rate}
                        </p>
                      </div>
                      <div className="bg-[#0D1424] p-2.5 rounded-btn border border-[rgba(255,255,255,0.06)]">
                        <p className="text-[10px] text-[#707B91] uppercase">Overs</p>
                        <p className="text-base font-bold text-white font-mono mt-0.5">
                          {selectedPlayer.bowling_profile.overs}
                        </p>
                      </div>
                      <div className="bg-[#0D1424] p-2.5 rounded-btn border border-[rgba(255,255,255,0.06)]">
                        <p className="text-[10px] text-[#707B91] uppercase">Dots</p>
                        <p className="text-base font-bold text-[#A9B2C3] font-mono mt-0.5">
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
