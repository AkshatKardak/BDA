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

export interface HistogramBin {
  bin: string;
  count: number;
  pct?: number;
}

interface ThemedHistogramProps {
  data?: HistogramBin[];
  values?: number[];
  binCount?: number;
  barName?: string;
  color?: string;
  unit?: string;
}

export default function ThemedHistogram({
  data,
  values,
  binCount = 6,
  barName = "Matches",
  color = CHART_COLORS.blueLight,
  unit = "matches",
}: ThemedHistogramProps) {
  let chartData: HistogramBin[] = [];

  if (data && data.length > 0) {
    chartData = data;
  } else if (values && values.length > 0) {
    // Automatically bin values
    const min = Math.min(...values);
    const max = Math.max(...values);
    const step = Math.ceil((max - min) / binCount) || 1;
    const bins: { [key: string]: number } = {};

    for (let i = 0; i < binCount; i++) {
      const bMin = min + i * step;
      const bMax = bMin + step - 1;
      const label = `${bMin}-${bMax}`;
      bins[label] = 0;
    }

    values.forEach((v) => {
      for (let i = 0; i < binCount; i++) {
        const bMin = min + i * step;
        const bMax = bMin + step - 1;
        const label = `${bMin}-${bMax}`;
        if (v >= bMin && (i === binCount - 1 ? v <= bMax + 1 : v <= bMax)) {
          bins[label] = (bins[label] || 0) + 1;
          break;
        }
      }
    });

    chartData = Object.entries(bins).map(([bin, count]) => ({
      bin,
      count,
      pct: Number(((count / values.length) * 100).toFixed(1)),
    }));
  }

  if (!chartData || chartData.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{ top: 8, right: 16, left: -16, bottom: 4 }}
        barCategoryGap={2}
      >
        <CartesianGrid {...chartGridStyle} />
        <XAxis dataKey="bin" {...chartAxisStyle} />
        <YAxis {...chartAxisStyle} />
        <Tooltip
          cursor={{ fill: "rgba(22, 93, 204, 0.08)" }}
          contentStyle={chartTooltipStyle}
          formatter={(value: any, name: any, item: any) => [
            `${Number(value).toLocaleString()} ${unit} (${item.payload.pct || Math.round((Number(value) / chartData.reduce((s, c) => s + c.count, 0)) * 100)}%)`,
            barName,
          ]}
        />
        <Bar dataKey="count" name={barName} fill={color} radius={[3, 3, 0, 0]}>
          {chartData.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={color}
              fillOpacity={0.75 + (index / chartData.length) * 0.25}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
