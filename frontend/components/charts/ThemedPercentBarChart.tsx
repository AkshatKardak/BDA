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

interface PercentBarConfig {
  key: string;
  name: string;
  color: string;
}

interface ThemedPercentBarChartProps {
  data: any[];
  xKey: string;
  bars: PercentBarConfig[];
  unit?: string;
  layout?: "horizontal" | "vertical";
}

export default function ThemedPercentBarChart({
  data,
  xKey,
  bars,
  unit = "%",
  layout = "horizontal",
}: ThemedPercentBarChartProps) {
  if (!data || data.length === 0) return null;

  // Normalize data so that the specified keys sum up to 100%
  const normalizedData = data.map((item) => {
    const total = bars.reduce((sum, b) => sum + (Number(item[b.key]) || 0), 0);
    const newItem = { ...item };
    bars.forEach((b) => {
      const val = Number(item[b.key]) || 0;
      newItem[`${b.key}_pct`] = total > 0 ? Number(((val / total) * 100).toFixed(1)) : 0;
      newItem[`${b.key}_raw`] = val;
    });
    return newItem;
  });

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={normalizedData}
        layout={layout}
        margin={{ top: 8, right: 16, left: layout === "vertical" ? 24 : -12, bottom: 4 }}
      >
        <CartesianGrid {...chartGridStyle} />
        {layout === "horizontal" ? (
          <>
            <XAxis dataKey={xKey} {...chartAxisStyle} />
            <YAxis {...chartAxisStyle} domain={[0, 100]} unit={unit} />
          </>
        ) : (
          <>
            <XAxis type="number" {...chartAxisStyle} domain={[0, 100]} unit={unit} />
            <YAxis type="category" dataKey={xKey} {...chartAxisStyle} width={80} />
          </>
        )}
        <Tooltip
          cursor={{ fill: "rgba(22, 93, 204, 0.08)" }}
          contentStyle={chartTooltipStyle}
          formatter={(val: any, name: any, item: any) => {
            const bar = bars.find((b) => b.name === name);
            const raw = bar ? item.payload[`${bar.key}_raw`] : "";
            return [
              `${val}% ${raw !== undefined ? `(${Number(raw).toLocaleString()} total)` : ""}`,
              name,
            ];
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          iconType="circle"
        />
        {bars.map((b, idx) => (
          <Bar
            key={b.key}
            dataKey={`${b.key}_pct`}
            name={b.name}
            fill={b.color}
            stackId="pctStack"
            radius={idx === bars.length - 1 ? (layout === "horizontal" ? [4, 4, 0, 0] : [0, 4, 4, 0]) : [0, 0, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
