"use client";

import React, { useState } from "react";
import { CHART_PALETTES } from "./chartTheme";

export interface ParallelDimension {
  key: string;
  name: string;
  min: number;
  max: number;
  unit?: string;
}

export interface ParallelEntity {
  id: string;
  name: string;
  color?: string;
  [key: string]: any;
}

interface ThemedParallelCoordinatesProps {
  dimensions: ParallelDimension[];
  data: ParallelEntity[];
}

export default function ThemedParallelCoordinates({
  dimensions,
  data,
}: ThemedParallelCoordinatesProps) {
  const [activeEntityId, setActiveEntityId] = useState<string | null>(null);

  if (!dimensions || dimensions.length < 2 || !data || data.length === 0) return null;

  const width = 600;
  const height = 260;
  const padLeft = 48;
  const padRight = 48;
  const padTop = 32;
  const padBottom = 32;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const axisSpacing = chartW / (dimensions.length - 1);

  const palette = CHART_PALETTES.sports;

  // Normalized Y position for an axis
  const getY = (val: number, dim: ParallelDimension) => {
    const clamped = Math.min(Math.max(val, dim.min), dim.max);
    const ratio = (clamped - dim.min) / (dim.max - dim.min || 1);
    // Invert: high value is top (padTop)
    return padTop + chartH - ratio * chartH;
  };

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="relative w-full flex-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full select-none"
          preserveAspectRatio="none"
        >
          {/* Vertical Parallel Axes */}
          {dimensions.map((dim, idx) => {
            const x = padLeft + idx * axisSpacing;

            return (
              <g key={dim.key}>
                {/* Axis Line */}
                <line
                  x1={x}
                  y1={padTop}
                  x2={x}
                  y2={padTop + chartH}
                  stroke="rgba(255, 255, 255, 0.15)"
                  strokeWidth="1.5"
                />

                {/* Top Max Label */}
                <text
                  x={x}
                  y={padTop - 6}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="monospace"
                  fill="#707B91"
                >
                  {dim.max}{dim.unit || ""}
                </text>

                {/* Bottom Min Label */}
                <text
                  x={x}
                  y={padTop + chartH + 12}
                  textAnchor="middle"
                  fontSize="9"
                  fontFamily="monospace"
                  fill="#707B91"
                >
                  {dim.min}{dim.unit || ""}
                </text>

                {/* Axis Name Header */}
                <text
                  x={x}
                  y={padTop + chartH + 24}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="600"
                  fill="#A9B2C3"
                >
                  {dim.name}
                </text>
              </g>
            );
          })}

          {/* Polylines for each entity */}
          {data.map((entity, idx) => {
            const isHovered = activeEntityId === entity.id;
            const isOther = activeEntityId !== null && !isHovered;
            const color = entity.color || palette[idx % palette.length];

            const points = dimensions.map((dim, dIdx) => {
              const x = padLeft + dIdx * axisSpacing;
              const val = Number(entity[dim.key]) || dim.min;
              const y = getY(val, dim);
              return `${x},${y}`;
            });

            return (
              <g
                key={entity.id}
                className="cursor-pointer"
                onMouseEnter={() => setActiveEntityId(entity.id)}
                onMouseLeave={() => setActiveEntityId(null)}
              >
                <polyline
                  points={points.join(" ")}
                  fill="none"
                  stroke={color}
                  strokeWidth={isHovered ? 3.5 : 1.5}
                  strokeOpacity={isHovered ? 1 : isOther ? 0.15 : 0.65}
                  className="transition-all duration-150"
                />
                {/* Dots at each axis node */}
                {dimensions.map((dim, dIdx) => {
                  const x = padLeft + dIdx * axisSpacing;
                  const val = Number(entity[dim.key]) || dim.min;
                  const y = getY(val, dim);

                  return (
                    <circle
                      key={dim.key}
                      cx={x}
                      cy={y}
                      r={isHovered ? 4.5 : 2.5}
                      fill={color}
                      stroke="#0D1424"
                      strokeWidth={1}
                    />
                  );
                })}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend / Hovered entity highlight */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-2 border-t border-[rgba(255,255,255,0.06)] text-[11px]">
        {data.slice(0, 8).map((entity, idx) => {
          const color = entity.color || palette[idx % palette.length];
          const isHovered = activeEntityId === entity.id;

          return (
            <button
              key={entity.id}
              type="button"
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all ${
                isHovered
                  ? "bg-[rgba(255,255,255,0.12)] text-[#F4F6FA] font-bold"
                  : "text-[#8F9AAF] hover:text-[#F4F6FA]"
              }`}
              onMouseEnter={() => setActiveEntityId(entity.id)}
              onMouseLeave={() => setActiveEntityId(null)}
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span>{entity.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
