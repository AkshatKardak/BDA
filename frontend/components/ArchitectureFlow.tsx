import React from "react";
import { Database, Server, Flame, Cpu, Globe, HardDrive } from "lucide-react";

export default function ArchitectureFlow() {
  const steps = [
    {
      title: "Real IPL Dataset",
      tech: "Cricsheet 2008–2026",
      desc: "1,243 matches & 295,732 ball deliveries normalized to CSV/JSONL",
      icon: HardDrive,
      color: "border-blue-500/40 bg-blue-950/20 text-blue-400",
    },
    {
      title: "Streaming Replay",
      tech: "Python Socket / Spool",
      desc: "Historical event emission to Flume spooling / port 44444",
      icon: Server,
      color: "border-purple-500/40 bg-purple-950/20 text-purple-400",
    },
    {
      title: "Apache Flume",
      tech: "Data Ingestion Agent",
      desc: "Captures streaming events, memory channel buffering, HDFS sink",
      icon: Flame,
      color: "border-amber-500/40 bg-amber-950/20 text-amber-400",
    },
    {
      title: "Hadoop HDFS",
      tech: "Distributed Data Lake",
      desc: "Fault-tolerant storage at /ipl/raw/deliveries & warehouse partitions",
      icon: Database,
      color: "border-emerald-500/40 bg-emerald-950/20 text-emerald-400",
    },
    {
      title: "Hive + PySpark",
      tech: "Big Data Analytics",
      desc: "ORC tables, HiveQL views, and PySpark distributed transformations",
      icon: Cpu,
      color: "border-indigo-500/40 bg-indigo-950/20 text-indigo-400",
    },
    {
      title: "Web Platform",
      tech: "FastAPI + Next.js",
      desc: "Asynchronous REST endpoints & reactive Tailwind/Recharts UI",
      icon: Globe,
      color: "border-cyan-500/40 bg-cyan-950/20 text-cyan-400",
    },
  ];

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/40 p-6 backdrop-blur-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-6">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            End-to-End Big Data Architecture Pipeline
          </h3>
          <p className="text-xs text-gray-400">
            Fulfills college specification for Streaming Data Analysis using Flume, HDFS, Hive, and PySpark
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1 rounded bg-gray-800 border border-gray-700 text-gray-300">
          Status: Fully Verified & Operational
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="relative group">
              <div
                className={`h-full rounded-lg border ${s.color} p-4 flex flex-col justify-between transition-transform duration-200 group-hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-gray-300">
                      Step {idx + 1}
                    </span>
                    <Icon className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-0.5">{s.title}</h4>
                  <p className="text-[11px] font-semibold text-emerald-400/90 font-mono mb-2">
                    {s.tech}
                  </p>
                </div>
                <p className="text-[11px] text-gray-400 leading-tight">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
