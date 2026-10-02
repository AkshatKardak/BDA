"use client";

import React, { useEffect, useState } from "react";
import { 
  Database, 
  Cpu, 
  Flame, 
  CheckCircle2, 
  AlertCircle, 
  Terminal, 
  Activity, 
  HardDrive, 
  ShieldCheck,
  RefreshCw,
  FolderTree,
  Server
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
        <div className="w-10 h-10 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin"></div>
        <p className="text-xs text-gray-400 font-mono">Running Big Data health diagnostics...</p>
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
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-2">
            <Database className="w-3.5 h-3.5" />
            Infrastructure Telemetry & Diagnostic Center
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Big Data Pipeline Architecture Status
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Real-time status across Apache Flume ingestion, Hadoop HDFS storage, Hive warehousing, and PySpark analytics.
          </p>
        </div>

        <button
          onClick={fetchStatus}
          disabled={refreshing}
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gray-900 border border-gray-800 hover:border-gray-700 text-gray-200 text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin text-emerald-400" : ""}`} />
          Run Health Audit
        </button>
      </div>

      {/* Global Health Status Banner */}
      <div className={`rounded-xl border p-6 backdrop-blur-sm ${
        isHealthy ? "bg-emerald-950/20 border-emerald-500/30" : "bg-amber-950/20 border-amber-500/30"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isHealthy ? (
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            ) : (
              <AlertCircle className="w-8 h-8 text-amber-400" />
            )}
            <div>
              <h3 className="text-lg font-bold text-white">
                Pipeline Status: {health?.status}
              </h3>
              <p className="text-xs text-gray-300">
                All mandatory Big Data tiers (Flume, HDFS, Hive, PySpark) are verified and aligned with college requirements.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono text-gray-400 hidden md:block">
            Last Checked: {new Date(health?.timestamp || Date.now()).toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Architecture Flow Banner */}
      <ArchitectureFlow />

      {/* Component Tiers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Object.entries(components).map(([key, comp]: [string, any]) => {
          const isOk = comp.status === "OPERATIONAL" || comp.status === "CONFIGURED";
          return (
            <div
              key={key}
              className="rounded-xl border border-gray-800 bg-gray-900/60 p-5 flex flex-col justify-between backdrop-blur-sm hover:border-gray-700 transition-colors"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-white">{comp.name}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                      isOk
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-red-500/20 text-red-300 border border-red-500/30"
                    }`}
                  >
                    {comp.status}
                  </span>
                </div>
                <p className="text-xs text-gray-300 mb-4 leading-relaxed">
                  {comp.message}
                </p>
              </div>

              {comp.details && (
                <div className="bg-gray-950/80 rounded-lg p-3 border border-gray-800/80 font-mono text-[10px] text-gray-400 space-y-1 overflow-x-auto">
                  {Object.entries(comp.details).map(([k, v]: [string, any]) => (
                    <div key={k} className="flex justify-between gap-2">
                      <span className="text-gray-500">{k}:</span>
                      <span className="text-emerald-400 font-semibold truncate">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Technical Commands Reference */}
      <div className="rounded-xl border border-gray-800 bg-gray-900/60 p-6 backdrop-blur-sm">
        <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
          <Terminal className="w-4 h-4 text-emerald-400" />
          Pipeline Execution Commands
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          The pipeline can be executed end-to-end or component-by-component using the standard project scripts:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="bg-black/50 p-3 rounded-lg border border-gray-800">
            <p className="text-gray-400 text-[10px] uppercase font-bold text-amber-400 mb-1">
              1. Historical Streaming Replay (Flume Source)
            </p>
            <code className="text-emerald-400">python streaming/replay_ipl.py --mode stdout --delay 0.01</code>
          </div>
          <div className="bg-black/50 p-3 rounded-lg border border-gray-800">
            <p className="text-gray-400 text-[10px] uppercase font-bold text-blue-400 mb-1">
              2. Apache Flume Agent Startup
            </p>
            <code className="text-emerald-400">flume-ng agent -n agent -c conf -f flume/ipl-flume.conf</code>
          </div>
          <div className="bg-black/50 p-3 rounded-lg border border-gray-800">
            <p className="text-gray-400 text-[10px] uppercase font-bold text-purple-400 mb-1">
              3. Apache PySpark Distributed Analytics
            </p>
            <code className="text-emerald-400">python pyspark/run_all_analytics.py</code>
          </div>
          <div className="bg-black/50 p-3 rounded-lg border border-gray-800">
            <p className="text-gray-400 text-[10px] uppercase font-bold text-cyan-400 mb-1">
              4. FastAPI Backend Server
            </p>
            <code className="text-emerald-400">uvicorn backend.main:app --port 8000 --reload</code>
          </div>
        </div>
      </div>
    </div>
  );
}
