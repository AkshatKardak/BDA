import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  accent?: "gold" | "blue" | "white";
  trend?: string;
}

export default function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  accent = "gold",
  trend,
}: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-card bg-[#0D1424] p-4 sm:p-5 border border-[rgba(255,255,255,0.08)] shadow-[0_8px_30px_rgba(0,0,0,0.16)] transition-all duration-150 hover:border-[rgba(36,118,232,0.3)]">
      <div className="flex items-start justify-between">
        <div className="min-w-0 pr-2">
          <p className="text-[11px] font-semibold text-[#707B91] uppercase tracking-wider truncate">
            {label}
          </p>
          <h3 className="mt-1.5 text-2xl sm:text-[28px] font-bold tracking-tight text-[#F4F6FA] font-sans">
            {typeof value === "number" ? value.toLocaleString() : value}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs text-[#A9B2C3] truncate">{subtitle}</p>
          )}
          {trend && (
            <span className="inline-block mt-2 text-[10px] font-semibold text-[#2FBF71] bg-[rgba(47,191,113,0.1)] px-2 py-0.5 rounded border border-[rgba(47,191,113,0.2)]">
              {trend}
            </span>
          )}
        </div>

        {/* Unified 36px subtle cricket icon container */}
        <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-btn bg-[rgba(245,185,66,0.08)] border border-[rgba(245,185,66,0.18)] text-[#F5B942]">
          <Icon className="h-4 w-4" />
        </div>
      </div>

      {/* Subtle bottom accent line */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(245,185,66,0.2)] to-transparent" />
    </div>
  );
}
