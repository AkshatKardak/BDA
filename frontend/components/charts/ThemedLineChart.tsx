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

interface ThemedLineChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  lineName?: string;
  color?: string;
  unit?: string;
  yDomain?: any;
  strokeWidth?: number;
}

export default function ThemedLineChart({
  data,
  xKey,
  yKey,
  lineName = "Trend",
  color = CHART_COLORS.goldPrimary,
  unit = "",
  yDomain,
  strokeWidth = 2.5,
}: ThemedLineChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 8, right: 12, left: -12, bottom: 4 }}
      >
        <CartesianGrid {...chartGridStyle} />
        <XAxis dataKey={xKey} {...chartAxisStyle} />
        <YAxis {...chartAxisStyle} domain={yDomain} />
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(value: any) => [`${Number(value).toLocaleString()}${unit ? " " + unit : ""}`, lineName]}
        />
        <Legend
          wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          iconType="plainline"
        />
        <Line
          type="monotone"
          dataKey={yKey}
          name={lineName}
          stroke={color}
          strokeWidth={strokeWidth}
          dot={{ r: 3, fill: color }}
          activeDot={{ r: 5, stroke: "#F7F8FC", strokeWidth: 1.5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
