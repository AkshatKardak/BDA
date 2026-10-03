"use client";

import React from "react";
import { CHART_COLORS } from "./chartTheme";

interface SparklineProps {
  data: number[];
  width?: number | string;
  height?: number;
  color?: string;
  fillOpacity?: number;
}

export default function Sparkline({
  data,
  width = 72,
  height = 24,
  color = CHART_COLORS.greenAccent,
  fillOpacity = 0.2,
}: SparklineProps) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const paddingY = 3;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * 100;
    // Invert y: high values are near top (paddingY)
    const y = paddingY + (1 - (val - min) / range) * (height - paddingY * 2);
    return { x, y };
  });

  const lineD = points.reduce(
    (acc, curr, idx) => (idx === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`),
    ""
  );

  const areaD = `${lineD} L 100 ${height} L 0 ${height} Z`;

  const lastPoint = points[points.length - 1];

  return (
    <div
      style={{ width: typeof width === "number" ? `${width}px` : width, height: `${height}px` }}
      className="inline-block flex-shrink-0"
    >
      <svg
        viewBox={`0 0 100 ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id={`sparkGrad-${color.replace(/[^a-zA-Z0-9]/g, "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={fillOpacity} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>

        <path
          d={areaD}
          fill={`url(#sparkGrad-${color.replace(/[^a-zA-Z0-9]/g, "")})`}
        />
        <path
          d={lineD}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r="2.5"
          fill={color}
          stroke="#0D1424"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
