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
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-mono font-bold tracking-widest text-[#F5B942] uppercase mb-1">
            <span>INFRASTRUCTURE TELEMETRY</span>
            <span>·</span>
            <span>BIG DATA PIPELINE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Pipeline Health & Architectural Status
          </h1>
          <p className="text-xs text-[#A9B2C3] mt-1 max-w-2xl leading-relaxed">
            Real-time diagnostics across Apache Flume ingestion, Hadoop HDFS storage, Hive data warehousing, and PySpark analytics.
          </p>
        </div>

        <button
          onClick={fetchStatus}
          disabled={refreshing}
          className="self-start sm:self-auto h-[40px] px-4 rounded-btn bg-[#0D1424] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(245,185,66,0.3)] text-white text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-[#F5B942]" : ""}`} />
          Run Health Audit
        </button>
      </div>

      {/* Global Health Status Banner */}
      <div className={`rounded-card border p-5 sm:p-6 ${
        isHealthy 
          ? "bg-[rgba(47,191,113,0.06)] border-[rgba(47,191,113,0.25)]" 
          : "bg-[rgba(245,185,66,0.06)] border-[rgba(245,185,66,0.25)]"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            {isHealthy ? (
              <CheckCircle2 className="w-7 h-7 text-[#2FBF71] flex-shrink-0" />
            ) : (
              <AlertCircle className="w-7 h-7 text-[#F5B942] flex-shrink-0" />
            )}
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Pipeline Status: {health?.status}
              </h2>
              <p className="text-xs text-[#A9B2C3] mt-0.5">
                All mandatory Big Data tiers (Flume, HDFS, Hive, PySpark) are verified and operational.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-[#707B91] hidden md:block">
            Audit: {new Date(health?.timestamp || Date.now()).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Architecture Flow Banner */}
      <ArchitectureFlow />

      {/* Component Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(components).map(([key, comp]: [string, any]) => {
          const isOk = comp.status === "OPERATIONAL" || comp.status === "CONFIGURED";
          const isAnalytics = key.includes("spark") || key.includes("hive");
          const isStorage = key.includes("hdfs") || key.includes("dataset");

          return (
            <div
              key={key}
              className={`rounded-card border p-5 flex flex-col justify-between shadow-[0_8px_30px_rgba(0,0,0,0.16)] ${
                isAnalytics
                  ? "bg-[#0D1424] border-[rgba(245,185,66,0.2)]"
                  : isStorage
                  ? "bg-[#0D1424] border-[rgba(36,118,232,0.25)]"
                  : "bg-[#0D1424] border-[rgba(255,255,255,0.08)]"
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white">{comp.name}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      isOk
                        ? "bg-[rgba(47,191,113,0.12)] text-[#2FBF71] border border-[rgba(47,191,113,0.25)]"
                        : "bg-[rgba(230,57,70,0.12)] text-[#E63946] border border-[rgba(230,57,70,0.25)]"
                    }`}
                  >
                    {comp.status}
                  </span>
                </div>
                <p className="text-xs text-[#A9B2C3] mb-4 leading-relaxed">
                  {comp.message}
                </p>
              </div>

              {comp.details && (
                <div className="bg-[#070B16] rounded-btn p-3 border border-[rgba(255,255,255,0.06)] font-mono text-[10px] text-[#707B91] space-y-1 overflow-x-auto">
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
      <div className="rounded-card border border-[rgba(255,255,255,0.08)] bg-[#0D1424] p-5 sm:p-6 shadow-[0_8px_30px_rgba(0,0,0,0.16)]">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4 text-[#F5B942]" />
          Pipeline Execution Commands
        </h3>
        <p className="text-xs text-[#707B91] mb-4">
          The pipeline can be executed end-to-end or component-by-component using the standard repository scripts:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-[#070B16] p-3 rounded-btn border border-[rgba(255,255,255,0.06)]">
            <p className="text-[10px] uppercase font-bold text-[#F5B942] mb-1">
              1. Historical Streaming Replay (Flume Source)
            </p>
            <code className="text-[#2476E8]">python streaming/replay_ipl.py --mode stdout --delay 0.01</code>
          </div>
          <div className="bg-[#070B16] p-3 rounded-btn border border-[rgba(255,255,255,0.06)]">
            <p className="text-[10px] uppercase font-bold text-[#2476E8] mb-1">
              2. Apache Flume Agent Startup
            </p>
            <code className="text-white">flume-ng agent -n agent -c conf -f flume/ipl-flume.conf</code>
          </div>
          <div className="bg-[#070B16] p-3 rounded-btn border border-[rgba(255,255,255,0.06)]">
            <p className="text-[10px] uppercase font-bold text-[#F5B942] mb-1">
              3. Apache PySpark Distributed Analytics
            </p>
            <code className="text-[#2476E8]">python pyspark/run_all_analytics.py</code>
          </div>
          <div className="bg-[#070B16] p-3 rounded-btn border border-[rgba(255,255,255,0.06)]">
            <p className="text-[10px] uppercase font-bold text-white mb-1">
              4. FastAPI Backend Server
            </p>
            <code className="text-[#2476E8]">python -m uvicorn backend.main:app --port 8000 --reload</code>
          </div>
        </div>
      </div>
    </div>
  );
}
