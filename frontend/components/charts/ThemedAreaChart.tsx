"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import { CHART_COLORS, chartTooltipStyle, chartAxisStyle, chartGridStyle } from "./chartTheme";
import EmptyChartState from "./EmptyChartState";

interface ThemedAreaChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  areaName?: string;
  color?: string;
  unit?: string;
  yDomain?: any;
}

export default function ThemedAreaChart({
  data,
  xKey,
  yKey,
  areaName = "Trajectory",
  color = CHART_COLORS.blueVibrant,
  unit = "",
  yDomain,
}: ThemedAreaChartProps) {
  if (!data || data.length === 0) return <EmptyChartState />;

  const gradientId = `area-gradient-${yKey.replace(/[^a-zA-Z0-9]/g, "")}`;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 8, right: 12, left: -12, bottom: 4 }}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.4} />
            <stop offset="95%" stopColor={color} stopOpacity={0.0} />
          </linearGradient>
        </defs>
        <CartesianGrid {...chartGridStyle} />
        <XAxis dataKey={xKey} {...chartAxisStyle} />
        <YAxis {...chartAxisStyle} domain={yDomain} />
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(value: any) => [`${Number(value).toLocaleString()}${unit ? " " + unit : ""}`, areaName]}
        />
        <Legend
          wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          iconType="circle"
        />
        <Area
          type="monotone"
          dataKey={yKey}
          name={areaName}
          stroke={color}
          strokeWidth={2.2}
          fillOpacity={1}
          fill={`url(#${gradientId})`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
