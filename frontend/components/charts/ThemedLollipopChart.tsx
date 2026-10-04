"use client";

import React, { useState } from "react";
import { CHART_COLORS } from "./chartTheme";
import EmptyChartState from "./EmptyChartState";

interface ThemedLollipopChartProps {
  data: any[];
  labelKey: string;
  valueKey: string;
  unit?: string;
  color?: string;
  maxItems?: number;
}

export default function ThemedLollipopChart({
  data,
  labelKey,
  valueKey,
  unit = "",
  color = CHART_COLORS.goldPrimary,
  maxItems = 10,
}: ThemedLollipopChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return <EmptyChartState />;

  const items = data.slice(0, maxItems);
  const values = items.map((d) => Number(d[valueKey]) || 0);
  const maxValue = Math.max(...values, 1);

  const rowHeight = 32;
  const topPadding = 12;
  const bottomPadding = 20;
  const leftPadding = 120;
  const rightPadding = 56;
  const totalHeight = topPadding + bottomPadding + items.length * rowHeight;

  return (
    <div className="w-full h-full overflow-hidden flex flex-col justify-center">
      <svg
        viewBox={`0 0 500 ${totalHeight}`}
        className="w-full h-full select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Subtle grid lines */}
        {[0.25, 0.5, 0.75, 1].map((pct) => {
          const x = leftPadding + pct * (500 - leftPadding - rightPadding);
          return (
            <g key={pct}>
              <line
                x1={x}
                y1={topPadding}
                x2={x}
                y2={totalHeight - bottomPadding}
                stroke="rgba(255, 255, 255, 0.05)"
                strokeDasharray="2 2"
              />
              <text
                x={x}
                y={totalHeight - 4}
                textAnchor="middle"
                fontSize="9"
                fill="#707B91"
                fontFamily="monospace"
              >
                {Math.round(pct * maxValue).toLocaleString()}
              </text>
            </g>
          );
        })}

        {/* Rows */}
        {items.map((item, idx) => {
          const val = Number(item[valueKey]) || 0;
          const label = String(item[labelKey]);
          const y = topPadding + idx * rowHeight + rowHeight / 2;
          const xEnd = leftPadding + (val / maxValue) * (500 - leftPadding - rightPadding);
          const isHovered = hoveredIdx === idx;

          return (
            <g
              key={idx}
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Row hover highlight */}
              {isHovered && (
                <rect
                  x="0"
                  y={y - rowHeight / 2 + 2}
                  width="500"
                  height={rowHeight - 4}
                  fill="rgba(36, 118, 232, 0.08)"
                  rx="4"
                />
              )}

              {/* Label */}
              <text
                x={leftPadding - 12}
                y={y + 3.5}
                textAnchor="end"
                fontSize="11"
                fontWeight={isHovered ? 600 : 500}
                fill={isHovered ? "#F4F6FA" : "#A9B2C3"}
              >
                {label.length > 16 ? label.substring(0, 15) + "…" : label}
              </text>

              {/* Lollipop Stem */}
              <line
                x1={leftPadding}
                y1={y}
                x2={xEnd}
                y2={y}
                stroke={isHovered ? CHART_COLORS.blueLight : color}
                strokeWidth={isHovered ? 2.5 : 1.5}
                strokeOpacity={isHovered ? 1 : 0.75}
              />

              {/* Lollipop Head / Circle */}
              <circle
                cx={xEnd}
                cy={y}
                r={isHovered ? 6.5 : 4.5}
                fill={isHovered ? "#FFFFFF" : color}
                stroke={color}
                strokeWidth="2"
                className="transition-all duration-150"
              />

              {/* Value Text */}
              <text
                x={xEnd + 8}
                y={y + 3.5}
                fontSize="10"
                fontFamily="monospace"
                fontWeight="600"
                fill={isHovered ? "#F4F6FA" : "#8F9AAF"}
              >
                {val.toLocaleString()}
                {unit ? ` ${unit}` : ""}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
