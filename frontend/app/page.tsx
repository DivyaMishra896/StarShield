"use client";
import { useState } from "react";
import { runDetection } from "../lib/api";
import Controls from "./components/Controls";
import RiskTable from "./components/RiskTable";

export default function Home() {
  const [data, setData] = useState<{ user_id: string; risk_score: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    setLoading(true);
    setError(null);
    try {
      const res = await runDetection();
      setData(res.top_suspicious_users);
    } catch (err: any) {
      setError(err.message || "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center py-12 px-4 font-sans selection:bg-blue-500/30">
      
      {/* Header with a glowing text gradient */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 drop-shadow-sm mb-4">
          🛡 StarShield Engine
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Coordinated Micro-Swarm Detection Pipeline
        </p>
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center gap-8">
        {/* We pass the loading state here now */}
        <Controls onRun={handleRun} isLoading={loading} />

        {/* Error State */}
        {error && (
          <div className="w-full p-4 text-red-400 bg-red-950/50 border border-red-500/20 rounded-xl shadow-lg animate-pulse">
            <span className="font-bold">❌ Detection Failed:</span> {error}
          </div>
        )}

        {/* Table fades in when data arrives */}
        {!error && data.length > 0 && (
          <div className="w-full animate-[fadeIn_0.5s_ease-out]">
             <RiskTable data={data} />
          </div>
        )}
      </div>
    </main>
  );
}