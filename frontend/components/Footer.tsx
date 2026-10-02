import React from "react";
import { Database, Cpu, Terminal, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-800/80 bg-[#070A11] text-gray-400 py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white text-lg tracking-tight">
                IPL Big Data Analytics Engine
              </span>
              <span className="text-[10px] bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">
                Academic Standard
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-lg">
              Engineered to satisfy the college mini-project specification for 
              <strong className="text-gray-200"> Streaming Data Analysis</strong> using 
              <strong className="text-emerald-400"> Apache Flume</strong> for data capture, 
              <strong className="text-amber-400"> Hadoop HDFS</strong> for distributed storage, and 
              <strong className="text-blue-400"> Apache Hive & PySpark</strong> for large-scale distributed analytics.
            </p>
            <div className="flex items-center space-x-4 text-xs font-mono text-gray-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Genuine Cricsheet Records
              </span>
              <span>•</span>
              <span>1,243 Matches</span>
              <span>•</span>
              <span>295,732 Deliveries</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-3">
              Big Data Architecture
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-2">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>Flume Ingestion Engine</span>
              </li>
              <li className="flex items-center space-x-2">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hadoop HDFS Lake (/ipl/raw)</span>
              </li>
              <li className="flex items-center space-x-2">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                <span>Hive Data Warehouse & ORC</span>
              </li>
              <li className="flex items-center space-x-2">
                <Cpu className="w-3.5 h-3.5 text-purple-400" />
                <span>PySpark Distributed Analytics</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold text-gray-200 uppercase tracking-wider mb-3">
              Core References
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a 
                  href="https://github.com/aadi-jn/indian-premier-league" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  IPL 2008–2026 Primary Dataset
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/riddheshawade/IPL_Data_analysis_using_PySpark" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  IPL PySpark Architecture Reference
                </a>
              </li>
              <li>
                <a 
                  href="https://cricsheet.org" 
                  target="_blank" 
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Cricsheet Open Ball-by-Ball Data
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <div>
            IPL Large-Scale Cricket Data Analytics © 2008–2026. Academic Production Release.
          </div>
          <div className="mt-2 sm:mt-0 font-mono">
            FastAPI · Next.js · TypeScript · Tailwind CSS · Recharts
          </div>
        </div>
      </div>
    </footer>
  );
}
