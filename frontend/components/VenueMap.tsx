"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, Trophy, ShieldCheck } from "lucide-react";

// Fix default leaflet marker icon issue in Next.js / Webpack bundling
const customIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
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
      <div className="h-[380px] w-full rounded-btn bg-[#070B16] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-xs font-mono text-[#707B91]">
        Initializing Geospatial Stadium Layer...
      </div>
    );
  }

  // Filter venues with valid coordinates
  const validVenues = venues.filter(
    (v) => v.latitude && v.longitude && typeof v.latitude === "number" && typeof v.longitude === "number"
  );

  return (
    <div className="relative rounded-btn overflow-hidden border border-[rgba(255,255,255,0.08)] shadow-md">
      <MapContainer
        center={[22.3511, 78.6677]} // India center
        zoom={4}
        scrollWheelZoom={false}
        className="h-[380px] w-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {validVenues.map((v, idx) => (
          <Marker
            key={idx}
            position={[v.latitude, v.longitude]}
            icon={customIcon}
            eventHandlers={{
              click: () => onSelectVenue && onSelectVenue(v)
            }}
          >
            <Popup className="venue-leaflet-popup">
              <div className="p-1 space-y-1 font-sans text-xs">
                <div className="font-bold text-[#0D1830] text-sm leading-tight">{v.venue}</div>
                <div className="text-[11px] text-[#4F5D75] font-medium">
                  {v.city}{v.state ? `, ${v.state}` : ""} ({v.country || "India"})
                </div>

                <div className="pt-1.5 border-t border-gray-200 grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase">Matches</span>
                    <strong className="text-gray-900">{v.total_matches}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase">Avg 1st Inns</span>
                    <strong className="text-blue-600">{Math.round(v.avg_1st_innings_score || 0)}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase">Bat 1st Win</span>
                    <strong className="text-gray-900">{Math.round(v.bat_first_win_pct || 0)}%</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[9px] uppercase">Chase Win</span>
                    <strong className="text-emerald-600">{Math.round(v.chase_win_pct || 0)}%</strong>
                  </div>
                </div>

                {v.highest_score && (
                  <div className="pt-1 text-[10px] text-amber-700 font-mono font-semibold">
                    Record: {v.highest_score} runs
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Floating Info Overlay */}
      <div className="absolute top-3 right-3 z-[400] bg-[#080D19]/90 backdrop-blur-md border border-[rgba(255,255,255,0.1)] px-3 py-1.5 rounded-btn text-[11px] font-mono text-[#F5B942] flex items-center gap-1.5 shadow-lg">
        <MapPin className="w-3.5 h-3.5 text-[#165DCC]" />
        <span>{validVenues.length} Geospatial Stadiums Plotted</span>
      </div>
    </div>
  );
}
