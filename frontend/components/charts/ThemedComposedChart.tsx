"use client";

import React from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import { chartTooltipStyle, chartAxisStyle, chartGridStyle, CHART_COLORS } from "./chartTheme";

interface ThemedComposedChartProps {
  data: any[];
  xKey: string;
  barKey: string;
  barName: string;
  barColor?: string;
  lineKey: string;
  lineName: string;
  lineColor?: string;
  barUnit?: string;
  lineUnit?: string;
  leftYDomain?: [number, number];
  rightYDomain?: [number, number];
}

export default function ThemedComposedChart({
  data,
  xKey,
  barKey,
  barName,
  barColor = CHART_COLORS.blueLight,
  lineKey,
  lineName,
  lineColor = CHART_COLORS.goldPrimary,
  barUnit = "",
  lineUnit = "",
  leftYDomain,
  rightYDomain,
}: ThemedComposedChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
        data={data}
        margin={{ top: 8, right: 16, left: -12, bottom: 4 }}
      >
        <CartesianGrid {...chartGridStyle} />
        <XAxis dataKey={xKey} {...chartAxisStyle} />
        {/* Left Y-Axis for Bar metric */}
        <YAxis
          yAxisId="left"
          {...chartAxisStyle}
          domain={leftYDomain}
          tickFormatter={(v) => Number(v) >= 1000 ? `${(Number(v) / 1000).toFixed(0)}k` : v}
        />
        {/* Right Y-Axis for Line metric */}
        <YAxis
          yAxisId="right"
          orientation="right"
          {...chartAxisStyle}
          domain={rightYDomain}
          tickFormatter={(v) => `${Number(v).toFixed(1)}${lineUnit}`}
        />
        <Tooltip
          cursor={{ fill: "rgba(22, 93, 204, 0.08)" }}
          contentStyle={chartTooltipStyle}
          formatter={(value: any, name: any) => {
            if (name === barName) {
              return [`${Number(value).toLocaleString()}${barUnit ? " " + barUnit : ""}`, name];
            }
            return [`${Number(value).toLocaleString()}${lineUnit ? " " + lineUnit : ""}`, name];
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          iconType="circle"
        />
        <Bar
          yAxisId="left"
          dataKey={barKey}
          name={barName}
          fill={barColor}
          radius={[3, 3, 0, 0]}
          opacity={0.85}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey={lineKey}
          name={lineName}
          stroke={lineColor}
          strokeWidth={2.5}
          dot={{ r: 3, fill: lineColor, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: "#FFFFFF", stroke: lineColor, strokeWidth: 2 }}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}
