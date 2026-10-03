"use client";

import React, { useState } from "react";
import { interpolateColor, CHART_COLORS } from "./chartTheme";

export interface HeatmapCell {
  row: string;
  col: string;
  value: number;
  label?: string;
}

interface ThemedDensityHeatmapProps {
  data: HeatmapCell[];
  rows: string[];
  cols: string[];
  unit?: string;
  minColor?: string; // Low intensity
  maxColor?: string; // High intensity
  title?: string;
}

export default function ThemedDensityHeatmap({
  data,
  rows,
  cols,
  unit = "",
  minColor = "#0B1A3A",
  maxColor = "#F5B942",
  title,
}: ThemedDensityHeatmapProps) {
  const [hoveredCell, setHoveredCell] = useState<HeatmapCell | null>(null);

  if (!data || data.length === 0 || rows.length === 0 || cols.length === 0) return null;

  // Find min and max values across all cells
  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const range = maxVal - minVal || 1;

  // Quick lookup dictionary for cell value
  const cellMap = new Map<string, HeatmapCell>();
  data.forEach((d) => cellMap.set(`${d.row}_${d.col}`, d));

  return (
    <div className="w-full h-full flex flex-col justify-between p-2">
      {title && (
        <div className="text-xs font-semibold text-[#8F9AAF] mb-2">{title}</div>
      )}

      {/* Grid container */}
      <div className="flex-1 overflow-x-auto">
        <table className="w-full h-full border-collapse select-none">
          <thead>
            <tr>
              <th className="w-20 pb-2 text-[10px] font-mono text-[#707B91] text-left"></th>
              {cols.map((c) => (
                <th
                  key={c}
                  className="pb-2 text-[10px] font-mono font-medium text-[#8F9AAF] text-center px-1"
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r}>
                <td className="pr-2 text-[10px] font-semibold text-[#A9B2C3] truncate max-w-[80px]">
                  {r}
                </td>
                {cols.map((c) => {
                  const cell = cellMap.get(`${r}_${c}`);
                  const val = cell ? cell.value : 0;
                  const ratio = Math.max(0, Math.min(1, (val - minVal) / range));
                  const bgColor = interpolateColor(minColor, maxColor, ratio);
                  const isHovered =
                    hoveredCell?.row === r && hoveredCell?.col === c;

                  return (
                    <td
                      key={c}
                      className="p-0.5 text-center"
                      onMouseEnter={() => cell && setHoveredCell(cell)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <div
                        className="w-full h-8 sm:h-9 rounded flex items-center justify-center cursor-pointer transition-all duration-150"
                        style={{
                          backgroundColor: bgColor,
                          boxShadow: isHovered
                            ? "0 0 8px rgba(245, 185, 66, 0.6)"
                            : "none",
                          border: isHovered
                            ? "1px solid #FFFFFF"
                            : "1px solid rgba(255, 255, 255, 0.05)",
                        }}
                      >
                        <span
                          className="text-[10px] font-mono font-semibold"
                          style={{
                            color: ratio > 0.6 ? "#070B16" : "#F4F6FA",
                          }}
                        >
                          {val.toLocaleString()}
                        </span>
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend & Hover Status */}
      <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.06)] text-[11px]">
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-[#707B91] font-mono">
            {minVal.toLocaleString()}{unit}
          </span>
          <div
            className="w-24 h-2 rounded-full"
            style={{
              background: `linear-gradient(to right, ${minColor}, ${maxColor})`,
            }}
          />
          <span className="text-[10px] text-[#707B91] font-mono">
            {maxVal.toLocaleString()}{unit}
          </span>
        </div>

        <div className="text-[10px] font-mono text-[#F5B942]">
          {hoveredCell ? (
            <span>
              {hoveredCell.row} × {hoveredCell.col}: <strong>{hoveredCell.value.toLocaleString()} {unit}</strong>
            </span>
          ) : (
            <span className="text-[#707B91]">Hover cell to inspect</span>
          )}
        </div>
      </div>
    </div>
  );
}
