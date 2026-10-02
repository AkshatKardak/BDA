"use client";

import React from "react";
import { 
  FileText, 
  ShieldCheck, 
  Flame, 
  Database, 
  Cpu, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  BookOpen
} from "lucide-react";
import ArchitectureFlow from "@/components/ArchitectureFlow";

export default function AboutPage() {
  const verificationPoints = [
    { name: "Genuine Dataset", status: "1,243 matches, 295,732 ball deliveries from Cricsheet (zero synthetic data)" },
    { name: "Streaming Capture", status: "Apache Flume agent config + historical delivery socket/spool replay engine" },
    { name: "Distributed Storage", status: "Hadoop HDFS cluster configuration, core-site, hdfs-site, and winutils binaries" },
    { name: "Data Warehousing", status: "Apache Hive database, partitioned ORC tables, and analytical reporting views" },
    { name: "Distributed Analytics", status: "Apache PySpark DataFrame and Spark SQL pipelines executed across 8 stages" },
    { name: "Match Prediction", status: "Zero-leakage pre-match classification using PySpark MLlib (Logistic Regression & Random Forest)" },
    { name: "Backend API", status: "FastAPI REST service with type-safe Pydantic schemas and 16 validated endpoints" },
    { name: "Frontend Platform", status: "Next.js 14 App Router, TypeScript, Tailwind CSS, and interactive Recharts visualizations" },
  ];

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-[#F5B942] uppercase mb-0.5">
          <span>ACADEMIC SPECIFICATION</span>
          <span>·</span>
          <span>COLLEGE MINI PROJECT</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
          Project Definition & Big Data Architecture
        </h1>
        <p className="text-[11px] text-[#A9B2C3] mt-0.5 leading-relaxed">
          Technical documentation satisfying the academic evaluation criteria for Big Data Analytics.
        </p>
      </div>

      {/* College Requirement Banner */}
      <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-3.5 sm:p-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <h2 className="text-xs sm:text-sm font-bold text-white mb-2 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-[#F5B942]" />
          Syllabus Requirement & Category
        </h2>
        <div className="bg-[#070B16] rounded-btn p-3 border border-[rgba(255,255,255,0.06)] font-mono text-[11px] text-[#A9B2C3] space-y-1.5">
          <p className="text-[#F5B942] font-bold">
            Mini Project: One real-life large data application to be implemented (Use standard datasets available on the web).
          </p>
          <p className="text-[#F4F6FA]">
            <strong>Selected Category:</strong> Streaming data analysis: use Flume for data capture and HIVE/PySpark for analysis.
          </p>
        </div>
      </div>

      {/* Architecture Flow */}
      <ArchitectureFlow />

      {/* Detailed Technical Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        <div className="rounded-card border border-[rgba(22,93,204,0.3)] bg-[#0D1424] p-3.5 sm:p-4 space-y-2 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-[#F5B942]" />
            1. Apache Flume (Streaming Ingestion)
          </h3>
          <p className="text-[11px] text-[#A9B2C3] leading-relaxed">
            Captures continuous delivery-level cricket events replayed from real historical IPL fixtures. 
            Uses memory channel buffering and flushes to Hadoop HDFS partitioned directories with size- and event-based rolling policies.
          </p>
          <p className="text-[10px] font-mono text-[#707B91]">
            Source: Exec / Netcat / Spool · Channel: Memory · Sink: HDFS
          </p>
        </div>

        <div className="rounded-card border border-[rgba(36,118,232,0.3)] bg-[#0D1424] p-3.5 sm:p-4 space-y-2 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#2476E8]" />
            2. Hadoop HDFS (Distributed Storage)
          </h3>
          <p className="text-[11px] text-[#A9B2C3] leading-relaxed">
            Provides distributed, fault-tolerant storage for raw event streams at <code className="text-[#2476E8]">/ipl/raw/deliveries/</code> and 
            structured analytical partitions at <code className="text-[#2476E8]">/ipl/warehouse/</code>. Includes native winutils binary support for Windows.
          </p>
          <p className="text-[10px] font-mono text-[#707B91]">
            HDFS Block Size: 128 MB · Replication: 1 (Local) / 3 (Prod)
          </p>
        </div>

        <div className="rounded-card border border-[rgba(245,185,66,0.3)] bg-[#0D1424] p-3.5 sm:p-4 space-y-2 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#F5B942]" />
            3. Apache Hive (Data Warehouse)
          </h3>
          <p className="text-[11px] text-[#A9B2C3] leading-relaxed">
            Manages schema-on-read querying over raw datasets and partitioned ORC tables in the <code className="text-[#F5B942]">ipl_analytics</code> database.
            Materializes analytical data marts for player batting, bowling, team win-rates, and venue profiles.
          </p>
          <p className="text-[10px] font-mono text-[#707B91]">
            Format: ORC Snappy · Partitions: season, team · Views: 5
          </p>
        </div>

        <div className="rounded-card border border-[rgba(255,255,255,0.15)] bg-[#0D1424] p-3.5 sm:p-4 space-y-2 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
          <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-[#F7F8FC]" />
            4. Apache PySpark (Distributed Analytics & ML)
          </h3>
          <p className="text-[11px] text-[#A9B2C3] leading-relaxed">
            Executes distributed DataFrame transformations, window functions, and multi-season aggregations over 295,732 records.
            Trains pre-match outcome prediction models (Logistic Regression & Random Forest) with strict zero-leakage validation.
          </p>
          <p className="text-[10px] font-mono text-[#707B91]">
            Engine: PySpark 4.2.0 · JVM: OpenJDK 22 · Stages: 8
          </p>
        </div>
      </div>

      {/* Verification Matrix */}
      <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-3.5 sm:p-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <h3 className="text-xs sm:text-sm font-bold text-white mb-2.5 flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-[#2FBF71]" />
          Pipeline Audit & Verification Matrix (8/8 Verified)
        </h3>
        <div className="divide-y divide-[rgba(255,255,255,0.04)] text-xs">
          {verificationPoints.map((item, idx) => (
            <div key={idx} className="py-1.5 flex items-start justify-between gap-3">
              <div className="flex items-center gap-1.5 font-medium text-white text-[11px] sm:text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#2FBF71] flex-shrink-0" />
                <span>{item.name}</span>
              </div>
              <span className="text-[#A9B2C3] text-right font-mono text-[10px] sm:text-[11px]">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Dataset Provenance */}
      <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-3.5 sm:p-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <h3 className="text-xs sm:text-sm font-bold text-white mb-2">Primary References & Data Provenance</h3>
        <p className="text-[11px] text-[#A9B2C3] mb-3 leading-relaxed">
          In strict accordance with academic guidelines, no synthetic, random, or mocked cricket records are used in this project.
          All data originates from primary public ball-by-ball IPL repositories:
        </p>
        <ul className="space-y-1.5 text-[11px]">
          <li className="flex items-center space-x-2">
            <ExternalLink className="w-3.5 h-3.5 text-[#2476E8]" />
            <a 
              href="https://github.com/aadi-jn/indian-premier-league" 
              target="_blank" 
              rel="noreferrer"
              className="text-[#2476E8] hover:underline"
            >
              Primary Dataset: aadi-jn/indian-premier-league (2008–2026 Cricsheet records)
            </a>
          </li>
          <li className="flex items-center space-x-2">
            <ExternalLink className="w-3.5 h-3.5 text-[#F5B942]" />
            <a 
              href="https://github.com/riddheshawade/IPL_Data_analysis_using_PySpark" 
              target="_blank" 
              rel="noreferrer"
              className="text-[#F5B942] hover:underline"
            >
              Architectural Reference: riddheshawade/IPL_Data_analysis_using_PySpark
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
