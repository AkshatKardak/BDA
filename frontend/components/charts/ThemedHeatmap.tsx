"use client";

import React, { useState } from "react";
import { interpolateColor } from "./chartTheme";

export interface HeatmapMatrixItem {
  x: string;
  y: string;
  value: number; // e.g. correlation -1 to +1 or win count
  displayVal?: string | number;
}

interface ThemedHeatmapProps {
  data: HeatmapMatrixItem[];
  labels: string[];
  unit?: string;
  isDiverging?: boolean; // For correlation -1 to 1
  minVal?: number;
  maxVal?: number;
}

export default function ThemedHeatmap({
  data,
  labels,
  unit = "",
  isDiverging = false,
  minVal,
  maxVal,
}: ThemedHeatmapProps) {
  const [hovered, setHovered] = useState<HeatmapMatrixItem | null>(null);

  if (!data || data.length === 0 || labels.length === 0) return null;

  const vals = data.map((d) => d.value);
  const min = minVal !== undefined ? minVal : Math.min(...vals);
  const max = maxVal !== undefined ? maxVal : Math.max(...vals);
  const range = max - min || 1;

  const map = new Map<string, HeatmapMatrixItem>();
  data.forEach((d) => map.set(`${d.x}_${d.y}`, d));

  return (
    <div className="w-full h-full flex flex-col justify-between p-2">
      <div className="flex-1 flex items-center justify-center overflow-x-auto">
        <table className="border-collapse select-none">
          <thead>
            <tr>
              <th className="p-1 text-[10px] font-mono text-[#707B91]"></th>
              {labels.map((l) => (
                <th
                  key={l}
                  className="p-1 text-[10px] font-mono font-semibold text-[#8F9AAF] text-center max-w-[50px] truncate"
                >
                  {l.length > 5 ? l.substring(0, 4) + "." : l}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {labels.map((yLabel) => (
              <tr key={yLabel}>
                <td className="p-1 text-[10px] font-mono font-semibold text-[#8F9AAF] text-right max-w-[50px] truncate pr-2">
                  {yLabel.length > 5 ? yLabel.substring(0, 4) + "." : yLabel}
                </td>
                {labels.map((xLabel) => {
                  const item = map.get(`${xLabel}_${yLabel}`) || map.get(`${yLabel}_${xLabel}`);
                  const val = item ? item.value : 0;
                  const ratio = Math.max(0, Math.min(1, (val - min) / range));

                  let bgColor = "#0D1424";
                  if (xLabel === yLabel) {
                    bgColor = "rgba(255, 255, 255, 0.05)";
                  } else if (isDiverging) {
                    // -1 (red) to 0 (dark navy) to +1 (blue/green)
                    bgColor = val >= 0
                      ? interpolateColor("#0B1222", "#2FBF71", val / (max || 1))
                      : interpolateColor("#E63946", "#0B1222", (val - min) / (-min || 1));
                  } else {
                    bgColor = interpolateColor("#0D1A38", "#F5B942", ratio);
                  }

                  const isHovered = hovered?.x === xLabel && hovered?.y === yLabel;

                  return (
                    <td
                      key={xLabel}
                      className="p-0.5"
                      onMouseEnter={() => item && setHovered(item)}
                      onMouseLeave={() => setHovered(null)}
                    >
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded flex items-center justify-center cursor-pointer transition-all duration-150"
                        style={{
                          backgroundColor: bgColor,
                          boxShadow: isHovered ? "0 0 10px #F5B942" : "none",
                          border: isHovered
                            ? "1px solid #FFFFFF"
                            : "1px solid rgba(255, 255, 255, 0.05)",
                        }}
                      >
                        <span
                          className="text-[10px] font-mono font-bold"
                          style={{
                            color: ratio > 0.65 && !isDiverging ? "#070B16" : "#F4F6FA",
                          }}
                        >
                          {xLabel === yLabel
                            ? "—"
                            : item?.displayVal !== undefined
                            ? item.displayVal
                            : val.toFixed(1)}
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

      {/* Hover Info Footer */}
      <div className="flex items-center justify-between pt-2 border-t border-[rgba(255,255,255,0.06)] text-[11px]">
        <span className="text-[10px] text-[#707B91] font-mono">
          {labels.length}×{labels.length} Matrix
        </span>
        <div className="text-[10px] font-mono text-[#F5B942]">
          {hovered ? (
            <span>
              {hovered.y} vs {hovered.x}: <strong>{hovered.value}{unit}</strong>
            </span>
          ) : (
            <span className="text-[#707B91]">Hover cell to inspect</span>
          )}
        </div>
      </div>
    </div>
  );
}
