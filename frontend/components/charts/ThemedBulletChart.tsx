"use client";

import React from "react";
import { CHART_COLORS } from "./chartTheme";

export interface BulletItem {
  title: string;
  subtitle?: string;
  actual: number;
  target: number;
  ranges: [number, number, number]; // [poor, satisfactory, good] e.g. [45, 52, 60]
  unit?: string;
  color?: string;
}

interface ThemedBulletChartProps {
  items: BulletItem[];
  maxRange?: number;
}

export default function ThemedBulletChart({
  items,
  maxRange = 100,
}: ThemedBulletChartProps) {
  if (!items || items.length === 0) return null;

  return (
    <div className="w-full h-full flex flex-col justify-around gap-3 p-2">
      {items.map((item, idx) => {
        const [r1, r2, r3] = item.ranges;
        const max = maxRange || r3;
        const actualPct = Math.min((item.actual / max) * 100, 100);
        const targetPct = Math.min((item.target / max) * 100, 100);
        const r1Pct = (r1 / max) * 100;
        const r2Pct = (r2 / max) * 100;
        const r3Pct = (r3 / max) * 100;
        const color = item.color || CHART_COLORS.goldPrimary;

        return (
          <div key={idx} className="flex flex-col gap-1">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="font-semibold text-[#F4F6FA]">{item.title}</span>
                {item.subtitle && (
                  <span className="ml-1.5 text-[10px] text-[#707B91]">
                    ({item.subtitle})
                  </span>
                )}
              </div>
              <div className="font-mono text-xs text-[#8F9AAF]">
                Actual: <span className="font-bold text-[#F4F6FA]">{item.actual}{item.unit || "%"}</span> | Target:{" "}
                <span className="text-[#2FBF71]">{item.target}{item.unit || "%"}</span>
              </div>
            </div>

            {/* Bullet Track with qualitative bands */}
            <div className="relative w-full h-6 rounded overflow-hidden bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)]">
              {/* Band 1: Poor */}
              <div
                className="absolute inset-y-0 left-0 bg-[rgba(255,255,255,0.04)]"
                style={{ width: `${r1Pct}%` }}
              />
              {/* Band 2: Mid */}
              <div
                className="absolute inset-y-0 left-0 bg-[rgba(255,255,255,0.07)]"
                style={{ left: `${r1Pct}%`, width: `${r2Pct - r1Pct}%` }}
              />
              {/* Band 3: High */}
              <div
                className="absolute inset-y-0 left-0 bg-[rgba(255,255,255,0.11)]"
                style={{ left: `${r2Pct}%`, width: `${r3Pct - r2Pct}%` }}
              />

              {/* Performance Bar (Centered vertically) */}
              <div
                className="absolute top-1.5 bottom-1.5 left-0 rounded-sm transition-all duration-300 shadow-sm"
                style={{
                  width: `${actualPct}%`,
                  backgroundColor: color,
                }}
              />

              {/* Target Marker (Vertical line) */}
              <div
                className="absolute inset-y-0 w-1 bg-[#FFFFFF] shadow-[0_0_4px_#FFFFFF] z-10"
                style={{ left: `calc(${targetPct}% - 2px)` }}
                title={`Target: ${item.target}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
