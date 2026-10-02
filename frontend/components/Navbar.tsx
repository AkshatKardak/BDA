"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3,
  Users,
  Award,
  Compass,
  MapPin,
  Calendar,
  Search,
  Trophy,
  Database,
  Menu,
  X,
  ShieldCheck
} from "lucide-react";

interface NavLinkItem {
  name: string;
  href: string;
  icon: any;
}

const NAV_LINKS: NavLinkItem[] = [
  { name: "Overview", href: "/", icon: BarChart3 },
  { name: "Playoffs", href: "/playoffs", icon: Trophy },
  { name: "Franchises", href: "/teams", icon: Users },
  { name: "Players", href: "/players", icon: Award },
  { name: "Toss", href: "/toss", icon: Compass },
  { name: "Venues", href: "/venues", icon: MapPin },
  { name: "Seasons", href: "/seasons", icon: Calendar },
  { name: "Matches", href: "/matches", icon: Search },
  { name: "Leaderboards", href: "/leaderboards", icon: Trophy },
];

const TECH_LINKS = [
  { name: "Data Quality", href: "/data-quality", icon: ShieldCheck },
  { name: "Pipeline", href: "/pipeline", icon: Database },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#080D19]/95 backdrop-blur-md border-b border-[rgba(255,255,255,0.08)]">
      <div className="max-w-[1360px] h-14 mx-auto px-4 sm:px-5 lg:px-6 flex items-center justify-between gap-4">
        
        {/* Brand Logo & Tournament Identity */}
        <Link 
          href="/" 
          prefetch={true}
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center space-x-2.5 group flex-shrink-0"
        >
          <div className="relative w-7 h-7 min-w-[28px] min-h-[28px] max-w-[28px] max-h-[28px] rounded-full bg-[#0D1830] border border-[rgba(245,185,66,0.35)] group-hover:border-[#F5B942] flex items-center justify-center shadow-sm transition-colors overflow-hidden flex-shrink-0">
            {/* Custom Cricket Ball Mark */}
            <svg 
              width={16}
              height={16}
              viewBox="0 0 24 24" 
              className="w-4 h-4 block" 
              fill="none"
              style={{ width: 16, height: 16, maxWidth: 16, maxHeight: 16, flexShrink: 0 }}
            >
              <circle cx="12" cy="12" r="9" stroke="#165DCC" strokeWidth="1.8" />
              <path
                d="M7 6.5C9.5 8.5 10 11.5 10 12C10 12.5 9.5 15.5 7 17.5"
                stroke="#F5B942"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <path
                d="M17 6.5C14.5 8.5 14 11.5 14 12C14 12.5 14.5 15.5 17 17.5"
                stroke="#F5B942"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
              <circle cx="12" cy="12" r="1.2" fill="#F7F8FC" />
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-white text-xs sm:text-sm tracking-tight leading-tight group-hover:text-[#F5B942] transition-colors whitespace-nowrap">
                IPL Cricket Analytics
              </span>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-[rgba(22,93,204,0.2)] text-[#2476E8] border border-[rgba(36,118,232,0.25)] whitespace-nowrap">
                2008–2026
              </span>
            </div>
            <span className="text-[9px] text-[#707B91] font-mono tracking-wider hidden md:block whitespace-nowrap">
              Flume · HDFS · Hive · PySpark
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center h-full space-x-1 flex-1 justify-center max-w-[820px]">
          {NAV_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={`h-full flex items-center space-x-1.5 px-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-[#F7F8FC] bg-[rgba(22,93,204,0.18)] border-b-2 border-[#F5B942]"
                    : "text-[#8F9AAF] hover:text-[#F7F8FC] hover:bg-[rgba(255,255,255,0.03)]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? "text-[#F5B942]" : "text-[#707B91]"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Telemetry & Pipeline Status */}
        <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
          {TECH_LINKS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-btn text-xs font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "text-[#F7F8FC] bg-[rgba(22,93,204,0.25)] border border-[rgba(36,118,232,0.4)]"
                    : "text-[#8F9AAF] hover:text-[#F7F8FC] hover:bg-[rgba(255,255,255,0.04)]"
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[#F5B942] flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          {/* Pipeline Status Indicator */}
          <Link
            href="/pipeline"
            prefetch={true}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded-btn bg-[#0D1830] border border-[rgba(255,255,255,0.08)] text-xs hover:border-[rgba(245,185,66,0.3)] transition-colors whitespace-nowrap"
          >
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2FBF71] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#2FBF71]"></span>
            </span>
            <span className="font-mono text-[#A9B2C3] text-[10px] font-medium">Pipeline: Active</span>
          </Link>
        </div>

        {/* Mobile / Tablet Menu Button */}
        <div className="flex xl:hidden items-center space-x-2">
          <Link
            href="/pipeline"
            prefetch={true}
            className="flex items-center space-x-1.5 px-2 py-1 rounded-btn bg-[#0D1830] border border-[rgba(255,255,255,0.08)] text-[11px]"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#2FBF71]"></span>
            <span className="font-mono text-[#A9B2C3] text-[10px]">Pipeline</span>
          </Link>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="h-8 w-8 rounded-btn bg-[#0D1830] border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#A9B2C3] hover:text-white hover:border-[rgba(245,185,66,0.3)] transition-all"
          >
            {mobileMenuOpen ? <X className="w-4 h-4 text-[#F5B942]" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer / Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[rgba(255,255,255,0.08)] bg-[#070B16] px-4 py-3 space-y-3 shadow-2xl">
          <div className="text-[10px] font-mono uppercase text-[#707B91] tracking-wider font-semibold">
            Analytics Modules
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {NAV_LINKS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-2 px-2.5 py-2 rounded-btn text-xs font-medium transition-colors ${
                    isActive
                      ? "bg-[rgba(22,93,204,0.22)] text-white border border-[rgba(245,185,66,0.3)]"
                      : "text-[#8F9AAF] hover:text-white bg-[#0D1424] border border-[rgba(255,255,255,0.04)]"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#F5B942]" : "text-[#707B91]"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-[rgba(255,255,255,0.06)] flex flex-col gap-1.5">
            <div className="text-[10px] font-mono uppercase text-[#707B91] tracking-wider font-semibold mb-1">
              Architecture & Telemetry
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {TECH_LINKS.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={true}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-btn text-xs font-medium transition-colors ${
                      isActive
                        ? "bg-[rgba(22,93,204,0.25)] text-white border border-[rgba(36,118,232,0.4)]"
                        : "text-[#8F9AAF] hover:text-white bg-[#0D1424] border border-[rgba(255,255,255,0.04)]"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-[#F5B942]" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
