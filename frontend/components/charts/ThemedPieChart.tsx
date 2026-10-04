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
import EmptyChartState from "./EmptyChartState";

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
  showLegend?: boolean;
}

export default function ThemedPieChart({
  data,
  donut = true,
  centerLabel,
  centerValue,
  unit = "",
  innerRadius = 52,
  outerRadius = 82,
  showLegend = true,
}: ThemedPieChartProps) {
  if (!data || data.length === 0) return <EmptyChartState />;

  const total = data.reduce((sum, item) => sum + (item.value || 0), 0);
  const pieCy = showLegend ? "44%" : "50%";
  const centerTopClass = showLegend ? "top-[44%]" : "top-[50%]";

  return (
    <div className="relative w-full h-full min-h-[220px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy={pieCy}
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
          {showLegend && (
            <Legend
              verticalAlign="bottom"
              height={36}
              wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }}
              iconType="circle"
            />
          )}
        </PieChart>
      </ResponsiveContainer>

      {/* Center Label for Donut Mode */}
      {donut && (centerLabel || centerValue) && (
        <div className={`absolute ${centerTopClass} left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center`}>
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
