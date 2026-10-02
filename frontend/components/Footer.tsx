import React from "react";
import Link from "next/link";
import { ShieldCheck, GitBranch } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[#050811] text-[#707B91] mt-14">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-5 lg:px-6 py-8">
        
        {/* Top Minimal Strip: Brand Identity & Quick Navigation */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[rgba(255,255,255,0.06)]">
          
          {/* Brand Info */}
          <div className="space-y-1.5 max-w-lg">
            <div className="flex items-center space-x-2.5">
              <div className="relative w-6 h-6 min-w-[24px] min-h-[24px] max-w-[24px] max-h-[24px] rounded-full bg-[#0D1830] border border-[rgba(245,185,66,0.35)] flex items-center justify-center overflow-hidden flex-shrink-0">
                <svg 
                  width={14}
                  height={14}
                  viewBox="0 0 24 24" 
                  className="w-3.5 h-3.5 block" 
                  fill="none"
                  style={{ width: 14, height: 14, maxWidth: 14, maxHeight: 14, flexShrink: 0 }}
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
                </svg>
              </div>
              <span className="text-sm font-bold text-white tracking-tight">
                IPL Cricket Analytics Platform
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[rgba(245,185,66,0.1)] text-[#F5B942] border border-[rgba(245,185,66,0.25)]">
                2008–2026 Archive
              </span>
            </div>

            <p className="text-xs text-[#8F9AAF] leading-relaxed">
              Large-scale Big Data platform indexing <strong>1,243 official IPL fixtures</strong> and <strong>295,732 ball deliveries</strong>. 100% genuine Cricsheet telemetry.
            </p>
          </div>

          {/* Minimal Quick Links */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <Link href="/" prefetch={true} className="text-[#8F9AAF] hover:text-white transition-colors">
              Overview
            </Link>
            <Link href="/playoffs" prefetch={true} className="text-[#F5B942] hover:underline transition-colors font-medium">
              Playoffs & Finals
            </Link>
            <Link href="/teams" prefetch={true} className="text-[#8F9AAF] hover:text-white transition-colors">
              Franchises
            </Link>
            <Link href="/players" prefetch={true} className="text-[#8F9AAF] hover:text-white transition-colors">
              Players
            </Link>
            <Link href="/toss" prefetch={true} className="text-[#8F9AAF] hover:text-white transition-colors">
              Toss Insights
            </Link>
            <Link href="/venues" prefetch={true} className="text-[#8F9AAF] hover:text-white transition-colors">
              Venues
            </Link>
            <Link href="/seasons" prefetch={true} className="text-[#8F9AAF] hover:text-white transition-colors">
              Seasons
            </Link>
            <Link href="/matches" prefetch={true} className="text-[#8F9AAF] hover:text-white transition-colors">
              Matches
            </Link>
            <Link href="/leaderboards" prefetch={true} className="text-[#8F9AAF] hover:text-white transition-colors">
              Leaderboards
            </Link>
            <Link href="/data-quality" prefetch={true} className="text-[#2FBF71] hover:underline transition-colors font-medium">
              Data Quality
            </Link>
            <Link href="/pipeline" prefetch={true} className="text-[#2476E8] hover:underline transition-colors font-medium">
              Pipeline
            </Link>
          </div>
        </div>

        {/* Minimal Bottom Bar: Author Attribution & Data Lake Status */}
        <div className="pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#165DCC]"></span>
            <span className="text-[#8F9AAF]">
              IPL Large-Scale Cricket Data Analytics &copy; 2008–2026. Built by <strong className="text-white font-medium">Akshat Kardak</strong>.
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-mono text-[#707B91]">
            <span className="flex items-center gap-1.5 text-[#2FBF71]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Lake Verified · 0 Data Loss</span>
            </span>
            <span>·</span>
            <a
              href="https://github.com/AkshatKardak/BDA"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-[#8F9AAF] hover:text-white transition-colors"
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
