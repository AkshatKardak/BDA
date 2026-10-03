"use client";

import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend
} from "recharts";
import { chartTooltipStyle, CHART_COLORS } from "./chartTheme";

export interface RadarSeriesConfig {
  key: string;
  name: string;
  color: string;
}

interface ThemedRadarChartProps {
  data: any[];
  subjectKey: string; // The attribute name key (e.g. "metric" or "dimension")
  series: RadarSeriesConfig[];
  domain?: [number, number];
}

export default function ThemedRadarChart({
  data,
  subjectKey,
  series,
  domain = [0, 100],
}: ThemedRadarChartProps) {
  if (!data || data.length === 0) return null;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="3 3" />
        <PolarAngleAxis
          dataKey={subjectKey}
          tick={{ fill: "#A9B2C3", fontSize: 11, fontWeight: 500 }}
        />
        <PolarRadiusAxis
          angle={30}
          domain={domain}
          stroke="rgba(255, 255, 255, 0.15)"
          tick={{ fill: "#707B91", fontSize: 9 }}
        />
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(value: any, name: any) => [
            `${Number(value).toFixed(1)}`,
            name,
          ]}
        />
        <Legend
          wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
          iconType="circle"
        />
        {series.map((s) => (
          <Radar
            key={s.key}
            name={s.name}
            dataKey={s.key}
            stroke={s.color}
            fill={s.color}
            fillOpacity={0.25}
            strokeWidth={2}
          />
        ))}
      </RadarChart>
    </ResponsiveContainer>
  );
}
