"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import indiaBoundaryData from "./map/indiaBoundary.json";
import { MapPin, Trophy, ShieldCheck } from "lucide-react";

const TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}";
const TILE_ATTRIBUTION =
  'Tiles &copy; <a href="https://www.esri.com/">Esri</a> — Esri, DeLorme, NAVTEQ';

// Custom lightweight SVG DivIcon for bundler safety and zero CDN dependency
const majorIcon = L.divIcon({
  className: "custom-stadium-marker-major",
  html: `<div style="
    width: 24px;
    height: 24px;
    background: #F5B942;
    border: 2px solid #070B16;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 10px rgba(245, 185, 66, 0.7);
    cursor: pointer;
  ">
    <div style="width: 7px; height: 7px; background: #070B16; border-radius: 50%;"></div>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -14],
});

const standardIcon = L.divIcon({
  className: "custom-stadium-marker-standard",
  html: `<div style="
    width: 18px;
    height: 18px;
    background: #2476E8;
    border: 2px solid #070B16;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 6px rgba(36, 118, 232, 0.6);
    cursor: pointer;
  ">
    <div style="width: 5px; height: 5px; background: #070B16; border-radius: 50%;"></div>
  </div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  popupAnchor: [0, -11],
});

interface VenueMapProps {
  venues: any[];
  onSelectVenue?: (venue: any) => void;
}

export default function VenueMap({ venues, onSelectVenue }: VenueMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[420px] w-full rounded-btn bg-[#070B16] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-xs font-mono text-[#707B91]">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin"></div>
          <span>Initializing Esri Stadium & India Geospatial Layer...</span>
        </div>
      </div>
    );
  }

  // Filter venues with valid coordinates
  const validVenues = (venues || []).filter(
    (v) =>
      typeof v?.latitude === "number" &&
      typeof v?.longitude === "number" &&
      !isNaN(v.latitude) &&
      !isNaN(v.longitude)
  );

  return (
    <div className="relative rounded-btn overflow-hidden border border-[rgba(255,255,255,0.08)] shadow-md bg-[#0A101D]">
      {/* Top Map Floating Badge & Legend */}
      <div className="absolute top-3 right-3 z-[400] flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="bg-[#070B16]/90 backdrop-blur-md px-3 py-1.5 rounded-btn border border-[rgba(255,255,255,0.12)] text-[11px] font-mono text-[#F4F6FA] flex items-center gap-3 shadow-lg pointer-events-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F5B942] inline-block shadow-[0_0_6px_rgba(245,185,66,0.6)]"></span>
            <span className="text-[#A9B2C3]">Major (&ge;15)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#2476E8] inline-block shadow-[0_0_5px_rgba(36,118,232,0.6)]"></span>
            <span className="text-[#A9B2C3]">Other</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 border-b-2 border-dashed border-[#F5B942] inline-block"></span>
            <span className="text-[#A9B2C3]">India Boundary</span>
          </div>
          <span className="pl-1 border-l border-[rgba(255,255,255,0.1)] text-[#2FBF71] font-bold">
            {validVenues.length} Plotted
          </span>
        </div>
      </div>

      {validVenues.length === 0 ? (
        <div className="h-[420px] w-full flex flex-col items-center justify-center space-y-2 text-xs font-mono text-[#707B91]">
          <MapPin className="w-6 h-6 text-[#707B91]" />
          <span>No stadiums match the current filters.</span>
          <span className="text-[10px] text-[#A9B2C3]">Reset your search query or toggle &quot;All 60 Stadiums&quot;.</span>
        </div>
      ) : (
        <MapContainer
          center={[22.5937, 78.9629]} // India centre
          zoom={5}
          minZoom={4}
          maxZoom={18}
          maxBounds={[
            [6.0, 67.5],
            [37.5, 98.0],
          ]} // constrain panning to India
          maxBoundsViscosity={1.0}
          scrollWheelZoom={false}
          className="h-[420px] w-full z-10"
        >
          <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} maxZoom={19} />
          
          <GeoJSON
            data={indiaBoundaryData as any}
            style={() => ({
              color: "#F5B942", // gold, matching BDA design theme
              weight: 2,
              opacity: 0.9,
              fillColor: "#165DCC",
              fillOpacity: 0.05,
              dashArray: "6 4",
            })}
          />

          {validVenues.map((v, idx) => {
            const isMajor = (v.total_matches || 0) >= 15;
            return (
              <Marker
                key={`${v.venue}-${idx}`}
                position={[v.latitude, v.longitude]}
                icon={isMajor ? majorIcon : standardIcon}
                eventHandlers={{
                  click: () => onSelectVenue && onSelectVenue(v),
                }}
              >
                <Popup className="venue-leaflet-popup">
                  <div className="p-1 space-y-1.5 font-sans text-xs">
                    <div className="flex items-start justify-between gap-2 border-b border-gray-100 pb-1">
                      <div>
                        <div className="font-bold text-[#0D1830] text-sm leading-snug">
                          {v.venue}
                        </div>
                        <div className="text-[11px] text-[#4F5D75] font-medium">
                          {v.city}
                          {v.state ? `, ${v.state}` : ""} ({v.country || "India"})
                        </div>
                      </div>
                      {isMajor && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold border border-amber-300">
                          Major
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase">
                          Matches Hosted
                        </span>
                        <strong className="text-gray-900">{v.total_matches}</strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase">
                          Avg 1st Inns Par
                        </span>
                        <strong className="text-blue-600">
                          {Math.round(v.avg_1st_innings_score || 0)}
                        </strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase">
                          Bat 1st Win %
                        </span>
                        <strong className="text-gray-900">
                          {Math.round(v.bat_first_win_pct || 0)}%
                        </strong>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[9px] uppercase">
                          Chase Win %
                        </span>
                        <strong className="text-emerald-600">
                          {Math.round(v.chase_win_pct || 0)}%
                        </strong>
                      </div>
                    </div>

                    {v.highest_score && (
                      <div className="pt-1 border-t border-gray-100 text-[10px] text-amber-700 font-mono font-semibold">
                        Stadium Record: {v.highest_score} runs
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      )}
    </div>
  );
}
