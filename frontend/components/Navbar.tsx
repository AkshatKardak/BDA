"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Activity, 
  Database, 
  Users, 
  Award, 
  Compass, 
  MapPin, 
  Calendar, 
  Search, 
  FileText,
  Flame
} from "lucide-react";

const NAV_ITEMS = [
  { name: "Overview", href: "/", icon: Activity },
  { name: "Franchises", href: "/teams", icon: Users },
  { name: "Players", href: "/players", icon: Award },
  { name: "Toss Insights", href: "/toss", icon: Compass },
  { name: "Venues", href: "/venues", icon: MapPin },
  { name: "Seasons", href: "/seasons", icon: Calendar },
  { name: "Matches", href: "/matches", icon: Search },
  { name: "Leaderboards", href: "/leaderboards", icon: Award },
  { name: "Big Data Pipeline", href: "/pipeline", icon: Database },
  { name: "Project Spec", href: "/about", icon: FileText },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#0B0F19]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-blue-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="text-xl font-black text-white tracking-wider">IPL</span>
            </div>
            <div>
              <div className="font-bold text-white text-base tracking-tight flex items-center gap-2">
                Large-Scale Cricket Analytics
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                  2008–2026
                </span>
              </div>
              <div className="text-[11px] text-gray-400 font-mono flex items-center gap-1.5">
                <Flame className="w-3 h-3 text-amber-400 animate-pulse" />
                Flume · HDFS · Hive · PySpark
              </div>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-sm"
                      : "text-gray-400 hover:text-gray-200 hover:bg-gray-800/60"
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? "text-emerald-400" : "text-gray-500"}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Pipeline Badge */}
          <Link
            href="/pipeline"
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs hover:bg-emerald-900/40 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-mono font-medium">Lake Active</span>
          </Link>
        </div>
      </div>

      {/* Mobile Scrollable Navigation */}
      <div className="lg:hidden overflow-x-auto border-t border-gray-800/60 py-2 px-4 flex space-x-2 scrollbar-none">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-shrink-0 flex items-center space-x-1.5 px-3 py-1 rounded-md text-xs font-medium ${
                isActive
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                  : "text-gray-400 hover:bg-gray-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
    </header>
  );
}
