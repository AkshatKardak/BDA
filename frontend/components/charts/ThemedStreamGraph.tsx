"use client";

import React, { useState } from "react";
import { CHART_PALETTES } from "./chartTheme";

interface StreamSeries {
  key: string;
  name: string;
  color: string;
}

interface ThemedStreamGraphProps {
  data: any[];
  xKey: string;
  series: StreamSeries[];
  unit?: string;
}

export default function ThemedStreamGraph({
  data,
  xKey,
  series,
  unit = "runs",
}: ThemedStreamGraphProps) {
  const [activeSeries, setActiveSeries] = useState<string | null>(null);

  if (!data || data.length < 2 || series.length === 0) return null;

  const width = 600;
  const height = 260;
  const paddingX = 40;
  const paddingY = 24;
  const chartW = width - paddingX * 2;
  const chartH = height - paddingY * 2;
  const centerY = height / 2;

  // Calculate totals and max total for scaling
  const totals = data.map((d) =>
    series.reduce((sum, s) => sum + (Number(d[s.key]) || 0), 0)
  );
  const maxTotal = Math.max(...totals, 1);
  const scaleY = (chartH * 0.85) / maxTotal;

  // Build baseline y0 and cumulative y for each series
  // y0 = centerY - (total * scaleY) / 2
  const layers: { key: string; name: string; color: string; path: string; avgVal: number }[] = [];

  // For each series, we calculate upper and lower bounds at each x
  // We compute baseline offsets at each step
  const baselines = totals.map((t) => centerY - (t * scaleY) / 2);
  const currentOffsets = [...baselines];

  series.forEach((s) => {
    const topPoints: { x: number; y: number }[] = [];
    const bottomPoints: { x: number; y: number }[] = [];
    let sumVal = 0;

    data.forEach((d, idx) => {
      const x = paddingX + (idx / (data.length - 1)) * chartW;
      const val = Number(d[s.key]) || 0;
      sumVal += val;
      const yBottom = currentOffsets[idx];
      const yTop = yBottom + val * scaleY;

      bottomPoints.push({ x, y: yBottom });
      topPoints.push({ x, y: yTop });

      currentOffsets[idx] = yTop; // shift offset for next layer
    });

    // Generate smooth SVG path connecting topPoints from left to right, then bottomPoints right to left
    let pathD = `M ${topPoints[0].x} ${topPoints[0].y}`;
    for (let i = 0; i < topPoints.length - 1; i++) {
      const p0 = topPoints[i];
      const p1 = topPoints[i + 1];
      const mx = (p0.x + p1.x) / 2;
      pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    // Connect to bottom right
    const lastBottom = bottomPoints[bottomPoints.length - 1];
    pathD += ` L ${lastBottom.x} ${lastBottom.y}`;
    for (let i = bottomPoints.length - 1; i > 0; i--) {
      const p0 = bottomPoints[i];
      const p1 = bottomPoints[i - 1];
      const mx = (p0.x + p1.x) / 2;
      pathD += ` C ${mx} ${p0.y}, ${mx} ${p1.y}, ${p1.x} ${p1.y}`;
    }
    pathD += " Z";

    layers.push({
      key: s.key,
      name: s.name,
      color: s.color,
      path: pathD,
      avgVal: Math.round(sumVal / data.length),
    });
  });

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="relative w-full flex-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full select-none"
          preserveAspectRatio="none"
        >
          {/* Subtle center baseline guide */}
          <line
            x1={paddingX}
            y1={centerY}
            x2={width - paddingX}
            y2={centerY}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeDasharray="3 3"
          />

          {/* Render Stream Layers */}
          {layers.map((layer) => {
            const isHovered = activeSeries === layer.key;
            const isOther = activeSeries !== null && !isHovered;

            return (
              <path
                key={layer.key}
                d={layer.path}
                fill={layer.color}
                fillOpacity={isHovered ? 0.9 : isOther ? 0.25 : 0.75}
                stroke={isHovered ? "#FFFFFF" : layer.color}
                strokeWidth={isHovered ? 1.5 : 0.5}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setActiveSeries(layer.key)}
                onMouseLeave={() => setActiveSeries(null)}
              />
            );
          })}

          {/* X-axis tick labels */}
          {data.map((d, idx) => {
            if (idx % Math.ceil(data.length / 7) !== 0 && idx !== data.length - 1) return null;
            const x = paddingX + (idx / (data.length - 1)) * chartW;
            return (
              <text
                key={idx}
                x={x}
                y={height - 6}
                textAnchor="middle"
                fontSize="10"
                fill="#707B91"
                fontFamily="monospace"
              >
                {String(d[xKey])}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Legend / Interactive Tags */}
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px]">
        {layers.map((l) => (
          <button
            key={l.key}
            type="button"
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded transition-all ${
              activeSeries === l.key
                ? "bg-[rgba(255,255,255,0.1)] text-[#F4F6FA] font-medium"
                : "text-[#8F9AAF] hover:text-[#F4F6FA]"
            }`}
            onMouseEnter={() => setActiveSeries(l.key)}
            onMouseLeave={() => setActiveSeries(null)}
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: l.color }}
            />
            <span>{l.name}</span>
            <span className="text-[10px] text-[#707B91] font-mono">
              (~{l.avgVal.toLocaleString()} {unit})
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
