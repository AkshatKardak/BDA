"use client";

import React, { useState } from "react";
import { CHART_COLORS } from "./chartTheme";

export interface GeoVenuePoint {
  id: string;
  name: string;
  city: string;
  state: string;
  matches: number;
  avgScore?: number;
  chasingWinPct?: number;
  // Normalized 0-100 coordinates on India map SVG
  x: number;
  y: number;
}

interface ThemedChoroplethMapProps {
  venues?: GeoVenuePoint[];
  onSelectVenue?: (venue: GeoVenuePoint) => void;
}

const DEFAULT_IPL_VENUES: GeoVenuePoint[] = [
  { id: "mum", name: "Wankhede Stadium", city: "Mumbai", state: "Maharashtra", matches: 122, avgScore: 168, chasingWinPct: 53.2, x: 32, y: 62 },
  { id: "kol", name: "Eden Gardens", city: "Kolkata", state: "West Bengal", matches: 93, avgScore: 164, chasingWinPct: 55.4, x: 74, y: 50 },
  { id: "blr", name: "M Chinnaswamy Stadium", city: "Bengaluru", state: "Karnataka", matches: 94, avgScore: 172, chasingWinPct: 54.8, x: 42, y: 78 },
  { id: "del", name: "Arun Jaitley Stadium", city: "Delhi", state: "Delhi", matches: 87, avgScore: 166, chasingWinPct: 52.9, x: 42, y: 28 },
  { id: "chn", name: "MA Chidambaram Stadium", city: "Chennai", state: "Tamil Nadu", matches: 85, avgScore: 161, chasingWinPct: 46.5, x: 50, y: 82 },
  { id: "hyd", name: "Rajiv Gandhi Intl Stadium", city: "Hyderabad", state: "Telangana", matches: 77, avgScore: 162, chasingWinPct: 54.5, x: 46, y: 64 },
  { id: "ahm", name: "Narendra Modi Stadium", city: "Ahmedabad", state: "Gujarat", matches: 42, avgScore: 174, chasingWinPct: 57.1, x: 26, y: 48 },
  { id: "jpr", name: "Sawai Mansingh Stadium", city: "Jaipur", state: "Rajasthan", matches: 57, avgScore: 159, chasingWinPct: 61.4, x: 35, y: 36 },
  { id: "moh", name: "PCA Stadium", city: "Mohali", state: "Punjab", matches: 64, avgScore: 167, chasingWinPct: 54.7, x: 38, y: 20 },
  { id: "pun", name: "MCA Stadium", city: "Pune", state: "Maharashtra", matches: 51, avgScore: 163, chasingWinPct: 49.0, x: 35, y: 65 },
  { id: "lko", name: "BRSABV Ekana Stadium", city: "Lucknow", state: "Uttar Pradesh", matches: 21, avgScore: 154, chasingWinPct: 47.6, x: 54, y: 35 },
  { id: "dhm", name: "HPCA Stadium", city: "Dharamsala", state: "Himachal Pradesh", matches: 13, avgScore: 176, chasingWinPct: 53.8, x: 40, y: 15 },
];

export default function ThemedChoroplethMap({
  venues = DEFAULT_IPL_VENUES,
  onSelectVenue,
}: ThemedChoroplethMapProps) {
  const [hoveredVenue, setHoveredVenue] = useState<GeoVenuePoint | null>(null);
  const [selectedVenue, setSelectedVenue] = useState<GeoVenuePoint>(venues[0]);

  const maxMatches = Math.max(...venues.map((v) => v.matches), 1);

  const handleSelect = (v: GeoVenuePoint) => {
    setSelectedVenue(v);
    if (onSelectVenue) onSelectVenue(v);
  };

  return (
    <div className="w-full h-full flex flex-col md:flex-row items-center gap-4 p-2">
      {/* India Geospatial Projection SVG */}
      <div className="relative flex-1 w-full h-[260px] sm:h-[300px] flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full max-h-[300px] select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Stylized Geographic Map Outline of India */}
          <path
            d="M 38 12 L 44 8 L 47 14 L 43 20 L 52 26 L 68 28 L 74 36 L 86 34 L 88 40 L 78 43 L 74 52 L 64 62 L 56 75 L 50 88 L 46 88 L 38 78 L 32 68 L 26 56 L 22 45 L 30 38 L 34 26 Z"
            fill="#091020"
            stroke="rgba(36, 118, 232, 0.3)"
            strokeWidth="0.8"
            strokeDasharray="2 1"
          />

          {/* Regional Grid Lat/Long Lines */}
          {[25, 50, 75].map((y) => (
            <line
              key={`lat-${y}`}
              x1="18"
              y1={y}
              x2="84"
              y2={y}
              stroke="rgba(255, 255, 255, 0.04)"
              strokeDasharray="1 2"
              strokeWidth="0.5"
            />
          ))}
          {[35, 50, 65].map((x) => (
            <line
              key={`lon-${x}`}
              x1={x}
              y1="10"
              x2={x}
              y2="90"
              stroke="rgba(255, 255, 255, 0.04)"
              strokeDasharray="1 2"
              strokeWidth="0.5"
            />
          ))}

          {/* Venue Hotspot Circles */}
          {venues.map((venue) => {
            const isHovered = hoveredVenue?.id === venue.id;
            const isSelected = selectedVenue?.id === venue.id;
            // Radius scales from 2.5 to 6.5 based on matches
            const r = 2.5 + (venue.matches / maxMatches) * 4;

            return (
              <g
                key={venue.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredVenue(venue)}
                onMouseLeave={() => setHoveredVenue(null)}
                onClick={() => handleSelect(venue)}
              >
                {/* Pulsing ring if selected */}
                {isSelected && (
                  <circle
                    cx={venue.x}
                    cy={venue.y}
                    r={r + 3.5}
                    fill="none"
                    stroke={CHART_COLORS.goldPrimary}
                    strokeWidth="0.6"
                    opacity="0.8"
                    className="animate-pulse"
                  />
                )}

                {/* Hotspot Circle */}
                <circle
                  cx={venue.x}
                  cy={venue.y}
                  r={r}
                  fill={isSelected ? CHART_COLORS.goldPrimary : isHovered ? "#FFFFFF" : CHART_COLORS.blueLight}
                  fillOpacity={0.85}
                  stroke="#070B16"
                  strokeWidth="0.8"
                  className="transition-all duration-150"
                />

                {/* City name text for top venues */}
                {venue.matches > 60 && (
                  <text
                    x={venue.x}
                    y={venue.y - r - 1.5}
                    textAnchor="middle"
                    fontSize="3"
                    fontFamily="monospace"
                    fill={isSelected ? "#F5B942" : "#A9B2C3"}
                    fontWeight="bold"
                  >
                    {venue.city}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip */}
        {hoveredVenue && (
          <div className="absolute top-2 left-2 bg-[#0D1424] border border-[rgba(245,185,66,0.3)] rounded p-2 text-xs shadow-xl pointer-events-none z-10">
            <div className="font-bold text-[#F4F6FA]">{hoveredVenue.name}</div>
            <div className="text-[11px] text-[#8F9AAF]">{hoveredVenue.city}, {hoveredVenue.state}</div>
            <div className="mt-1 font-mono text-[10px] text-[#F5B942]">
              {hoveredVenue.matches} matches hosted
            </div>
          </div>
        )}
      </div>

      {/* Selected Stadium Quick Insight Panel */}
      <div className="w-full md:w-56 p-3 rounded-md bg-[#0A101D] border border-[rgba(255,255,255,0.08)] flex flex-col justify-between">
        <div>
          <div className="text-[9px] uppercase tracking-wider text-[#707B91] font-mono">
            Selected Stadium
          </div>
          <div className="text-sm font-bold text-[#F4F6FA] truncate mt-0.5">
            {selectedVenue.name}
          </div>
          <div className="text-[11px] text-[#2476E8]">
            {selectedVenue.city}, {selectedVenue.state}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-[rgba(255,255,255,0.06)]">
            <div>
              <div className="text-[10px] text-[#8F9AAF]">Matches</div>
              <div className="text-base font-bold font-mono text-[#F5B942]">
                {selectedVenue.matches}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#8F9AAF]">Avg 1st Inn</div>
              <div className="text-base font-bold font-mono text-[#2FBF71]">
                {selectedVenue.avgScore || 165}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#8F9AAF]">Chasing Win</div>
              <div className="text-base font-bold font-mono text-[#2476E8]">
                {selectedVenue.chasingWinPct || 52}%
              </div>
            </div>
            <div>
              <div className="text-[10px] text-[#8F9AAF]">Toss Adv.</div>
              <div className="text-base font-bold font-mono text-[#E63946]">
                Bowl 1st
              </div>
            </div>
          </div>
        </div>

        <div className="mt-3 text-[10px] text-[#707B91] italic text-center border-t border-[rgba(255,255,255,0.05)] pt-2">
          Click any venue point on the map to inspect
        </div>
      </div>
    </div>
  );
}
