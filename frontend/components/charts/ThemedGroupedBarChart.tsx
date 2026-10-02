"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import { chartTooltipStyle, chartAxisStyle, chartGridStyle } from "./chartTheme";

interface BarConfig {
  key: string;
  name: string;
  color: string;
}

interface ThemedGroupedBarChartProps {
  data: any[];
  xKey: string;
  bars: BarConfig[];
  stacked?: boolean;
  unit?: string;
  yDomain?: [number, number];
}

export default function ThemedGroupedBarChart({
  data,
  xKey,
  bars,
  stacked = false,
  unit = "",
  yDomain,
}: ThemedGroupedBarChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 8, right: 12, left: -12, bottom: 4 }}
      >
        <CartesianGrid {...chartGridStyle} />
        <XAxis dataKey={xKey} {...chartAxisStyle} />
        <YAxis {...chartAxisStyle} domain={yDomain} />
        <Tooltip
          cursor={{ fill: "rgba(22, 93, 204, 0.08)" }}
          contentStyle={chartTooltipStyle}
          formatter={(value: any, name: any) => [
            `${Number(value).toLocaleString()}${unit ? " " + unit : ""}`,
            name,
          ]}
        />
        <Legend
          wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          iconType="circle"
        />
        {bars.map((b) => (
          <Bar
            key={b.key}
            dataKey={b.key}
            name={b.name}
            fill={b.color}
            stackId={stacked ? "stack" : undefined}
            radius={stacked ? [0, 0, 0, 0] : [3, 3, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
