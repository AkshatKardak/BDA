"use client";

import React from "react";
import { AlertCircle } from "lucide-react";

interface EmptyChartStateProps {
  message?: string;
  className?: string;
}

export default function EmptyChartState({
  message = "No telemetry data available for the current filter criteria.",
  className = "",
}: EmptyChartStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center w-full h-full min-h-[140px] p-4 text-center ${className}`}>
      <AlertCircle className="w-5 h-5 text-[#8F9AAF] mb-1.5 opacity-60 flex-shrink-0" />
      <p className="text-xs font-mono text-[#A9B2C3] max-w-xs">{message}</p>
    </div>
  );
}
