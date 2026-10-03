"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import { CHART_COLORS, chartTooltipStyle, chartAxisStyle, chartGridStyle } from "./chartTheme";

interface ThemedStepLineChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  lineName?: string;
  color?: string;
  unit?: string;
  yDomain?: [number, number];
}

export default function ThemedStepLineChart({
  data,
  xKey,
  yKey,
  lineName = "Cumulative Wickets",
  color = CHART_COLORS.redAccent,
  unit = "",
  yDomain,
}: ThemedStepLineChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 8, right: 16, left: -12, bottom: 4 }}
      >
        <CartesianGrid {...chartGridStyle} />
        <XAxis dataKey={xKey} {...chartAxisStyle} />
        <YAxis {...chartAxisStyle} domain={yDomain} />
        <Tooltip
          cursor={{ stroke: "rgba(36, 118, 232, 0.4)", strokeWidth: 1 }}
          contentStyle={chartTooltipStyle}
          formatter={(value: any) => [
            `${Number(value).toLocaleString()}${unit ? " " + unit : ""}`,
            lineName,
          ]}
        />
        <Legend
          wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          iconType="circle"
        />
        <Line
          type="stepAfter"
          dataKey={yKey}
          name={lineName}
          stroke={color}
          strokeWidth={2.5}
          dot={{ r: 3, fill: color, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#FFFFFF", stroke: color, strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
