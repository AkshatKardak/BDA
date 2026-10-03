"use client";

import React from "react";
import { CHART_COLORS } from "./chartTheme";

interface ThemedGaugeProps {
  value: number;
  min?: number;
  max?: number;
  title?: string;
  subtitle?: string;
  unit?: string;
  color?: string;
  thresholds?: { [key: number]: string };
}

export default function ThemedGauge({
  value,
  min = 0,
  max = 100,
  title = "Lake Integrity",
  subtitle = "HDFS + Hive Parquet Verification",
  unit = "%",
  color = CHART_COLORS.greenAccent,
}: ThemedGaugeProps) {
  const size = 220;
  const strokeWidth = 14;
  const radius = (size - strokeWidth * 2) / 2;
  const center = size / 2;

  // 240-degree arc from 150 deg (2.617 rad) to 390 deg (6.806 rad)
  const startAngle = 150 * (Math.PI / 180);
  const totalArc = 240 * (Math.PI / 180);

  const clampedVal = Math.min(Math.max(value, min), max);
  const ratio = (clampedVal - min) / (max - min || 1);
  const currentAngle = startAngle + ratio * totalArc;

  const polarToCartesian = (cx: number, cy: number, r: number, angleRad: number) => ({
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  });

  const describeGaugeArc = (cx: number, cy: number, r: number, start: number, end: number) => {
    const p1 = polarToCartesian(cx, cy, r, start);
    const p2 = polarToCartesian(cx, cy, r, end);
    const largeArc = end - start > Math.PI ? 1 : 0;
    return `M ${p1.x} ${p1.y} A ${r} ${r} 0 ${largeArc} 1 ${p2.x} ${p2.y}`;
  };

  const bgTrack = describeGaugeArc(center, center, radius, startAngle, startAngle + totalArc);
  const valTrack = describeGaugeArc(center, center, radius, startAngle, currentAngle);

  // Needle tip coordinates
  const needleTip = polarToCartesian(center, center, radius - 10, currentAngle);

  return (
    <div className="w-full h-full flex flex-col items-center justify-center p-2">
      <div className="relative w-[180px] h-[150px] sm:w-[200px] sm:h-[160px] flex items-center justify-center">
        <svg
          viewBox={`0 0 ${size} ${size}`}
          className="w-full h-full overflow-visible select-none"
        >
          {/* Background Track */}
          <path
            d={bgTrack}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Value Progress Arc */}
          <path
            d={valTrack}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />

          {/* Needle / Indicator Point */}
          <circle
            cx={needleTip.x}
            cy={needleTip.y}
            r="5"
            fill="#FFFFFF"
            stroke={color}
            strokeWidth="2"
          />

          {/* Center Readout */}
          <text
            x={center}
            y={center + 12}
            textAnchor="middle"
            fontSize="28"
            fontFamily="monospace"
            fontWeight="bold"
            fill="#F4F6FA"
          >
            {value}
            <tspan fontSize="16" fill="#8F9AAF">{unit}</tspan>
          </text>

          {/* Min & Max Labels */}
          <text
            x={center - radius * 0.75}
            y={center + radius * 0.65}
            textAnchor="middle"
            fontSize="10"
            fontFamily="monospace"
            fill="#707B91"
          >
            {min}{unit}
          </text>
          <text
            x={center + radius * 0.75}
            y={center + radius * 0.65}
            textAnchor="middle"
            fontSize="10"
            fontFamily="monospace"
            fill="#707B91"
          >
            {max}{unit}
          </text>
        </svg>
      </div>

      {title && (
        <div className="text-center mt-[-8px]">
          <div className="text-xs font-semibold text-[#F4F6FA]">{title}</div>
          {subtitle && (
            <div className="text-[10px] text-[#8F9AAF]">{subtitle}</div>
          )}
        </div>
      )}
    </div>
  );
}
