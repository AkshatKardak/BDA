"use client";

import React, { useState } from "react";
import { CHART_COLORS } from "./chartTheme";

export interface BoxPlotItem {
  label: string;
  min: number;
  q1: number;
  median: number;
  q3: number;
  max: number;
  outliers?: number[];
  color?: string;
}

interface ThemedBoxPlotProps {
  data: BoxPlotItem[];
  unit?: string;
  yLabel?: string;
}

export default function ThemedBoxPlot({
  data,
  unit = "",
  yLabel = "",
}: ThemedBoxPlotProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const width = 540;
  const height = 260;
  const padLeft = 44;
  const padRight = 20;
  const padTop = 20;
  const padBottom = 36;
  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  // Calculate global min and max
  const allMins = data.map((d) => d.min);
  const allMaxs = data.map((d) => (d.outliers && d.outliers.length > 0 ? Math.max(d.max, ...d.outliers) : d.max));
  const globalMin = Math.floor(Math.min(...allMins) * 0.95);
  const globalMax = Math.ceil(Math.max(...allMaxs) * 1.05) || 1;
  const range = globalMax - globalMin || 1;

  const getY = (val: number) => padTop + chartH - ((val - globalMin) / range) * chartH;
  const colWidth = chartW / data.length;
  const boxWidth = Math.min(colWidth * 0.55, 42);

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const val = Math.round(globalMin + pct * range);
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

        {/* Box Plot columns */}
        {data.map((item, idx) => {
          const isHovered = hoveredIdx === idx;
          const xCenter = padLeft + idx * colWidth + colWidth / 2;
          const xLeft = xCenter - boxWidth / 2;
          const yMin = getY(item.min);
          const yQ1 = getY(item.q1);
          const yMedian = getY(item.median);
          const yQ3 = getY(item.q3);
          const yMax = getY(item.max);
          const color = item.color || CHART_COLORS.blueLight;

          return (
            <g
              key={idx}
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {/* Whiskers (vertical stem min -> q1 and q3 -> max) */}
              <line
                x1={xCenter}
                y1={yMin}
                x2={xCenter}
                y2={yQ1}
                stroke={color}
                strokeWidth={isHovered ? 2 : 1.5}
                strokeDasharray="2 2"
              />
              <line
                x1={xCenter}
                y1={yQ3}
                x2={xCenter}
                y2={yMax}
                stroke={color}
                strokeWidth={isHovered ? 2 : 1.5}
                strokeDasharray="2 2"
              />

              {/* Whisker caps */}
              <line
                x1={xCenter - boxWidth * 0.3}
                y1={yMin}
                x2={xCenter + boxWidth * 0.3}
                y2={yMin}
                stroke={color}
                strokeWidth="1.5"
              />
              <line
                x1={xCenter - boxWidth * 0.3}
                y1={yMax}
                x2={xCenter + boxWidth * 0.3}
                y2={yMax}
                stroke={color}
                strokeWidth="1.5"
              />

              {/* IQR Box (Q1 to Q3) */}
              <rect
                x={xLeft}
                y={yQ3}
                width={boxWidth}
                height={Math.max(yQ1 - yQ3, 2)}
                fill={color}
                fillOpacity={isHovered ? 0.35 : 0.2}
                stroke={isHovered ? "#FFFFFF" : color}
                strokeWidth={isHovered ? 2 : 1.5}
                rx="2"
              />

              {/* Median Line */}
              <line
                x1={xLeft}
                y1={yMedian}
                x2={xLeft + boxWidth}
                y2={yMedian}
                stroke={CHART_COLORS.goldPrimary}
                strokeWidth="2.5"
              />

              {/* Outliers */}
              {item.outliers?.map((outlier, oIdx) => (
                <circle
                  key={oIdx}
                  cx={xCenter}
                  cy={getY(outlier)}
                  r="3"
                  fill="none"
                  stroke={CHART_COLORS.redAccent}
                  strokeWidth="1.5"
                />
              ))}

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
                    x={xCenter - 54}
                    y={Math.max(yMax - 54, 4)}
                    width="108"
                    height="48"
                    fill="#0D1424"
                    stroke="rgba(36, 118, 232, 0.4)"
                    rx="4"
                    filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))"
                  />
                  <text
                    x={xCenter}
                    y={Math.max(yMax - 54, 4) + 16}
                    textAnchor="middle"
                    fontSize="9"
                    fontWeight="bold"
                    fill="#F5B942"
                  >
                    Median: {item.median}{unit}
                  </text>
                  <text
                    x={xCenter}
                    y={Math.max(yMax - 54, 4) + 30}
                    textAnchor="middle"
                    fontSize="8.5"
                    fill="#A9B2C3"
                    fontFamily="monospace"
                  >
                    IQR: [{item.q1} - {item.q3}]
                  </text>
                  <text
                    x={xCenter}
                    y={Math.max(yMax - 54, 4) + 42}
                    textAnchor="middle"
                    fontSize="8"
                    fill="#707B91"
                    fontFamily="monospace"
                  >
                    Range: {item.min} - {item.max}
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
