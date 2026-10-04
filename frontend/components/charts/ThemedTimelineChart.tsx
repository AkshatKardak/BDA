"use client";

import React, { useState } from "react";
import { CHART_PALETTES, CHART_COLORS } from "./chartTheme";
import EmptyChartState from "./EmptyChartState";

export interface SeasonTimelineItem {
  season: string | number;
  matches: number;
  champion?: string;
  runnerUp?: string;
  totalRuns?: number;
  runRate?: number;
}

interface ThemedTimelineChartProps {
  seasons: SeasonTimelineItem[];
}

export default function ThemedTimelineChart({
  seasons,
}: ThemedTimelineChartProps) {
  const [hoveredSeason, setHoveredSeason] = useState<SeasonTimelineItem | null>(null);

  if (!seasons || seasons.length === 0) return <EmptyChartState />;

  const maxMatches = Math.max(...seasons.map((s) => s.matches), 1);
  const palette = CHART_PALETTES.sports;

  return (
    <div className="w-full h-full flex flex-col justify-between p-2">
      <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-1.5 max-h-[260px]">
        {seasons.map((s, idx) => {
          const isHovered = hoveredSeason?.season === s.season;
          const barWidthPct = Math.max((s.matches / maxMatches) * 100, 20);
          const color = palette[idx % palette.length];

          return (
            <div
              key={s.season}
              className="flex items-center gap-2 cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredSeason(s)}
              onMouseLeave={() => setHoveredSeason(null)}
            >
              {/* Season year */}
              <span
                className={`w-12 text-right font-mono text-xs font-semibold ${
                  isHovered ? "text-[#F5B942]" : "text-[#8F9AAF]"
                }`}
              >
                {s.season}
              </span>

              {/* Timeline bar track */}
              <div className="flex-1 h-6 bg-[rgba(255,255,255,0.03)] rounded flex items-center relative overflow-hidden border border-[rgba(255,255,255,0.05)]">
                <div
                  className="h-full rounded flex items-center justify-between px-2.5 transition-all duration-300"
                  style={{
                    width: `${barWidthPct}%`,
                    backgroundColor: isHovered ? CHART_COLORS.blueLight : color,
                    opacity: isHovered ? 1 : 0.82,
                  }}
                >
                  <span className="text-[10px] font-mono font-bold text-[#FFFFFF] drop-shadow-sm">
                    {s.matches} matches
                  </span>
                  {s.champion && (
                    <span className="text-[10px] font-sans font-semibold text-white/95 truncate ml-2">
                      🏆 {s.champion}
                    </span>
                  )}
                </div>
              </div>

              {/* Run Rate badge if available */}
              {s.runRate && (
                <span className="w-14 text-right font-mono text-[10px] text-[#707B91]">
                  {s.runRate} RPO
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Season Footer */}
      <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between text-[11px]">
        <span className="text-[10px] text-[#707B91] font-mono">
          {seasons.length} IPL Seasons
        </span>
        <div className="text-[10px] font-mono text-[#F5B942]">
          {hoveredSeason ? (
            <span>
              IPL {hoveredSeason.season}: {hoveredSeason.matches} matches
              {hoveredSeason.champion ? ` | Champion: ${hoveredSeason.champion}` : ""}
              {hoveredSeason.totalRuns ? ` | ${hoveredSeason.totalRuns.toLocaleString()} runs` : ""}
            </span>
          ) : (
            <span className="text-[#707B91]">Hover a season to see details</span>
          )}
        </div>
      </div>
    </div>
  );
}
