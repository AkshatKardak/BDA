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
    <div className="relative overflow-hidden rounded-card bg-[#0D1424] p-3 sm:p-3.5 border border-[rgba(255,255,255,0.08)] shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-all duration-150 hover:border-[rgba(36,118,232,0.3)]">
      <div className="flex items-start justify-between">
        <div className="min-w-0 pr-1.5">
          <p className="text-[10px] font-semibold text-[#707B91] uppercase tracking-wider truncate">
            {label}
          </p>
          <h3 className="mt-1 text-lg sm:text-xl font-bold tracking-tight text-[#F4F6FA] font-sans">
            {typeof value === "number" ? value.toLocaleString() : value}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-[11px] text-[#8F9AAF] truncate">{subtitle}</p>
          )}
          {trend && (
            <span className="inline-block mt-1.5 text-[9px] font-semibold text-[#2FBF71] bg-[rgba(47,191,113,0.1)] px-1.5 py-0.5 rounded border border-[rgba(47,191,113,0.2)]">
              {trend}
            </span>
          )}
        </div>

        {/* Compact 28px cricket icon container */}
        <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-btn bg-[rgba(245,185,66,0.08)] border border-[rgba(245,185,66,0.18)] text-[#F5B942]">
          <Icon className="h-3.5 w-3.5" />
        </div>
      </div>

      {/* Subtle bottom accent line */}
      <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(245,185,66,0.2)] to-transparent" />
    </div>
  );
}
