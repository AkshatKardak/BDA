"use client";

import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";
import { chartTooltipStyle, chartAxisStyle, chartGridStyle, CHART_COLORS, CHART_PALETTES } from "./chartTheme";

export interface BubblePoint {
  name: string;
  x: number;
  y: number;
  z: number; // Size dimension (e.g. matches played)
  color?: string;
}

interface ThemedBubbleChartProps {
  data: BubblePoint[];
  xName?: string;
  yName?: string;
  zName?: string;
  xUnit?: string;
  yUnit?: string;
  zUnit?: string;
  xDomain?: [number, number];
  yDomain?: [number, number];
  zRange?: [number, number];
}

export default function ThemedBubbleChart({
  data,
  xName = "Avg First Innings Score",
  yName = "Chasing Win %",
  zName = "Matches Hosted",
  xUnit = "",
  yUnit = "%",
  zUnit = "matches",
  xDomain,
  yDomain,
  zRange = [40, 400],
}: ThemedBubbleChartProps) {
  if (!data || data.length === 0) return null;

  const palette = CHART_PALETTES.sports;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart
        margin={{ top: 12, right: 24, bottom: 12, left: -4 }}
      >
        <CartesianGrid {...chartGridStyle} />
        <XAxis
          type="number"
          dataKey="x"
          name={xName}
          unit={xUnit}
          {...chartAxisStyle}
          domain={xDomain}
        />
        <YAxis
          type="number"
          dataKey="y"
          name={yName}
          unit={yUnit}
          {...chartAxisStyle}
          domain={yDomain}
        />
        <ZAxis
          type="number"
          dataKey="z"
          range={zRange}
          name={zName}
          unit={zUnit}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.2)" }}
          contentStyle={chartTooltipStyle}
          content={({ active, payload }) => {
            if (!active || !payload || !payload.length) return null;
            const p = payload[0].payload as BubblePoint;
            return (
              <div
                style={chartTooltipStyle}
                className="text-xs p-2 rounded border border-[rgba(255,255,255,0.1)] bg-[#0D1424] shadow-lg"
              >
                <div className="font-bold text-[#F4F6FA] mb-1">{p.name}</div>
                <div className="text-[#8F9AAF] flex justify-between gap-3">
                  <span>{xName}:</span>
                  <span className="font-mono text-[#F5B942]">
                    {p.x} {xUnit}
                  </span>
                </div>
                <div className="text-[#8F9AAF] flex justify-between gap-3">
                  <span>{yName}:</span>
                  <span className="font-mono text-[#2FBF71]">
                    {p.y} {yUnit}
                  </span>
                </div>
                <div className="text-[#8F9AAF] flex justify-between gap-3">
                  <span>{zName}:</span>
                  <span className="font-mono text-[#2476E8]">
                    {p.z} {zUnit}
                  </span>
                </div>
              </div>
            );
          }}
        />
        <Scatter name="Entities" data={data}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || palette[index % palette.length]}
              fillOpacity={0.75}
              stroke="#FFFFFF"
              strokeWidth={1}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
