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
import { chartTooltipStyle, chartAxisStyle, chartGridStyle } from "./chartTheme";
import EmptyChartState from "./EmptyChartState";

interface LineConfig {
  key: string;
  name: string;
  color: string;
  strokeDasharray?: string;
}

interface ThemedMultiLineChartProps {
  data: any[];
  xKey: string;
  lines: LineConfig[];
  unit?: string;
  yDomain?: any;
}

export default function ThemedMultiLineChart({
  data,
  xKey,
  lines,
  unit = "",
  yDomain,
}: ThemedMultiLineChartProps) {
  if (!data || data.length === 0) return <EmptyChartState />;

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
          formatter={(value: any, name: any) => [
            `${Number(value).toLocaleString()}${unit ? " " + unit : ""}`,
            name,
          ]}
        />
        <Legend
          wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          iconType="plainline"
        />
        {lines.map((l) => (
          <Line
            key={l.key}
            type="monotone"
            dataKey={l.key}
            name={l.name}
            stroke={l.color}
            strokeWidth={2.2}
            strokeDasharray={l.strokeDasharray}
            dot={{ r: 3, fill: l.color }}
            activeDot={{ r: 5, stroke: "#F7F8FC", strokeWidth: 1.5 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
