import React from "react";
import Link from "next/link";
import { GitBranch } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.06)] bg-[#050811] text-[#707B91] mt-16">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-5 lg:px-6 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-bold text-white tracking-tight">
              IPL Cricket Analytics Platform
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(245,185,66,0.1)] text-[#F5B942] border border-[rgba(245,185,66,0.25)]">
              2008–2026
            </span>
            <span className="text-xs text-[#707B91] hidden sm:inline">
              · 1,243 Fixtures · 295,732 Deliveries
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8F9AAF]">
            <Link href="/" prefetch={true} className="hover:text-[#F5B942] transition-colors">
              Overview
            </Link>
            <Link href="/playoffs" prefetch={true} className="hover:text-[#F5B942] transition-colors">
              Playoffs
            </Link>
            <Link href="/teams" prefetch={true} className="hover:text-[#F5B942] transition-colors">
              Franchises
            </Link>
            <Link href="/players" prefetch={true} className="hover:text-[#F5B942] transition-colors">
              Players
            </Link>
            <Link href="/toss" prefetch={true} className="hover:text-[#F5B942] transition-colors">
              Toss
            </Link>
            <Link href="/venues" prefetch={true} className="hover:text-[#F5B942] transition-colors">
              Venues
            </Link>
            <Link href="/seasons" prefetch={true} className="hover:text-[#F5B942] transition-colors">
              Seasons
            </Link>
            <Link href="/matches" prefetch={true} className="hover:text-[#F5B942] transition-colors">
              Matches
            </Link>
            <Link href="/leaderboards" prefetch={true} className="hover:text-[#F5B942] transition-colors">
              Leaderboards
            </Link>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[rgba(255,255,255,0.04)] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#707B91]">
          <div>
            Built by <strong className="text-white font-medium">Akshat Kardak</strong>. All match and ball records derived from official IPL match history.
          </div>
          <div className="flex items-center space-x-3">
            <a
              href="https://github.com/AkshatKardak/BDA"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[#8F9AAF] hover:text-[#2476E8] transition-colors font-mono"
            >
              <GitBranch className="w-3 h-3 text-[#2476E8]" />
              <span>AkshatKardak/BDA</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
