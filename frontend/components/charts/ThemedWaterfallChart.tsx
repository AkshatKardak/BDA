"use client";

import React, { useState } from "react";
import { CHART_COLORS } from "./chartTheme";
import EmptyChartState from "./EmptyChartState";

export interface WaterfallStep {
  name: string;
  value: number; // Increment/decrement or total
  isTotal?: boolean;
  color?: string;
}

interface ThemedWaterfallChartProps {
  data: WaterfallStep[];
  unit?: string;
}

export default function ThemedWaterfallChart({
  data,
  unit = "runs",
}: ThemedWaterfallChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return <EmptyChartState />;

  // Calculate cumulative heights and maximum for scaling
  let runningTotal = 0;
  const processed = data.map((step) => {
    if (step.isTotal) {
      return {
        ...step,
        start: 0,
        end: step.value !== undefined ? step.value : runningTotal,
        delta: step.value !== undefined ? step.value : runningTotal,
      };
    }
    const start = runningTotal;
    runningTotal += step.value;
    return {
      ...step,
      start,
      end: runningTotal,
      delta: step.value,
    };
  });

  const maxVal = Math.max(...processed.map((p) => Math.max(p.start, p.end)), 1) * 1.1;

  const width = 500;
  const height = 240;
  const padBottom = 32;
  const padTop = 16;
  const padLeft = 40;
  const padRight = 20;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const colWidth = chartW / processed.length;
  const barW = Math.min(colWidth * 0.65, 48);

  const getY = (val: number) => padTop + chartH - (val / maxVal) * chartH;

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const val = Math.round(pct * maxVal);
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

        {/* Waterfall Bars & Connectors */}
        {processed.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          const xCenter = padLeft + idx * colWidth + colWidth / 2;
          const xBar = xCenter - barW / 2;
          const yTop = getY(Math.max(item.start, item.end));
          const yBottom = getY(Math.min(item.start, item.end));
          const barH = Math.max(yBottom - yTop, 2);

          const defaultColor = item.isTotal
            ? CHART_COLORS.goldPrimary
            : item.delta >= 0
            ? CHART_COLORS.blueLight
            : CHART_COLORS.redAccent;
          const color = item.color || defaultColor;

          // Connector line to next item if not last
          const hasNext = idx < processed.length - 1;
          const nextItem = processed[idx + 1];
          const nextY = getY(item.end);
          const nextX = padLeft + (idx + 1) * colWidth + (colWidth - barW) / 2;

          return (
            <g
              key={idx}
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Connector */}
              {hasNext && (
                <line
                  x1={xBar + barW}
                  y1={nextY}
                  x2={nextX}
                  y2={nextY}
                  stroke="rgba(255, 255, 255, 0.2)"
                  strokeDasharray="2 2"
                />
              )}

              {/* Bar */}
              <rect
                x={xBar}
                y={yTop}
                width={barW}
                height={barH}
                fill={color}
                fillOpacity={isHovered ? 1 : 0.85}
                rx="3"
                stroke={isHovered ? "#FFFFFF" : "none"}
                strokeWidth={isHovered ? 1.5 : 0}
              />

              {/* Value label above bar */}
              <text
                x={xCenter}
                y={yTop - 5}
                textAnchor="middle"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="600"
                fill={isHovered ? "#FFFFFF" : "#F4F6FA"}
              >
                {item.delta > 0 && !item.isTotal ? `+${item.delta}` : item.delta}
              </text>

              {/* Category label below */}
              <text
                x={xCenter}
                y={height - padBottom + 16}
                textAnchor="middle"
                fontSize="10"
                fill={isHovered ? "#F4F6FA" : "#8F9AAF"}
                fontWeight={isHovered ? 600 : 400}
              >
                {item.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
