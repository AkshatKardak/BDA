"use client";

import React, { useState } from "react";
import { CHART_COLORS } from "./chartTheme";
import EmptyChartState from "./EmptyChartState";

export interface SankeyNode {
  id: string;
  name: string;
  color?: string;
}

export interface SankeyLink {
  source: string; // source node id
  target: string; // target node id
  value: number;  // flow count
  color?: string;
}

interface ThemedSankeyChartProps {
  nodes: SankeyNode[];
  links: SankeyLink[];
  unit?: string;
}

export default function ThemedSankeyChart({
  nodes,
  links,
  unit = "matches",
}: ThemedSankeyChartProps) {
  const [hoveredLink, setHoveredLink] = useState<SankeyLink | null>(null);

  if (!nodes || nodes.length === 0 || !links || links.length === 0) return <EmptyChartState />;

  const width = 560;
  const height = 240;
  const nodeW = 16;
  const padY = 24;
  const padX = 72;

  // Split nodes into Left (source) and Right (target) based on links
  const sourceIds = Array.from(new Set(links.map((l) => l.source)));
  const targetIds = Array.from(new Set(links.map((l) => l.target)));

  const leftNodes = nodes.filter((n) => sourceIds.includes(n.id));
  const rightNodes = nodes.filter((n) => targetIds.includes(n.id));

  // Compute node totals
  const leftTotals = new Map<string, number>();
  const rightTotals = new Map<string, number>();

  links.forEach((l) => {
    leftTotals.set(l.source, (leftTotals.get(l.source) || 0) + l.value);
    rightTotals.set(l.target, (rightTotals.get(l.target) || 0) + l.value);
  });

  const totalFlow = Array.from(leftTotals.values()).reduce((a, b) => a + b, 0) || 1;
  const availH = height - padY * 2 - (Math.max(leftNodes.length, rightNodes.length) - 1) * 16;

  // Compute Left Node Y-positions and heights
  let currY = padY;
  const leftLayout = new Map<string, { y: number; h: number; currOffset: number }>();
  leftNodes.forEach((n) => {
    const val = leftTotals.get(n.id) || 0;
    const h = Math.max((val / totalFlow) * availH, 14);
    leftLayout.set(n.id, { y: currY, h, currOffset: 0 });
    currY += h + 16;
  });

  // Compute Right Node Y-positions and heights
  currY = padY;
  const rightLayout = new Map<string, { y: number; h: number; currOffset: number }>();
  rightNodes.forEach((n) => {
    const val = rightTotals.get(n.id) || 0;
    const h = Math.max((val / totalFlow) * availH, 14);
    rightLayout.set(n.id, { y: currY, h, currOffset: 0 });
    currY += h + 16;
  });

  // Compute Ribbons / Links
  const computedLinks = links.map((l) => {
    const src = leftLayout.get(l.source);
    const tgt = rightLayout.get(l.target);
    if (!src || !tgt) return null;

    const linkH_src = ((l.value / (leftTotals.get(l.source) || 1)) * src.h);
    const linkH_tgt = ((l.value / (rightTotals.get(l.target) || 1)) * tgt.h);

    const y0 = src.y + src.currOffset;
    const y1 = tgt.y + tgt.currOffset;

    src.currOffset += linkH_src;
    tgt.currOffset += linkH_tgt;

    const x0 = padX + nodeW;
    const x1 = width - padX - nodeW;
    const mx = (x0 + x1) / 2;

    const pathD = `M ${x0} ${y0} C ${mx} ${y0}, ${mx} ${y1}, ${x1} ${y1} L ${x1} ${y1 + linkH_tgt} C ${mx} ${y1 + linkH_tgt}, ${mx} ${y0 + linkH_src}, ${x0} ${y0 + linkH_src} Z`;

    return {
      ...l,
      pathD,
      srcName: nodes.find((n) => n.id === l.source)?.name || l.source,
      tgtName: nodes.find((n) => n.id === l.target)?.name || l.target,
    };
  }).filter(Boolean);

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full select-none"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Render Link Ribbons */}
        {computedLinks.map((l, idx) => {
          if (!l) return null;
          const isHovered = hoveredLink?.source === l.source && hoveredLink?.target === l.target;
          const defaultColor = l.source.includes("field") ? CHART_COLORS.blueLight : CHART_COLORS.goldPrimary;
          const color = l.color || defaultColor;

          return (
            <path
              key={idx}
              d={l.pathD}
              fill={color}
              fillOpacity={isHovered ? 0.85 : 0.35}
              stroke={isHovered ? "#FFFFFF" : "none"}
              strokeWidth={isHovered ? 1 : 0}
              className="transition-all duration-150 cursor-pointer"
              onMouseEnter={() => setHoveredLink(l)}
              onMouseLeave={() => setHoveredLink(null)}
            />
          );
        })}

        {/* Left Nodes */}
        {leftNodes.map((n) => {
          const layout = leftLayout.get(n.id);
          if (!layout) return null;
          const val = leftTotals.get(n.id) || 0;

          return (
            <g key={n.id}>
              <rect
                x={padX}
                y={layout.y}
                width={nodeW}
                height={layout.h}
                fill={n.color || CHART_COLORS.blueLight}
                rx="3"
              />
              <text
                x={padX - 8}
                y={layout.y + layout.h / 2 - 2}
                textAnchor="end"
                fontSize="10"
                fontWeight="600"
                fill="#F4F6FA"
              >
                {n.name}
              </text>
              <text
                x={padX - 8}
                y={layout.y + layout.h / 2 + 10}
                textAnchor="end"
                fontSize="9"
                fontFamily="monospace"
                fill="#707B91"
              >
                {val.toLocaleString()} {unit}
              </text>
            </g>
          );
        })}

        {/* Right Nodes */}
        {rightNodes.map((n) => {
          const layout = rightLayout.get(n.id);
          if (!layout) return null;
          const val = rightTotals.get(n.id) || 0;

          return (
            <g key={n.id}>
              <rect
                x={width - padX - nodeW}
                y={layout.y}
                width={nodeW}
                height={layout.h}
                fill={n.color || CHART_COLORS.goldPrimary}
                rx="3"
              />
              <text
                x={width - padX + 8}
                y={layout.y + layout.h / 2 - 2}
                textAnchor="start"
                fontSize="10"
                fontWeight="600"
                fill="#F4F6FA"
              >
                {n.name}
              </text>
              <text
                x={width - padX + 8}
                y={layout.y + layout.h / 2 + 10}
                textAnchor="start"
                fontSize="9"
                fontFamily="monospace"
                fill="#707B91"
              >
                {val.toLocaleString()} {unit}
              </text>
            </g>
          );
        })}

        {/* Hover Readout in Center */}
        {hoveredLink && (
          <g>
            <rect
              x={width / 2 - 80}
              y={height - 28}
              width="160"
              height="24"
              fill="#0D1424"
              stroke="rgba(36, 118, 232, 0.4)"
              rx="4"
            />
            <text
              x={width / 2}
              y={height - 12}
              textAnchor="middle"
              fontSize="10"
              fill="#F5B942"
              fontFamily="monospace"
              fontWeight="bold"
            >
              {hoveredLink.value.toLocaleString()} {unit} ({Math.round((hoveredLink.value / totalFlow) * 100)}%)
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
