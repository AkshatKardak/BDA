"use client";

import React, { useState } from "react";
import { CHART_PALETTES } from "./chartTheme";
import EmptyChartState from "./EmptyChartState";

export interface ChordEntity {
  id: string;
  name: string;
  color?: string;
}

export interface ChordRibbon {
  source: string;
  target: string;
  value: number; // Head to head match count
}

interface ThemedChordChartProps {
  entities: ChordEntity[];
  matrix: ChordRibbon[];
  unit?: string;
}

export default function ThemedChordChart({
  entities,
  matrix,
  unit = "matches",
}: ThemedChordChartProps) {
  const [activeEntity, setActiveEntity] = useState<string | null>(null);
  const [activeRibbon, setActiveRibbon] = useState<ChordRibbon | null>(null);

  if (!entities || entities.length === 0 || !matrix || matrix.length === 0) return <EmptyChartState />;

  const size = 320;
  const center = size / 2;
  const radius = 110;
  const arcWidth = 12;

  const palette = CHART_PALETTES.sports;

  // Compute total connections for each entity
  const totals = new Map<string, number>();
  entities.forEach((e) => totals.set(e.id, 0));
  matrix.forEach((m) => {
    totals.set(m.source, (totals.get(m.source) || 0) + m.value);
    totals.set(m.target, (totals.get(m.target) || 0) + m.value);
  });

  const totalSum = Array.from(totals.values()).reduce((a, b) => a + b, 0) || 1;
  const gapRad = 0.08; // gap between segments
  const totalGaps = entities.length * gapRad;
  const availRad = 2 * Math.PI - totalGaps;

  // Compute angles for each entity
  let currAngle = -Math.PI / 2;
  const entityArcs = entities.map((e, idx) => {
    const val = totals.get(e.id) || 0;
    const span = Math.max((val / totalSum) * availRad, 0.2);
    const startA = currAngle;
    const endA = currAngle + span;
    currAngle = endA + gapRad;

    const midA = (startA + endA) / 2;
    const color = e.color || palette[idx % palette.length];

    return {
      ...e,
      startA,
      endA,
      midA,
      color,
      val,
      // Coordinates for center of arc
      xMid: center + radius * Math.cos(midA),
      yMid: center + radius * Math.sin(midA),
      xLabel: center + (radius + 22) * Math.cos(midA),
      yLabel: center + (radius + 22) * Math.sin(midA),
    };
  });

  const arcMap = new Map(entityArcs.map((a) => [a.id, a]));

  // Helper for arc SVG path
  const getArcPath = (startA: number, endA: number) => {
    const rIn = radius - arcWidth / 2;
    const rOut = radius + arcWidth / 2;
    const x1 = center + rOut * Math.cos(startA);
    const y1 = center + rOut * Math.sin(startA);
    const x2 = center + rOut * Math.cos(endA);
    const y2 = center + rOut * Math.sin(endA);
    const x3 = center + rIn * Math.cos(endA);
    const y3 = center + rIn * Math.sin(endA);
    const x4 = center + rIn * Math.cos(startA);
    const y4 = center + rIn * Math.sin(startA);
    const largeArc = endA - startA > Math.PI ? 1 : 0;
    return `M ${x1} ${y1} A ${rOut} ${rOut} 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A ${rIn} ${rIn} 0 ${largeArc} 0 ${x4} ${y4} Z`;
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative">
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full h-full max-h-[300px] select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Ribbons / Chords connecting pairs */}
        {matrix.map((ribbon, idx) => {
          const src = arcMap.get(ribbon.source);
          const tgt = arcMap.get(ribbon.target);
          if (!src || !tgt) return null;

          const isConnected =
            activeEntity === ribbon.source || activeEntity === ribbon.target;
          const isDirectlyHovered =
            activeRibbon?.source === ribbon.source &&
            activeRibbon?.target === ribbon.target;

          const opacity = activeEntity
            ? isConnected
              ? 0.75
              : 0.08
            : isDirectlyHovered
            ? 0.9
            : 0.35;

          // Quadratic Bézier to center
          const pathD = `M ${src.xMid} ${src.yMid} Q ${center} ${center} ${tgt.xMid} ${tgt.yMid}`;

          return (
            <path
              key={idx}
              d={pathD}
              fill="none"
              stroke={src.color}
              strokeWidth={Math.max(ribbon.value * 0.4, 2)}
              strokeOpacity={opacity}
              strokeLinecap="round"
              className="transition-all duration-200 cursor-pointer"
              onMouseEnter={() => setActiveRibbon(ribbon)}
              onMouseLeave={() => setActiveRibbon(null)}
            />
          );
        })}

        {/* Outer Arcs for Teams */}
        {entityArcs.map((arc) => {
          const isHovered = activeEntity === arc.id;
          return (
            <g
              key={arc.id}
              className="cursor-pointer"
              onMouseEnter={() => setActiveEntity(arc.id)}
              onMouseLeave={() => setActiveEntity(null)}
            >
              <path
                d={getArcPath(arc.startA, arc.endA)}
                fill={arc.color}
                fillOpacity={isHovered ? 1 : 0.85}
                stroke={isHovered ? "#FFFFFF" : "#0D1424"}
                strokeWidth={isHovered ? 2 : 1}
              />
              {/* Short Label */}
              <text
                x={arc.xLabel}
                y={arc.yLabel + 3}
                textAnchor="middle"
                fontSize="10"
                fontFamily="monospace"
                fontWeight="bold"
                fill={isHovered ? "#F5B942" : "#A9B2C3"}
              >
                {arc.name.length > 4 ? arc.name.substring(0, 3).toUpperCase() : arc.name}
              </text>
            </g>
          );
        })}

        {/* Center Readout on Hover */}
        <circle cx={center} cy={center} r={32} fill="#0D1424" stroke="rgba(255,255,255,0.06)" />
        <text
          x={center}
          y={center - 4}
          textAnchor="middle"
          fontSize="9"
          fill="#8F9AAF"
        >
          {activeRibbon
            ? `${arcMap.get(activeRibbon.source)?.name} v ${arcMap.get(activeRibbon.target)?.name}`
            : activeEntity
            ? arcMap.get(activeEntity)?.name
            : "Rivalry Matrix"}
        </text>
        <text
          x={center}
          y={center + 10}
          textAnchor="middle"
          fontSize="11"
          fontFamily="monospace"
          fontWeight="bold"
          fill="#F5B942"
        >
          {activeRibbon
            ? `${activeRibbon.value} ${unit}`
            : activeEntity
            ? `${totals.get(activeEntity)} ${unit}`
            : `${matrix.length} rivalries`}
        </text>
      </svg>
    </div>
  );
}
