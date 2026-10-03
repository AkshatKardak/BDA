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
  Cell
} from "recharts";
import { CHART_COLORS, chartTooltipStyle, chartAxisStyle, chartGridStyle } from "./chartTheme";

interface ThemedHorizontalBarChartProps {
  data: any[];
  xKey: string; // The metric value key
  yKey: string; // The category label key (e.g. player name)
  barName?: string;
  color?: string;
  colorMap?: (entry: any, index: number) => string;
  unit?: string;
  xDomain?: [number, number];
}

export default function ThemedHorizontalBarChart({
  data,
  xKey,
  yKey,
  barName = "Value",
  color = CHART_COLORS.goldPrimary,
  colorMap,
  unit = "",
  xDomain,
}: ThemedHorizontalBarChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 24, left: 32, bottom: 4 }}
      >
        <CartesianGrid {...chartGridStyle} horizontal={false} vertical={true} />
        <XAxis type="number" {...chartAxisStyle} domain={xDomain} />
        <YAxis
          type="category"
          dataKey={yKey}
          {...chartAxisStyle}
          width={90}
          tick={{ fill: "#F4F6FA", fontSize: 11, fontWeight: 500 }}
        />
        <Tooltip
          cursor={{ fill: "rgba(22, 93, 204, 0.08)" }}
          contentStyle={chartTooltipStyle}
          formatter={(value: any) => [`${Number(value).toLocaleString()}${unit ? " " + unit : ""}`, barName]}
        />
        <Bar
          dataKey={xKey}
          name={barName}
          fill={color}
          radius={[0, 4, 4, 0]}
        >
          {colorMap &&
            data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colorMap(entry, index)} />
            ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
