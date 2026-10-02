"use client";

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
  FileText
} from "lucide-react";

const NAV_CENTER = [
  { name: "Overview", href: "/", icon: BarChart3 },
  { name: "Franchises", href: "/teams", icon: Users },
  { name: "Players", href: "/players", icon: Award },
  { name: "Toss", href: "/toss", icon: Compass },
  { name: "Venues", href: "/venues", icon: MapPin },
  { name: "Seasons", href: "/seasons", icon: Calendar },
  { name: "Matches", href: "/matches", icon: Search },
  { name: "Leaderboards", href: "/leaderboards", icon: Trophy },
];

const NAV_RIGHT = [
  { name: "Big Data Pipeline", href: "/pipeline", icon: Database },
  { name: "Project Spec", href: "/about", icon: FileText },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full h-[72px] bg-[#080D19] border-b border-[rgba(255,255,255,0.08)]">
      <div className="max-w-[1440px] h-full mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo - Cricket Ball Seam Inspired */}
        <Link href="/" className="flex items-center space-x-3 group flex-shrink-0">
          <div className="relative w-9 h-9 rounded-full bg-[#0D1830] border border-[rgba(245,185,66,0.3)] flex items-center justify-center shadow-md">
            {/* Custom Cricket Ball Mark */}
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
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
              <circle cx="12" cy="12" r="1.5" fill="#F7F8FC" />
            </svg>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-sm sm:text-base tracking-tight leading-tight">
                IPL Cricket Analytics
              </span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[rgba(22,93,204,0.2)] text-[#2476E8] border border-[rgba(36,118,232,0.25)]">
                2008–2026
              </span>
            </div>
            <span className="text-[10px] text-[#707B91] font-mono tracking-wider">
              Flume · HDFS · Hive · PySpark
            </span>
          </div>
        </Link>

        {/* Center Navigation Links */}
        <nav className="hidden xl:flex items-center h-full space-x-1">
          {NAV_CENTER.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`h-full flex items-center space-x-1.5 px-3 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "text-[#F7F8FC] bg-[rgba(22,93,204,0.18)] border-b-2 border-[#F5B942]"
                    : "text-[#8F9AAF] hover:text-[#F7F8FC] hover:bg-[rgba(255,255,255,0.03)]"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#F5B942]" : "text-[#707B91]"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Technical Links & Pipeline Status */}
        <div className="hidden md:flex items-center space-x-2">
          {NAV_RIGHT.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-btn text-xs font-medium transition-colors ${
                  isActive
                    ? "text-[#F7F8FC] bg-[rgba(22,93,204,0.25)] border border-[rgba(36,118,232,0.4)]"
                    : "text-[#8F9AAF] hover:text-[#F7F8FC] hover:bg-[rgba(255,255,255,0.04)]"
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[#F5B942]" />
                <span>{item.name}</span>
              </Link>
            );
          })}

          <Link
            href="/pipeline"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-btn bg-[#0D1830] border border-[rgba(255,255,255,0.08)] text-xs hover:border-[rgba(245,185,66,0.3)] transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-[#2FBF71]"></span>
            <span className="font-mono text-[#A9B2C3] text-[11px] font-medium">Pipeline</span>
          </Link>
        </div>
      </div>

      {/* Mobile/Tablet Horizontal Scrollable Bar */}
      <div className="xl:hidden overflow-x-auto border-t border-[rgba(255,255,255,0.06)] bg-[#070B16] py-1.5 px-3 flex space-x-1 scrollbar-none">
        {[...NAV_CENTER, ...NAV_RIGHT].map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-shrink-0 flex items-center space-x-1.5 px-2.5 py-1 rounded-btn text-xs font-medium transition-colors ${
                isActive
                  ? "bg-[rgba(22,93,204,0.22)] text-white border-b-2 border-[#F5B942]"
                  : "text-[#8F9AAF] hover:text-white"
              }`}
            >
              <Icon className="w-3 h-3 text-[#F5B942]" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
