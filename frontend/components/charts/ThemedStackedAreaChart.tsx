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
import { chartTooltipStyle, chartAxisStyle, chartGridStyle } from "./chartTheme";

interface AreaSeriesConfig {
  key: string;
  name: string;
  color: string;
}

interface ThemedStackedAreaChartProps {
  data: any[];
  xKey: string;
  series: AreaSeriesConfig[];
  unit?: string;
  yDomain?: [number, number];
}

export default function ThemedStackedAreaChart({
  data,
  xKey,
  series,
  unit = "",
  yDomain,
}: ThemedStackedAreaChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 8, right: 16, left: -12, bottom: 4 }}
      >
        <defs>
          {series.map((s) => (
            <linearGradient key={`grad-${s.key}`} id={`stackedAreaGrad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={s.color} stopOpacity={0.65} />
              <stop offset="95%" stopColor={s.color} stopOpacity={0.05} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid {...chartGridStyle} />
        <XAxis dataKey={xKey} {...chartAxisStyle} />
        <YAxis {...chartAxisStyle} domain={yDomain} />
        <Tooltip
          cursor={{ stroke: "rgba(36, 118, 232, 0.4)", strokeWidth: 1 }}
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
        {series.map((s) => (
          <Area
            key={s.key}
            type="monotone"
            dataKey={s.key}
            name={s.name}
            stackId="1"
            stroke={s.color}
            strokeWidth={1.5}
            fill={`url(#stackedAreaGrad-${s.key})`}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}
