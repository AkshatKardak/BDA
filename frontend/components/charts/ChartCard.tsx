"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, BarChart3, AlertCircle } from "lucide-react";

interface ChartCardProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: any;
  actionHref?: string;
  actionText?: string;
  children: React.ReactNode;
  heightClass?: string;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  className?: string;
}

export default function ChartCard({
  eyebrow,
  title,
  subtitle,
  icon: Icon = BarChart3,
  actionHref,
  actionText = "View All",
  children,
  heightClass = "h-64 sm:h-72",
  loading = false,
  empty = false,
  emptyMessage = "No telemetry data available for the current filter criteria.",
  className = "",
}: ChartCardProps) {
  // Auto-detect empty state across various chart prop conventions
  const childProps = React.isValidElement(children) ? (children.props as any) : null;
  const isChildrenDataEmpty = !children || (
    childProps && (
      (Array.isArray(childProps.data) && childProps.data.length === 0) ||
      (Array.isArray(childProps.items) && childProps.items.length === 0) ||
      (Array.isArray(childProps.frames) && childProps.frames.length === 0) ||
      (Array.isArray(childProps.seasons) && childProps.seasons.length === 0) ||
      (Array.isArray(childProps.nodes) && childProps.nodes.length === 0)
    )
  );

  const isEffectivelyEmpty = empty || isChildrenDataEmpty;

  return (
    <div
      className={`rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0A101D] p-4 sm:p-5 shadow-[0_4px_16px_rgba(0,0,0,0.12)] flex flex-col ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3 pb-2.5 border-b border-[rgba(255,255,255,0.06)] gap-2">
        <div>
          {eyebrow && (
            <span className="text-[10px] font-mono text-[#F5B942] uppercase tracking-wider font-bold block mb-0.5">
              {eyebrow}
            </span>
          )}
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 font-mono">
            {Icon && <Icon className="w-3.5 h-3.5 text-[#F5B942] flex-shrink-0" />}
            <span>{title}</span>
          </h3>
          {subtitle && (
            <p className="text-[11px] text-[#8F9AAF] mt-0.5 leading-normal">
              {subtitle}
            </p>
          )}
        </div>

        {actionHref && (
          <Link
            href={actionHref}
            prefetch={true}
            className="text-[11px] text-[#2476E8] hover:text-[#F5B942] transition-colors flex items-center gap-1 font-medium whitespace-nowrap flex-shrink-0"
          >
            <span>{actionText}</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* Body / Chart Area with clean vertical padding */}
      <div className={`relative w-full ${heightClass} pt-2 pb-1`}>
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-[#070B16]/50 rounded-btn">
            <div className="w-6 h-6 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin" />
            <span className="text-[10px] font-mono text-[#707B91]">Rendering Visual Analytics...</span>
          </div>
        ) : isEffectivelyEmpty ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 text-center p-4 bg-[#070B16]/30 rounded-btn border border-[rgba(255,255,255,0.03)]">
            <AlertCircle className="w-5 h-5 text-[#8F9AAF] opacity-60 flex-shrink-0" />
            <p className="text-xs text-[#A9B2C3] font-mono max-w-xs">{emptyMessage}</p>
          </div>
        ) : (
          <div className="w-full h-full min-h-[220px]">{children}</div>
        )}
      </div>
    </div>
  );
}
