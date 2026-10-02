import React from "react";
import { HardDrive, Server, Flame, Database, Cpu, Globe, ArrowRight } from "lucide-react";

export default function ArchitectureFlow() {
  const steps = [
    {
      step: "01",
      title: "Real IPL Dataset",
      tech: "Cricsheet 2008–2026",
      desc: "1,243 matches & 295,732 deliveries normalized to CSV/JSONL",
      icon: HardDrive,
      border: "border-[rgba(22,93,204,0.3)]",
      badge: "bg-[rgba(22,93,204,0.15)] text-[#2476E8]",
    },
    {
      step: "02",
      title: "Streaming Replay",
      tech: "Socket / Spool Emitter",
      desc: "Historical delivery stream replayed to TCP port 44444",
      icon: Server,
      border: "border-[rgba(22,93,204,0.3)]",
      badge: "bg-[rgba(22,93,204,0.15)] text-[#2476E8]",
    },
    {
      step: "03",
      title: "Apache Flume",
      tech: "Data Ingestion Agent",
      desc: "Memory channel buffering with rolling sinks into HDFS",
      icon: Flame,
      border: "border-[rgba(22,93,204,0.3)]",
      badge: "bg-[rgba(22,93,204,0.15)] text-[#2476E8]",
    },
    {
      step: "04",
      title: "Hadoop HDFS",
      tech: "Distributed Storage Lake",
      desc: "Fault-tolerant raw delivery dumps & managed warehouse tables",
      icon: Database,
      border: "border-[rgba(36,118,232,0.3)]",
      badge: "bg-[rgba(36,118,232,0.15)] text-[#2476E8]",
    },
    {
      step: "05",
      title: "Hive + PySpark",
      tech: "Big Data Analytics & ML",
      desc: "ORC partitions, Hive views, PySpark aggregations & MLlib",
      icon: Cpu,
      border: "border-[rgba(245,185,66,0.3)]",
      badge: "bg-[rgba(245,185,66,0.12)] text-[#F5B942]",
    },
    {
      step: "06",
      title: "FastAPI + Next.js",
      tech: "Serving & Web Analytics",
      desc: "16 asynchronous typed REST endpoints & interactive dashboard",
      icon: Globe,
      border: "border-[rgba(255,255,255,0.15)]",
      badge: "bg-[rgba(255,255,255,0.08)] text-[#F7F8FC]",
    },
  ];

  return (
    <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0B1222] p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-[rgba(255,255,255,0.06)]">
        <div>
          <span className="text-[11px] font-bold text-[#F5B942] uppercase tracking-wider font-mono block mb-1">
            BIG DATA PIPELINE
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            From Ball-by-Ball Events to Cricket Intelligence
          </h2>
          <p className="text-xs text-[#A9B2C3] mt-1 max-w-2xl leading-relaxed">
            Real IPL records are replayed through Apache Flume, stored in HDFS and processed using Hive and PySpark.
          </p>
        </div>

        {/* Pipeline Individual Status Indicator */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-btn bg-[#0D1424] border border-[rgba(255,255,255,0.08)] text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2FBF71]"></span>
            <span className="text-[#A9B2C3]">HDFS:</span>
            <span className="text-white font-semibold">Active</span>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-btn bg-[#0D1424] border border-[rgba(255,255,255,0.08)] text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2FBF71]"></span>
            <span className="text-[#A9B2C3]">Hive:</span>
            <span className="text-white font-semibold">Ready</span>
          </div>
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-btn bg-[#0D1424] border border-[rgba(255,255,255,0.08)] text-[11px] font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-[#2FBF71]"></span>
            <span className="text-[#A9B2C3]">PySpark:</span>
            <span className="text-white font-semibold">Processed</span>
          </div>
        </div>
      </div>

      {/* Horizontal Pipeline Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className={`rounded-card border ${s.border} bg-[#0D1424] p-3.5 flex flex-col justify-between transition-colors hover:border-[rgba(245,185,66,0.4)]`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${s.badge}`}>
                    Step {s.step}
                  </span>
                  <Icon className="w-4 h-4 text-[#F5B942]" />
                </div>
                <h3 className="text-xs font-bold text-white mb-0.5">{s.title}</h3>
                <p className="text-[11px] text-[#A9B2C3] font-medium mb-2">{s.tech}</p>
              </div>
              <p className="text-[11px] text-[#707B91] leading-snug">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
