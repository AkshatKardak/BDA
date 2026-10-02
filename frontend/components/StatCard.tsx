import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: "emerald" | "blue" | "amber" | "purple" | "cyan";
  trend?: string;
}

export default function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
  color = "emerald",
  trend,
}: StatCardProps) {
  const colorMap = {
    emerald: {
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      text: "text-emerald-400",
      glow: "group-hover:border-emerald-500/50",
    },
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      text: "text-blue-400",
      glow: "group-hover:border-blue-500/50",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      text: "text-amber-400",
      glow: "group-hover:border-amber-500/50",
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      text: "text-purple-400",
      glow: "group-hover:border-purple-500/50",
    },
    cyan: {
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      text: "text-cyan-400",
      glow: "group-hover:border-cyan-500/50",
    },
  };

  const scheme = colorMap[color];

  return (
    <div
      className={`group relative overflow-hidden rounded-xl bg-gray-900/60 p-5 border ${scheme.border} ${scheme.glow} transition-all duration-300 hover:shadow-lg hover:shadow-black/40 backdrop-blur-sm`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
            {label}
          </p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight text-white font-mono">
            {typeof value === "number" ? value.toLocaleString() : value}
          </h3>
          {subtitle && (
            <p className="mt-1 text-xs text-gray-400">{subtitle}</p>
          )}
          {trend && (
            <span className="inline-block mt-2 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              {trend}
            </span>
          )}
        </div>
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${scheme.bg} ${scheme.text} border ${scheme.border} transition-transform group-hover:scale-110`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-gray-700 to-transparent group-hover:via-emerald-500 transition-colors" />
    </div>
  );
}
