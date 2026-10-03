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
  ReferenceLine,
  Cell
} from "recharts";
import { CHART_COLORS, chartTooltipStyle, chartAxisStyle, chartGridStyle } from "./chartTheme";

interface ThemedDivergingBarChartProps {
  data: any[];
  xKey: string; // Metric key, e.g. "diff" or "win_pct_diff"
  yKey: string; // Label key, e.g. "team"
  baseline?: number; // E.g. 0 or 50
  barName?: string;
  positiveColor?: string;
  negativeColor?: string;
  unit?: string;
}

export default function ThemedDivergingBarChart({
  data,
  xKey,
  yKey,
  baseline = 0,
  barName = "Net Diff",
  positiveColor = CHART_COLORS.greenAccent,
  negativeColor = CHART_COLORS.redAccent,
  unit = "%",
}: ThemedDivergingBarChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 8, right: 24, left: 32, bottom: 4 }}
      >
        <CartesianGrid {...chartGridStyle} horizontal={false} vertical={true} />
        <XAxis
          type="number"
          {...chartAxisStyle}
          tickFormatter={(val) => `${val > 0 ? "+" : ""}${val}${unit}`}
        />
        <YAxis
          type="category"
          dataKey={yKey}
          {...chartAxisStyle}
          width={90}
          tick={{ fill: "#F4F6FA", fontSize: 11, fontWeight: 500 }}
        />
        <ReferenceLine x={baseline} stroke="rgba(255, 255, 255, 0.25)" strokeDasharray="3 3" />
        <Tooltip
          cursor={{ fill: "rgba(22, 93, 204, 0.08)" }}
          contentStyle={chartTooltipStyle}
          formatter={(value: any) => [
            `${Number(value) > 0 ? "+" : ""}${Number(value).toFixed(2)}${unit}`,
            barName,
          ]}
        />
        <Bar dataKey={xKey} name={barName}>
          {data.map((entry, index) => {
            const val = Number(entry[xKey]) || 0;
            const fill = val >= baseline ? positiveColor : negativeColor;
            return <Cell key={`cell-${index}`} fill={fill} />;
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
