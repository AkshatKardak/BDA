"use client";

import React, { useState } from "react";
import { CHART_COLORS } from "./chartTheme";
import EmptyChartState from "./EmptyChartState";

export interface ViolinDensityPoint {
  val: number;
  density: number; // 0 to 1 normalized
}

export interface ViolinItem {
  label: string;
  median: number;
  q1: number;
  q3: number;
  points: ViolinDensityPoint[];
  color?: string;
}

interface ThemedViolinPlotProps {
  data: ViolinItem[];
  unit?: string;
}

export default function ThemedViolinPlot({
  data,
  unit = "",
}: ThemedViolinPlotProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return <EmptyChartState />;

  const width = 540;
  const height = 260;
  const padLeft = 40;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 36;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Find min and max val
  const allVals = data.flatMap((d) => d.points.map((p) => p.val));
  const minVal = Math.floor(Math.min(...allVals) * 0.95);
  const maxVal = Math.ceil(Math.max(...allVals) * 1.05) || 1;
  const range = maxVal - minVal || 1;

  const getY = (val: number) => padTop + chartH - ((val - minVal) / range) * chartH;
  const colWidth = chartW / data.length;
  const maxViolinHalfW = Math.min(colWidth * 0.45, 34);

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const val = Math.round(minVal + pct * range);
          const y = getY(val);
          return (
            <g key={pct}>
              <line
                x1={padLeft}
                y1={y}
                x2={width - padRight}
                y2={y}
                stroke="rgba(255, 255, 255, 0.06)"
                strokeDasharray="2 2"
              />
              <text
                x={padLeft - 8}
                y={y + 3.5}
                textAnchor="end"
                fontSize="9"
                fill="#707B91"
                fontFamily="monospace"
              >
                {val}
              </text>
            </g>
          );
        })}

        {/* Violins */}
        {data.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          const xCenter = padLeft + idx * colWidth + colWidth / 2;
          const color = item.color || CHART_COLORS.blueLight;

          // Build mirrored polygon path from points
          const sortedPts = [...item.points].sort((a, b) => a.val - b.val);
          const rightHalf = sortedPts.map((p) => {
            const x = xCenter + p.density * maxViolinHalfW;
            const y = getY(p.val);
            return `${x},${y}`;
          });
          const leftHalf = [...sortedPts].reverse().map((p) => {
            const x = xCenter - p.density * maxViolinHalfW;
            const y = getY(p.val);
            return `${x},${y}`;
          });
          const pathD = `M ${leftHalf[leftHalf.length - 1]} L ${rightHalf.join(" L ")} L ${leftHalf.join(" L ")} Z`;

          return (
            <g
              key={idx}
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Violin Mirrored KDE Shape */}
              <path
                d={pathD}
                fill={color}
                fillOpacity={isHovered ? 0.6 : 0.35}
                stroke={isHovered ? "#FFFFFF" : color}
                strokeWidth={isHovered ? 1.5 : 1}
              />

              {/* Center Line (Mini Box Plot) */}
              <line
                x1={xCenter}
                y1={getY(item.q1)}
                x2={xCenter}
                y2={getY(item.q3)}
                stroke="#FFFFFF"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* White Median Point */}
              <circle
                cx={xCenter}
                cy={getY(item.median)}
                r="3"
                fill="#FFFFFF"
              />

              {/* Category label below */}
              <text
                x={xCenter}
                y={height - padBottom + 16}
                textAnchor="middle"
                fontSize="10"
                fill={isHovered ? "#F4F6FA" : "#8F9AAF"}
                fontWeight={isHovered ? 600 : 400}
              >
                {item.label.length > 12 ? item.label.substring(0, 11) + "…" : item.label}
              </text>

              {/* Floating Tooltip readout on hover */}
              {isHovered && (
                <g>
                  <rect
                    x={xCenter - 50}
                    y={padTop + 4}
                    width="100"
                    height="36"
                    fill="#0D1424"
                    stroke="rgba(36, 118, 232, 0.4)"
                    rx="4"
                    filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
                  />
                  <text
                    x={xCenter}
                    y={padTop + 18}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight="bold"
                    fill="#F5B942"
                  >
                    Median: {item.median}{unit}
                  </text>
                  <text
                    x={xCenter}
                    y={padTop + 30}
                    textAnchor="middle"
                    fontSize="8.5"
                    fill="#A9B2C3"
                    fontFamily="monospace"
                  >
                    IQR: [{item.q1} - {item.q3}]
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
