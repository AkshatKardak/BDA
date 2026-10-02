"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { SERIES_PALETTE, chartTooltipStyle } from "./chartTheme";

interface PieSlice {
  name: string;
  value: number;
  color?: string;
  pct?: string | number;
}

interface ThemedPieChartProps {
  data: PieSlice[];
  donut?: boolean;
  centerLabel?: string;
  centerValue?: string;
  unit?: string;
  innerRadius?: number;
  outerRadius?: number;
}

export default function ThemedPieChart({
  data,
  donut = true,
  centerLabel,
  centerValue,
  unit = "",
  innerRadius = 50,
  outerRadius = 78,
}: ThemedPieChartProps) {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="48%"
            innerRadius={donut ? innerRadius : 0}
            outerRadius={outerRadius}
            paddingAngle={donut ? 2.5 : 0}
          >
            {data.map((entry, index) => (
              <Cell
                key={`slice-${index}`}
                fill={entry.color || SERIES_PALETTE[index % SERIES_PALETTE.length]}
                stroke="#0A101D"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={chartTooltipStyle}
            formatter={(value: any, name: any, item: any) => {
              const pct = item.payload.pct || (total > 0 ? ((Number(value) / total) * 100).toFixed(1) : 0);
              return [
                `${Number(value).toLocaleString()}${unit ? " " + unit : ""} (${pct}%)`,
                name,
              ];
            }}
          />
          <Legend
            verticalAlign="bottom"
            height={36}
            wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
            iconType="circle"
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center Label for Donut Mode */}
      {donut && (centerLabel || centerValue) && (
        <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
          {centerValue && (
            <div className="text-sm sm:text-base font-extrabold text-white font-mono leading-none">
              {centerValue}
            </div>
          )}
          {centerLabel && (
            <div className="text-[9px] uppercase tracking-wider font-mono text-[#8F9AAF] mt-0.5">
              {centerLabel}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
