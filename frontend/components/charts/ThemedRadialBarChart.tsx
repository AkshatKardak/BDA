"use client";

import React from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { chartTooltipStyle, CHART_PALETTES } from "./chartTheme";

export interface RadialBarItem {
  name: string;
  value: number;
  fill?: string;
}

interface ThemedRadialBarChartProps {
  data: RadialBarItem[];
  unit?: string;
  maxVal?: number;
}

export default function ThemedRadialBarChart({
  data,
  unit = "",
  maxVal = 100,
}: ThemedRadialBarChartProps) {
  if (!data || data.length === 0) return null;

  const palette = CHART_PALETTES.sports;
  const coloredData = data.map((d, idx) => ({
    ...d,
    fill: d.fill || palette[idx % palette.length],
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadialBarChart
        cx="50%"
        cy="50%"
        innerRadius="25%"
        outerRadius="90%"
        barSize={12}
        data={coloredData}
        startAngle={180}
        endAngle={-180}
      >
        <RadialBar
          background={{ fill: "rgba(255, 255, 255, 0.05)" }}
          dataKey="value"
          cornerRadius={6}
        />
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(value: any, name: any) => [
            `${Number(value).toLocaleString()}${unit ? " " + unit : ""}`,
            name,
          ]}
        />
        <Legend
          iconSize={8}
          iconType="circle"
          layout="horizontal"
          verticalAlign="bottom"
          wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
        />
      </RadialBarChart>
    </ResponsiveContainer>
  );
}
