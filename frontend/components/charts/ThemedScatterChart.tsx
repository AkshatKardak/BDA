"use client";

import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from "recharts";
import { CHART_COLORS, chartTooltipStyle, chartAxisStyle, chartGridStyle } from "./chartTheme";

interface ThemedScatterChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  nameKey?: string;
  xName: string;
  yName: string;
  color?: string;
  xUnit?: string;
  yUnit?: string;
  xDomain?: any;
  yDomain?: any;
}

export default function ThemedScatterChart({
  data,
  xKey,
  yKey,
  nameKey = "name",
  xName,
  yName,
  color = CHART_COLORS.blueVibrant,
  xUnit = "",
  yUnit = "",
  xDomain,
  yDomain,
}: ThemedScatterChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ScatterChart margin={{ top: 12, right: 16, bottom: 8, left: -4 }}>
        <CartesianGrid {...chartGridStyle} />
        <XAxis
          type="number"
          dataKey={xKey}
          name={xName}
          unit={xUnit}
          {...chartAxisStyle}
          domain={xDomain}
        />
        <YAxis
          type="number"
          dataKey={yKey}
          name={yName}
          unit={yUnit}
          {...chartAxisStyle}
          domain={yDomain}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3", stroke: "rgba(255,255,255,0.2)" }}
          contentStyle={chartTooltipStyle}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const d = payload[0].payload;
              return (
                <div style={chartTooltipStyle}>
                  <p className="font-bold text-white mb-1">{d[nameKey] || "Record"}</p>
                  <p className="text-[11px] text-[#A9B2C3]">
                    {xName}: <strong className="text-[#F5B942]">{d[xKey]}{xUnit ? " " + xUnit : ""}</strong>
                  </p>
                  <p className="text-[11px] text-[#A9B2C3]">
                    {yName}: <strong className="text-[#2476E8]">{d[yKey]}{yUnit ? " " + yUnit : ""}</strong>
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
        <Scatter name={`${xName} vs ${yName}`} data={data} fill={color}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || color}
              stroke="#0A101D"
              strokeWidth={1}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}
