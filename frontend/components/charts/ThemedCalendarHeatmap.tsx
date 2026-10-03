"use client";

import React, { useState } from "react";
import { interpolateColor, CHART_COLORS } from "./chartTheme";

export interface CalendarDayActivity {
  date: string; // "YYYY-MM-DD"
  count: number; // matches played on this day
  label?: string;
}

interface ThemedCalendarHeatmapProps {
  data: CalendarDayActivity[];
  startDate?: string;
  endDate?: string;
  title?: string;
}

export default function ThemedCalendarHeatmap({
  data,
  title = "IPL Tournament Match Schedule & Fixture Density",
}: ThemedCalendarHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<CalendarDayActivity | null>(null);

  if (!data || data.length === 0) return null;

  const counts = data.map((d) => d.count);
  const maxCount = Math.max(...counts, 1);

  // Group by week (up to 12 weeks)
  const cellSize = 13;
  const cellGap = 3;
  const numWeeks = Math.ceil(data.length / 7);

  const dayMap = new Map<number, CalendarDayActivity>();
  data.forEach((d, idx) => dayMap.set(idx, d));

  const daysOfWeek = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="w-full h-full flex flex-col justify-between p-2">
      <div className="text-xs font-semibold text-[#8F9AAF] mb-1">{title}</div>

      <div className="flex-1 flex items-center justify-center overflow-x-auto py-2">
        <div className="flex gap-2">
          {/* Day of week labels */}
          <div className="flex flex-col gap-[3px] pt-1">
            {daysOfWeek.map((day, idx) => (
              <span
                key={idx}
                className="h-[13px] text-[9px] font-mono text-[#707B91] leading-[13px]"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Week columns */}
          <div className="flex gap-[3px]">
            {Array.from({ length: numWeeks }).map((_, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-[3px]">
                {Array.from({ length: 7 }).map((_, dIdx) => {
                  const globalIdx = wIdx * 7 + dIdx;
                  const item = dayMap.get(globalIdx);

                  if (!item) {
                    return (
                      <div
                        key={dIdx}
                        className="w-[13px] h-[13px] rounded-sm bg-transparent"
                      />
                    );
                  }

                  const ratio = item.count / maxCount;
                  let bg = "rgba(255, 255, 255, 0.04)";
                  if (item.count === 1) bg = "#165DCC";
                  else if (item.count === 2) bg = "#2476E8";
                  else if (item.count >= 3) bg = "#F5B942";

                  const isHovered = hoveredDay?.date === item.date;

                  return (
                    <div
                      key={dIdx}
                      className="w-[13px] h-[13px] rounded-sm cursor-pointer transition-all duration-150"
                      style={{
                        backgroundColor: bg,
                        border: isHovered
                          ? "1px solid #FFFFFF"
                          : "1px solid rgba(255, 255, 255, 0.03)",
                        boxShadow: isHovered ? "0 0 6px #FFFFFF" : "none",
                      }}
                      onMouseEnter={() => setHoveredDay(item)}
                      onMouseLeave={() => setHoveredDay(null)}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend & Hover Status */}
      <div className="flex items-center justify-between pt-1 border-t border-[rgba(255,255,255,0.06)] text-[11px]">
        <div className="flex items-center gap-1.5 text-[10px] text-[#707B91]">
          <span>Less</span>
          <span className="w-2.5 h-2.5 rounded-sm bg-[rgba(255,255,255,0.04)]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-[#165DCC]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-[#2476E8]" />
          <span className="w-2.5 h-2.5 rounded-sm bg-[#F5B942]" />
          <span>More</span>
        </div>

        <div className="text-[10px] font-mono text-[#F5B942]">
          {hoveredDay ? (
            <span>
              {hoveredDay.date}: <strong>{hoveredDay.count} match{hoveredDay.count !== 1 ? "es" : ""}</strong>
              {hoveredDay.label ? ` (${hoveredDay.label})` : ""}
            </span>
          ) : (
            <span className="text-[#707B91]">Hover day square to view fixtures</span>
          )}
        </div>
      </div>
    </div>
  );
}
