"use client";

import React, { useState } from "react";
import { CHART_PALETTES } from "./chartTheme";
import EmptyChartState from "./EmptyChartState";

export interface SunburstNode {
  name: string;
  value: number;
  color?: string;
  children?: {
    name: string;
    value: number;
    color?: string;
  }[];
}

interface ThemedSunburstProps {
  data: SunburstNode[];
  centerTitle?: string;
  unit?: string;
}

export default function ThemedSunburst({
  data,
  centerTitle = "Total",
  unit = "runs",
}: ThemedSunburstProps) {
  const [hovered, setHovered] = useState<{ name: string; value: number; parent?: string } | null>(null);

  if (!data || data.length === 0) return <EmptyChartState />;

  const size = 320;
  const center = size / 2;
  const r0 = 42;  // Inner hollow radius
  const r1 = 88;  // Inner tier outer radius
  const r2 = 138; // Outer tier outer radius

  const totalValue = data.reduce((acc, curr) => acc + (curr.value || 0), 0);
  if (totalValue === 0) return <EmptyChartState />;

  // Helper to calculate arc path given angles (in radians) and radii
  const describeArc = (x: number, y: number, innerR: number, outerR: number, startAngle: number, endAngle: number) => {
    // Clamp slightly to prevent full-circle overlap issues
    const diff = endAngle - startAngle;
    const clampedEnd = diff >= 2 * Math.PI ? startAngle + 2 * Math.PI - 0.0001 : endAngle;

    const x1 = x + innerR * Math.cos(startAngle);
    const y1 = y + innerR * Math.sin(startAngle);
    const x2 = x + outerR * Math.cos(startAngle);
    const y2 = y + outerR * Math.sin(startAngle);
    const x3 = x + outerR * Math.cos(clampedEnd);
    const y3 = y + outerR * Math.sin(clampedEnd);
    const x4 = x + innerR * Math.cos(clampedEnd);
    const y4 = y + innerR * Math.sin(clampedEnd);

    const largeArc = diff > Math.PI ? 1 : 0;

    return `M ${x1} ${y1} L ${x2} ${y2} A ${outerR} ${outerR} 0 ${largeArc} 1 ${x3} ${y3} L ${x4} ${y4} A ${innerR} ${innerR} 0 ${largeArc} 0 ${x1} ${y1} Z`;
  };

  const palette = CHART_PALETTES.sports;

  // Build inner segments and outer segments
  let currentAngle = -Math.PI / 2;
  const innerSegments: any[] = [];
  const outerSegments: any[] = [];

  data.forEach((node, nodeIdx) => {
    const nodeSpan = (node.value / totalValue) * 2 * Math.PI;
    const startA = currentAngle;
    const endA = currentAngle + nodeSpan;
    const parentColor = node.color || palette[nodeIdx % palette.length];

    innerSegments.push({
      name: node.name,
      value: node.value,
      color: parentColor,
      path: describeArc(center, center, r0, r1, startA, endA),
      startA,
      endA,
    });

    // Sub-segments for children
    if (node.children && node.children.length > 0) {
      const childTotal = node.children.reduce((acc, c) => acc + (c.value || 0), 0) || node.value;
      let childAngle = startA;

      node.children.forEach((child, childIdx) => {
        const childSpan = (child.value / childTotal) * nodeSpan;
        const cStart = childAngle;
        const cEnd = childAngle + childSpan;
        const childColor = child.color || (childIdx % 2 === 0 ? parentColor : "#2476E8");

        outerSegments.push({
          name: child.name,
          value: child.value,
          parent: node.name,
          color: childColor,
          path: describeArc(center, center, r1 + 3, r2, cStart, cEnd),
        });

        childAngle = cEnd;
      });
    }

    currentAngle = endA;
  });

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full max-h-[300px] select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Inner Tier */}
        {innerSegments.map((seg, idx) => {
          const isSelected = hovered?.name === seg.name;
          return (
            <path
              key={`inner-${idx}`}
              d={seg.path}
              fill={seg.color}
              fillOpacity={hovered && !isSelected ? 0.45 : 0.88}
              stroke="#0D1424"
              strokeWidth="2"
              className="transition-all duration-150 cursor-pointer"
              onMouseEnter={() => setHovered({ name: seg.name, value: seg.value })}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}

        {/* Outer Tier */}
        {outerSegments.map((seg, idx) => {
          const isSelected = hovered?.name === seg.name && hovered?.parent === seg.parent;
          return (
            <path
              key={`outer-${idx}`}
              d={seg.path}
              fill={seg.color}
              fillOpacity={hovered && !isSelected ? 0.35 : 0.72}
              stroke="#0D1424"
              strokeWidth="1.5"
              className="transition-all duration-150 cursor-pointer"
              onMouseEnter={() => setHovered({ name: seg.name, value: seg.value, parent: seg.parent })}
              onMouseLeave={() => setHovered(null)}
            />
          );
        })}

        {/* Center Readout */}
        <circle cx={center} cy={center} r={r0 - 2} fill="#0D1424" />
        <text
          x={center}
          y={center - 6}
          textAnchor="middle"
          fontSize="10"
          fill="#8F9AAF"
          fontWeight="500"
        >
          {hovered ? (hovered.parent ? `${hovered.parent} > ${hovered.name}` : hovered.name) : centerTitle}
        </text>
        <text
          x={center}
          y={center + 12}
          textAnchor="middle"
          fontSize="12"
          fontFamily="monospace"
          fill="#F5B942"
          fontWeight="bold"
        >
          {(hovered ? hovered.value : totalValue).toLocaleString()}
          <tspan fontSize="9" fill="#707B91" dx="2">{unit}</tspan>
        </text>
      </svg>
    </div>
  );
}
