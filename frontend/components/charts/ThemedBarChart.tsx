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

interface ThemedBarChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  barName?: string;
  color?: string;
  horizontal?: boolean;
  colorMap?: (entry: any, index: number) => string;
  unit?: string;
  yDomain?: [number, number];
}

export default function ThemedBarChart({
  data,
  xKey,
  yKey,
  barName = "Value",
  color = CHART_COLORS.blueVibrant,
  horizontal = false,
  colorMap,
  unit = "",
  yDomain,
}: ThemedBarChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 8, right: 12, left: horizontal ? 24 : -12, bottom: 4 }}
      >
        <CartesianGrid {...chartGridStyle} />
        {horizontal ? (
          <>
            <XAxis type="number" {...chartAxisStyle} domain={yDomain} />
            <YAxis
              type="category"
              dataKey={xKey}
              {...chartAxisStyle}
              width={80}
              tick={{ fill: "#A9B2C3", fontSize: 10 }}
            />
          </>
        ) : (
          <>
            <XAxis dataKey={xKey} {...chartAxisStyle} />
            <YAxis {...chartAxisStyle} domain={yDomain} />
          </>
        )}
        <Tooltip
          cursor={{ fill: "rgba(22, 93, 204, 0.08)" }}
          contentStyle={chartTooltipStyle}
          formatter={(value: any) => [`${Number(value).toLocaleString()}${unit ? " " + unit : ""}`, barName]}
        />
        <Bar
          dataKey={yKey}
          name={barName}
          fill={color}
          radius={horizontal ? [0, 4, 4, 0] : [4, 4, 0, 0]}
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
