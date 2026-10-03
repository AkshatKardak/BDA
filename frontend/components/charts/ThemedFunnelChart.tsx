"use client";

import React, { useState } from "react";
import { CHART_PALETTES } from "./chartTheme";

export interface FunnelStage {
  stage: string;
  count: number;
  label?: string;
  subtext?: string;
}

interface ThemedFunnelChartProps {
  data: FunnelStage[];
  unit?: string;
}

export default function ThemedFunnelChart({
  data,
  unit = "teams",
}: ThemedFunnelChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.count), 1);
  const colors = [
    "#165DCC", // Dark Blue
    "#2476E8", // Electric Blue
    "#F5B942", // Gold
    "#2FBF71", // Emerald Green
    "#FFB703", // Vivid Trophy Gold
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center gap-2.5 px-4 py-2">
      {data.map((item, idx) => {
        const pctOfMax = (item.count / maxVal) * 100;
        const color = colors[idx % colors.length];
        const isHovered = hoveredIdx === idx;

        return (
          <div
            key={idx}
            className="flex flex-col cursor-pointer transition-all duration-150"
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className="flex items-center justify-between text-xs pb-1">
              <span className={`font-semibold transition-colors ${isHovered ? "text-[#F4F6FA]" : "text-[#A9B2C3]"}`}>
                {item.stage}
              </span>
              <span className="font-mono text-xs text-[#F5B942] font-bold">
                {item.count} {unit}
                {item.subtext && <span className="ml-1 text-[10px] text-[#707B91] font-normal">({item.subtext})</span>}
              </span>
            </div>

            {/* Funnel trapezoid bar centered */}
            <div className="w-full bg-[rgba(255,255,255,0.04)] h-7 rounded-sm flex items-center justify-center p-0.5 relative overflow-hidden">
              <div
                className="h-full rounded-sm transition-all duration-300 flex items-center justify-between px-3"
                style={{
                  width: `${Math.max(pctOfMax, 18)}%`,
                  backgroundColor: color,
                  opacity: isHovered ? 1 : 0.82,
                  boxShadow: isHovered ? `0 0 12px ${color}80` : "none",
                }}
              >
                <span className="text-[10px] font-mono font-bold text-[#FFFFFF] drop-shadow-sm">
                  {Math.round(pctOfMax)}%
                </span>
                {item.label && (
                  <span className="text-[10px] font-sans text-white/90 truncate ml-2">
                    {item.label}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
