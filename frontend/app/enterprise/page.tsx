"use client";
import { useState } from "react";
import Link from "next/link";
import { runDetection } from "../../lib/api";

// Core Components
import Controls from "../components/Controls";
import EnterpriseRiskTable from "../components/EnterpriseRiskTable";

// The 5 Tactical Graphs
import SwarmGraph from "../components/SwarmGraph";
import BehavioralRadar from "../components/BehavioralRadar";
import PropagationTimeline from "../components/PropagationTimeline";
import RiskHeatmap from "../components/RiskHeatmap";
import GeoCoordination from "../components/GeoCoordination";

export default function UserDashboard() {
  // Application State
  const [data, setData] = useState<any[]>([]);
  const [graphData, setGraphData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Core Detection Trigger
  async function handleRun() {
    setLoading(true);
    setError(null);
    try {
      const res = await runDetection();
      if (!res.top_suspicious_users) {
        throw new Error("Invalid backend response. Engine failed to return data.");
      }
      setData(res.top_suspicious_users);
      setGraphData(res.graph_data || null);
      setStats(res.stats || null);
    } catch (err: any) {
      setError(err.message || "A critical error occurred while fetching telemetry.");
    } finally {
      setLoading(false);
    }
  }

  // Feature: Export Threat Report
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      const report = {
        timestamp: new Date().toISOString(),
        threat_level: "HIGH",
        total_flagged: data.length,
        system_stats: stats,
        suspects: data,
      };
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `StarShield_Threat_Report_${new Date().getTime()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setIsExporting(false);
    }, 800); // Simulate processing time for UX
  };

  return (
    <main className="min-h-screen bg-[#070b14] text-slate-200 py-6 px-4 md:px-8 font-sans selection:bg-blue-500/30">
      <div className="max-w-[1600px] mx-auto">
        
        {/* TOP NAVIGATION & ACTION BAR */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-6 border-b border-slate-800/60 pb-6">
          <div className="space-y-1">
            <Link href="/" className="text-[10px] font-mono text-slate-500 hover:text-blue-400 transition-colors uppercase tracking-[0.2em]">
              ← Return to System Selection
            </Link>
            <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
              Tactical <span className="text-blue-500 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">Alert Queue</span>
            </h1>
            <p className="text-slate-400 text-xs font-mono tracking-wide">Standard Threat Intercept & Moderator View // Level 3 Auth</p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Download Report Button - Only shows when data exists */}
            {data.length > 0 && (
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-blue-400 text-xs font-bold uppercase tracking-widest rounded-lg border border-slate-700 transition-all disabled:opacity-50"
              >
                {isExporting ? "Generating..." : "↓ Export Report"}
              </button>
            )}
            {/* The Main Run Button Component */}
            <Controls onRun={handleRun} isLoading={loading} />
          </div>
        </div>

        {/* SYSTEM STATUS TELEMETRY BAR */}
        <div className="w-full flex flex-wrap items-center gap-6 mb-8 px-4 py-3 bg-slate-900/30 border border-slate-800/50 rounded-xl text-[10px] font-mono uppercase tracking-widest text-slate-500">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Connection Secure
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Graph Analysis Ready
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Behavioral Engine Online
          </div>
          {data.length > 0 && (
            <div className="ml-auto flex items-center gap-2 text-red-400 bg-red-500/10 px-3 py-1 rounded-md border border-red-500/20">
              ⚠️ {data.length} Critical Threats Detected
            </div>
          )}
        </div>

        {/* ERROR BOUNDARY */}
        {error && (
          <div className="w-full mb-8 p-4 text-red-400 bg-red-950/30 border border-red-500/30 rounded-xl shadow-lg flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-bold text-sm">System Error Encountered</p>
              <p className="text-xs opacity-80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* IDLE / EMPTY STATE */}
        {!loading && data.length === 0 && !error && (
          <div className="w-full h-[500px] flex flex-col items-center justify-center border border-dashed border-slate-700/50 rounded-3xl bg-slate-900/10 text-slate-500">
            <div className="w-20 h-20 mb-6 rounded-full bg-slate-800/50 flex items-center justify-center border border-slate-700">
              <svg className="w-8 h-8 opacity-50 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-300 mb-2">Awaiting Telemetry</h3>
            <p className="text-xs font-mono max-w-md text-center leading-relaxed">System is idle. Engage the detection engine to scan network traffic for coordinated micro-swarms and anomalous behavioral signatures.</p>
          </div>
        )}

        {/* FULL 5-GRAPH TACTICAL VIEW */}
        {!loading && data.length > 0 && (
          <div className="grid grid-cols-12 gap-6 animate-in fade-in zoom-in-95 duration-500">
            
            {/* Graph 1: Swarm Graph (Top Wide) */}
            <div className="col-span-12 lg:col-span-8 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest">1️⃣ Live Swarm Topology</h3>
                <span className="text-[9px] text-slate-500 font-mono">Local Cluster View</span>
              </div>
              <SwarmGraph data={graphData} />
            </div>

            {/* Graph 4: Behavioral Radar (Top Right) */}
            <div className="col-span-12 lg:col-span-4 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-2xl backdrop-blur-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xs font-bold text-blue-400 uppercase tracking-widest">4️⃣ Suspect Fingerprint</h3>
              </div>
              <BehavioralRadar userData={data[0]} />
            </div>

            {/* Middle Row: Heatmap, Timeline, Geo */}
            <div className="col-span-12 lg:col-span-4">
              <RiskHeatmap />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <PropagationTimeline />
            </div>
            <div className="col-span-12 lg:col-span-4">
              <GeoCoordination />
            </div>

            {/* The Alert Queue Table */}
            <div className="col-span-12 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 shadow-2xl mt-2">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-1">📋 Priority Action Queue</h3>
                  <p className="text-xs text-slate-500">Deep Behavioral Integrity Audit of flagged accounts.</p>
                </div>
              </div>
              <EnterpriseRiskTable data={data} />
            </div>

          </div>
        )}
      </div>
    </main>
  );
}