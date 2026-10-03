"use client";

import React from "react";
import { ResponsiveContainer, Treemap, Tooltip } from "recharts";
import { CHART_PALETTES, chartTooltipStyle } from "./chartTheme";

interface TreemapItem {
  name: string;
  value: number;
  [key: string]: any;
}

interface ThemedTreemapProps {
  data: TreemapItem[];
  dataKey?: string;
  nameKey?: string;
  unit?: string;
}

const CustomizedTreemapContent = (props: any) => {
  const { x, y, width, height, index, name, value } = props;
  const palette = CHART_PALETTES.sports;
  const color = palette[index % palette.length];

  if (width < 30 || height < 20) return null;

  return (
    <g>
      <rect
        x={x + 1}
        y={y + 1}
        width={width - 2}
        height={height - 2}
        fill={color}
        fillOpacity={0.82}
        stroke="#0D1424"
        strokeWidth={2}
        rx={4}
        className="transition-opacity duration-150 hover:opacity-100 cursor-pointer"
      />
      {width > 60 && height > 36 && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 4}
            textAnchor="middle"
            fill="#FFFFFF"
            fontSize={width > 100 ? 12 : 10}
            fontWeight={600}
            className="pointer-events-none select-none"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 12}
            textAnchor="middle"
            fill="rgba(255, 255, 255, 0.75)"
            fontSize={10}
            fontFamily="monospace"
            className="pointer-events-none select-none"
          >
            {Number(value).toLocaleString()}
          </text>
        </>
      )}
    </g>
  );
};

export default function ThemedTreemap({
  data,
  dataKey = "value",
  nameKey = "name",
  unit = "",
}: ThemedTreemapProps) {
  if (!data || data.length === 0) return null;

  // Format data for Recharts Treemap
  const formattedData = data.map((d) => ({
    ...d,
    name: d[nameKey],
    value: Number(d[dataKey]) || 0,
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <Treemap
        data={formattedData}
        dataKey="value"
        aspectRatio={4 / 3}
        stroke="#0D1424"
        content={<CustomizedTreemapContent />}
      >
        <Tooltip
          contentStyle={chartTooltipStyle}
          formatter={(value: any, name: any) => [
            `${Number(value).toLocaleString()}${unit ? " " + unit : ""}`,
            name,
          ]}
        />
      </Treemap>
    </ResponsiveContainer>
  );
}
