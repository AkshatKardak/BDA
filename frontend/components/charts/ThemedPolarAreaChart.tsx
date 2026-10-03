"use client";

import React, { useState } from "react";
import { CHART_PALETTES } from "./chartTheme";

export interface PolarAreaItem {
  label: string;
  value: number;
  color?: string;
}

interface ThemedPolarAreaChartProps {
  data: PolarAreaItem[];
  unit?: string;
  maxRadiusValue?: number;
}

export default function ThemedPolarAreaChart({
  data,
  unit = "",
  maxRadiusValue,
}: ThemedPolarAreaChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) return null;

  const size = 300;
  const center = size / 2;
  const maxR = 115;

  const values = data.map((d) => d.value);
  const maxVal = maxRadiusValue || Math.max(...values, 1);
  const angleStep = (2 * Math.PI) / data.length;

  const palette = CHART_PALETTES.sports;

  // Polar to Cartesian
  const getXY = (r: number, angle: number) => ({
    x: center + r * Math.cos(angle),
    y: center + r * Math.sin(angle),
  });

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full max-h-[300px] select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Concentric grid rings */}
        {[0.25, 0.5, 0.75, 1].map((pct) => (
          <circle
            key={pct}
            cx={center}
            cy={center}
            r={pct * maxR}
            fill="none"
            stroke="rgba(255, 255, 255, 0.07)"
            strokeDasharray="2 2"
          />
        ))}

        {/* Radial spoke lines */}
        {data.map((_, idx) => {
          const a = idx * angleStep - Math.PI / 2;
          const end = getXY(maxR, a);
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={end.x}
              y2={end.y}
              stroke="rgba(255, 255, 255, 0.07)"
            />
          );
        })}

        {/* Sectors */}
        {data.map((item, idx) => {
          const startA = idx * angleStep - Math.PI / 2;
          const endA = (idx + 1) * angleStep - Math.PI / 2;
          const r = Math.max((item.value / maxVal) * maxR, 12);
          const pStart = getXY(r, startA);
          const pEnd = getXY(r, endA);
          const isHovered = hoveredIdx === idx;
          const color = item.color || palette[idx % palette.length];

          const sectorPath = `M ${center} ${center} L ${pStart.x} ${pStart.y} A ${r} ${r} 0 0 1 ${pEnd.x} ${pEnd.y} Z`;

          // Outer label position
          const midA = (startA + endA) / 2;
          const pLabel = getXY(maxR + 16, midA);

          return (
            <g
              key={idx}
              className="cursor-pointer transition-all duration-150"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <path
                d={sectorPath}
                fill={color}
                fillOpacity={isHovered ? 0.95 : 0.7}
                stroke={isHovered ? "#FFFFFF" : color}
                strokeWidth={isHovered ? 2 : 1}
              />

              {/* Label */}
              <text
                x={pLabel.x}
                y={pLabel.y + 3}
                textAnchor="middle"
                fontSize="10"
                fontFamily="monospace"
                fontWeight={isHovered ? "bold" : "normal"}
                fill={isHovered ? "#F5B942" : "#8F9AAF"}
              >
                {item.label}
              </text>
            </g>
          );
        })}

        {/* Center Readout on Hover */}
        <circle cx={center} cy={center} r={28} fill="#0D1424" stroke="rgba(255, 255, 255, 0.1)" />
        <text
          x={center}
          y={center - 3}
          textAnchor="middle"
          fontSize="9"
          fill="#8F9AAF"
        >
          {hoveredIdx !== null ? data[hoveredIdx].label : "Polar"}
        </text>
        <text
          x={center}
          y={center + 10}
          textAnchor="middle"
          fontSize="10"
          fontFamily="monospace"
          fontWeight="bold"
          fill="#F5B942"
        >
          {hoveredIdx !== null ? `${data[hoveredIdx].value.toLocaleString()} ${unit}` : `${data.length} Sectors`}
        </text>
      </svg>
    </div>
  );
}
