"use client";

import React, { useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { CHART_PALETTES } from "./chartTheme";
import EmptyChartState from "./EmptyChartState";

export interface BarRaceFrame {
  season: string | number;
  rankings: {
    team: string;
    value: number; // e.g. cumulative wins
    label?: string;
    color?: string;
  }[];
}

interface ThemedBarRaceProps {
  frames: BarRaceFrame[];
  unit?: string;
  autoPlayIntervalMs?: number;
}

export default function ThemedBarRace({
  frames,
  unit = "wins",
  autoPlayIntervalMs = 1200,
}: ThemedBarRaceProps) {
  const [currentFrameIdx, setCurrentFrameIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentFrameIdx((prev) => {
          if (prev >= frames.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, autoPlayIntervalMs);
    }
    return () => clearInterval(timer);
  }, [isPlaying, frames?.length, autoPlayIntervalMs]);

  if (!frames || frames.length === 0) return <EmptyChartState />;

  const currentFrame = frames[currentFrameIdx] || frames[0];
  const sorted = [...currentFrame.rankings].sort((a, b) => b.value - a.value).slice(0, 7);
  const maxVal = Math.max(...sorted.map((s) => s.value), 1);

  const palette = CHART_PALETTES.sports;

  return (
    <div className="w-full h-full flex flex-col justify-between p-2">
      {/* Header controls: Season Title + Play/Pause Scrubber */}
      <div className="flex items-center justify-between pb-2 border-b border-[rgba(255,255,255,0.06)]">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex items-center justify-center w-7 h-7 rounded bg-[rgba(36,118,232,0.15)] text-[#2476E8] hover:bg-[rgba(36,118,232,0.3)] transition-colors"
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsPlaying(false);
              setCurrentFrameIdx(0);
            }}
            className="flex items-center justify-center w-7 h-7 rounded bg-[rgba(255,255,255,0.05)] text-[#8F9AAF] hover:text-[#F4F6FA] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs text-[#8F9AAF] font-mono">
            Season {currentFrame.season}
          </span>
        </div>

        {/* Scrubber slider */}
        <input
          type="range"
          min="0"
          max={frames.length - 1}
          value={currentFrameIdx}
          onChange={(e) => {
            setIsPlaying(false);
            setCurrentFrameIdx(Number(e.target.value));
          }}
          className="w-32 h-1 bg-[rgba(255,255,255,0.1)] rounded-lg appearance-none cursor-pointer accent-[#F5B942]"
        />
      </div>

      {/* Racing Bars */}
      <div className="flex-1 flex flex-col justify-around py-2 gap-1.5">
        {sorted.map((item, idx) => {
          const pct = Math.max((item.value / maxVal) * 100, 10);
          const color = item.color || palette[idx % palette.length];

          return (
            <div key={item.team} className="flex items-center gap-2 text-xs">
              <span className="w-5 text-right font-mono text-[10px] text-[#707B91] font-semibold">
                #{idx + 1}
              </span>
              <span className="w-24 sm:w-28 text-right font-semibold text-[#F4F6FA] truncate text-[11px]">
                {item.team}
              </span>

              {/* Bar track */}
              <div className="flex-1 h-5 bg-[rgba(255,255,255,0.04)] rounded flex items-center relative overflow-hidden">
                <div
                  className="h-full rounded flex items-center justify-end px-2 transition-all duration-500 ease-out"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: color,
                    opacity: 0.88,
                  }}
                >
                  <span className="text-[10px] font-mono font-bold text-[#FFFFFF] drop-shadow-sm">
                    {item.value.toLocaleString()} {unit}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer season progress tracker */}
      <div className="text-[10px] font-mono text-[#707B91] text-right pt-1">
        Showing cumulative {unit} up to IPL {currentFrame.season}
      </div>
    </div>
  );
}
