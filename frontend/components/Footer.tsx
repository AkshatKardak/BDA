import React from "react";
import Link from "next/link";
import { 
  Database, 
  ExternalLink, 
  Server, 
  Layers, 
  Cpu, 
  Radio, 
  GitBranch, 
  ShieldCheck,
  Trophy
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(255,255,255,0.08)] bg-[#050811] text-[#707B91] mt-12">
      <div className="max-w-[1360px] mx-auto px-4 sm:px-5 lg:px-6 py-8 sm:py-10">
        
        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Platform Identity & Academic Scope */}
          <div className="space-y-3">
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
                IPL Cricket Analytics
              </span>
            </div>

            <p className="text-xs text-[#8F9AAF] leading-relaxed">
              Enterprise-grade Big Data platform ingesting, storing, warehousing, and analyzing 
              <strong> 1,243 official IPL fixtures</strong> and <strong>295,732 ball deliveries</strong> (2008-2026).
            </p>

            <div className="flex items-center space-x-2 text-[10px] font-mono text-[#F5B942] bg-[rgba(245,185,66,0.08)] px-2.5 py-1 rounded-btn border border-[rgba(245,185,66,0.2)]">
              <ShieldCheck className="w-3 h-3 text-[#2FBF71]" />
              <span>100% Genuine Cricsheet Data · Zero Mock Records</span>
            </div>
          </div>

          {/* Col 2: Analytics Modules */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-[#F5B942]" />
              Analytics Modules
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/" prefetch={true} className="text-[#8F9AAF] hover:text-[#F4F6FA] transition-colors">
                  Overview & Tournament KPIs
                </Link>
              </li>
              <li>
                <Link href="/live" prefetch={true} className="text-[#E63946] font-medium hover:underline flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E63946] animate-pulse"></span>
                  Live Match Telemetry
                </Link>
              </li>
              <li>
                <Link href="/playoffs" prefetch={true} className="text-[#F5B942] font-medium hover:underline">
                  Playoffs & Finals History (74 Matches)
                </Link>
              </li>
              <li>
                <Link href="/data-quality" prefetch={true} className="text-[#2FBF71] font-medium hover:underline">
                  Data Quality & Pipeline Audit (100%)
                </Link>
              </li>
              <li>
                <Link href="/teams" prefetch={true} className="text-[#8F9AAF] hover:text-[#F4F6FA] transition-colors">
                  Franchise Records & Head-to-Head
                </Link>
              </li>
              <li>
                <Link href="/players" prefetch={true} className="text-[#8F9AAF] hover:text-[#F4F6FA] transition-colors">
                  Player Profiles, Batting & Bowling
                </Link>
              </li>
              <li>
                <Link href="/toss" prefetch={true} className="text-[#8F9AAF] hover:text-[#F4F6FA] transition-colors">
                  Toss Decision & Pitch Advantage
                </Link>
              </li>
              <li>
                <Link href="/venues" prefetch={true} className="text-[#8F9AAF] hover:text-[#F4F6FA] transition-colors">
                  Stadium Profiles & Interactive Map
                </Link>
              </li>
              <li>
                <Link href="/seasons" prefetch={true} className="text-[#8F9AAF] hover:text-[#F4F6FA] transition-colors">
                  Run-Rate Evolution (2008-2026)
                </Link>
              </li>
              <li>
                <Link href="/matches" prefetch={true} className="text-[#8F9AAF] hover:text-[#F4F6FA] transition-colors">
                  Match Explorer & CSV Export
                </Link>
              </li>
              <li>
                <Link href="/leaderboards" prefetch={true} className="text-[#8F9AAF] hover:text-[#F4F6FA] transition-colors">
                  All-Time Titans & Records
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Big Data Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#2476E8]" />
              Big Data Architecture
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-start gap-2">
                <Radio className="w-3.5 h-3.5 text-[#F5B942] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-white">Apache Flume:</span>
                  <p className="text-[11px] text-[#8F9AAF]">Historical stream replay, memory channel buffer, and rolling HDFS sink.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Server className="w-3.5 h-3.5 text-[#2476E8] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-white">Hadoop HDFS:</span>
                  <p className="text-[11px] text-[#8F9AAF]">Distributed partitioned storage at <code className="text-[#2476E8]">/ipl/raw/</code>.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Database className="w-3.5 h-3.5 text-[#F5B942] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-white">Apache Hive:</span>
                  <p className="text-[11px] text-[#8F9AAF]">Schema-on-read DDL and partitioned ORC tables in <code className="text-[#F5B942]">ipl_analytics</code>.</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Cpu className="w-3.5 h-3.5 text-[#2FBF71] mt-0.5 flex-shrink-0" />
                <div>
                  <span className="font-semibold text-white">Apache PySpark:</span>
                  <p className="text-[11px] text-[#8F9AAF]">Distributed DataFrames, window analytics, and zero-leakage MLlib.</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Col 4: Academic Compliance & References */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2FBF71]" />
              Academic Specification
            </h4>
            
            <div className="bg-[#090F1C] p-2.5 rounded-btn border border-[rgba(255,255,255,0.06)] text-[11px] space-y-1">
              <span className="text-[#F5B942] font-semibold block">College Mini-Project Category:</span>
              <p className="text-[#A9B2C3]">Streaming data analysis: use Flume for data capture and Hive/PySpark for analysis.</p>
            </div>

            <ul className="space-y-1.5 text-xs pt-1">
              <li>
                <a
                  href="https://github.com/aadi-jn/indian-premier-league"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1.5 text-[#2476E8] hover:underline"
                >
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">Dataset: aadi-jn/indian-premier-league</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/riddheshawade/IPL_Data_analysis_using_PySpark"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1.5 text-[#F5B942] hover:underline"
                >
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">Ref: riddheshawade/IPL_Data_analysis</span>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/AkshatKardak/BDA"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center space-x-1.5 text-[#F4F6FA] hover:underline"
                >
                  <GitBranch className="w-3 h-3 text-[#2FBF71] flex-shrink-0" />
                  <span className="truncate">Repository: AkshatKardak/BDA</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Student Attribution */}
        <div className="pt-5 border-t border-[rgba(255,255,255,0.06)] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#165DCC]"></span>
            <span className="text-[#8F9AAF]">
              IPL Large-Scale Cricket Data Analytics &copy; 2008-2026. Built by <strong className="text-white">Akshat Kardak</strong>.
            </span>
          </div>

          <div className="flex items-center space-x-3 text-[11px] font-mono text-[#707B91]">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#2FBF71]"></span>
              Pipeline: Operational
            </span>
            <span>·</span>
            <span>FastAPI REST</span>
            <span>·</span>
            <span>Next.js 14</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
