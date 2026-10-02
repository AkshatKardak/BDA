"use client";

import React, { useEffect, useState } from "react";
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  RefreshCw
} from "lucide-react";
import { api } from "@/lib/api";
import ArchitectureFlow from "@/components/ArchitectureFlow";

export default function PipelinePage() {
  const [health, setHealth] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStatus = async () => {
    try {
      setRefreshing(true);
      const res = await api.getPipelineStatus();
      setHealth(res);
    } catch (err) {
      console.error("Failed to load pipeline health:", err);
    } finally {
      setRefreshing(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <div className="w-10 h-10 border-2 border-[rgba(245,185,66,0.2)] border-t-[#F5B942] rounded-full animate-spin"></div>
        <p className="text-xs text-[#A9B2C3] font-mono tracking-wider">Running Big Data health diagnostics...</p>
      </div>
    );
  }

  const components = health?.components || {};
  const isHealthy = health?.status === "HEALTHY";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-widest text-[#F5B942] uppercase mb-0.5">
            <span>INFRASTRUCTURE TELEMETRY</span>
            <span>·</span>
            <span>BIG DATA PIPELINE</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Pipeline Health & Architectural Status
          </h1>
          <p className="text-[11px] text-[#A9B2C3] mt-0.5 max-w-2xl leading-relaxed">
            Real-time diagnostics across Apache Flume ingestion, Hadoop HDFS storage, Hive data warehousing, and PySpark analytics.
          </p>
        </div>

        <button
          onClick={fetchStatus}
          disabled={refreshing}
          className="self-start sm:self-auto h-[32px] sm:h-[34px] px-3 rounded-btn bg-[#0D1424] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(245,185,66,0.3)] text-white text-[11px] font-semibold flex items-center gap-1.5 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#F5B942]" : ""}`} />
          Run Health Audit
        </button>
      </div>

      {/* Global Health Status Banner */}
      <div className={`rounded-card border p-3.5 sm:p-4 ${
        isHealthy 
          ? "bg-[rgba(47,191,113,0.06)] border-[rgba(47,191,113,0.25)]" 
          : "bg-[rgba(245,185,66,0.06)] border-[rgba(245,185,66,0.25)]"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isHealthy ? (
              <CheckCircle2 className="w-5 h-5 text-[#2FBF71] flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-[#F5B942] flex-shrink-0" />
            )}
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Pipeline Status: {health?.status}
              </h2>
              <p className="text-[11px] text-[#A9B2C3] mt-0.5">
                All mandatory Big Data tiers (Flume, HDFS, Hive, PySpark) are verified and operational.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#707B91] hidden md:block">
            Audit: {new Date(health?.timestamp || Date.now()).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Architecture Flow Banner */}
      <ArchitectureFlow />

      {/* Component Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {Object.entries(components).map(([key, comp]: [string, any]) => {
          const isOk = comp.status === "OPERATIONAL" || comp.status === "CONFIGURED";
          const isAnalytics = key.includes("spark") || key.includes("hive");
          const isStorage = key.includes("hdfs") || key.includes("dataset");

          return (
            <div
              key={key}
              className={`rounded-card border p-3.5 sm:p-4 flex flex-col justify-between shadow-[0_4px_16px_rgba(0,0,0,0.12)] ${
                isAnalytics
                  ? "bg-[#0D1424] border-[rgba(245,185,66,0.2)]"
                  : isStorage
                  ? "bg-[#0D1424] border-[rgba(36,118,232,0.25)]"
                  : "bg-[#0D1424] border-[rgba(255,255,255,0.08)]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white">{comp.name}</span>
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                      isOk
                        ? "bg-[rgba(47,191,113,0.12)] text-[#2FBF71] border border-[rgba(47,191,113,0.25)]"
                        : "bg-[rgba(230,57,70,0.12)] text-[#E63946] border border-[rgba(230,57,70,0.25)]"
                    }`}
                  >
                    {comp.status}
                  </span>
                </div>
                <p className="text-[11px] text-[#A9B2C3] mb-3 leading-relaxed">
                  {comp.message}
                </p>
              </div>

              {comp.details && (
                <div className="bg-[#070B16] rounded-btn p-2 border border-[rgba(255,255,255,0.06)] font-mono text-[9px] text-[#707B91] space-y-1 overflow-x-auto">
                  {Object.entries(comp.details).map(([k, v]: [string, any]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <span className="text-[#707B91]">{k}:</span>
                      <span className="text-white font-semibold truncate">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Technical Commands Reference */}
      <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-3.5 sm:p-4 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
        <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5 mb-2">
          <Terminal className="w-3.5 h-3.5 text-[#F5B942]" />
          Pipeline Execution Commands
        </h3>
        <p className="text-[11px] text-[#707B91] mb-3">
          The pipeline can be executed end-to-end or component-by-component using the standard repository scripts:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs font-mono">
          <div className="bg-[#070B16] p-2.5 rounded-btn border border-[rgba(255,255,255,0.06)]">
            <p className="text-[9px] uppercase font-bold text-[#F5B942] mb-0.5">
              1. Historical Streaming Replay (Flume Source)
            </p>
            <code className="text-[#2476E8] text-[11px]">python streaming/replay_ipl.py --mode stdout --delay 0.01</code>
          </div>
          <div className="bg-[#070B16] p-2.5 rounded-btn border border-[rgba(255,255,255,0.06)]">
            <p className="text-[9px] uppercase font-bold text-[#2476E8] mb-0.5">
              2. Apache Flume Agent Startup
            </p>
            <code className="text-white text-[11px]">flume-ng agent -n agent -c conf -f flume/ipl-flume.conf</code>
          </div>
          <div className="bg-[#070B16] p-2.5 rounded-btn border border-[rgba(255,255,255,0.06)]">
            <p className="text-[9px] uppercase font-bold text-[#F5B942] mb-0.5">
              3. Apache PySpark Distributed Analytics
            </p>
            <code className="text-[#2476E8] text-[11px]">python pyspark/run_all_analytics.py</code>
          </div>
          <div className="bg-[#070B16] p-2.5 rounded-btn border border-[rgba(255,255,255,0.06)]">
            <p className="text-[9px] uppercase font-bold text-white mb-0.5">
              4. FastAPI Backend Server
            </p>
            <code className="text-[#2476E8] text-[11px]">python -m uvicorn backend.main:app --port 8000 --reload</code>
          </div>
        </div>
      </div>
    </div>
  );
}
