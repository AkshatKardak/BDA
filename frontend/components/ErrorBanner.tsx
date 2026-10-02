"use client";

import React from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorBannerProps {
  message?: string;
  onRetry?: () => void;
  title?: string;
}

export default function ErrorBanner({
  title = "Telemetry Data Notice",
  message = "Unable to connect to FastAPI backend at http://127.0.0.1:8000. Ensure the backend server is running.",
  onRetry
}: ErrorBannerProps) {
  return (
    <div className="rounded-card border border-[rgba(230,57,70,0.3)] bg-[#0D1424] p-5 my-4 shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 rounded-full bg-[rgba(230,57,70,0.1)] border border-[rgba(230,57,70,0.25)] flex items-center justify-center text-[#E63946] flex-shrink-0 mt-0.5 sm:mt-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white leading-tight">{title}</h4>
            <p className="text-xs text-[#A9B2C3] mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-1.5 h-8 px-3.5 rounded-btn bg-[#165DCC] hover:bg-[#2476E8] text-white text-xs font-semibold transition-colors flex-shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        )}
      </div>
    </div>
  );
}
