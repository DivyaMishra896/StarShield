"use client";
import { useState } from "react";
import Link from "next/link";
import { runDetection } from "../../lib/api";
import Controls from "../components/Controls";
import UserRiskTable from "../components/UserRiskTable";

export default function UserDashboard() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastScan, setLastScan] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleRun() {
    setLoading(true);
    setError(null);
    try {
      const res = await runDetection();
      setData(res.top_suspicious_users);
      setLastScan(new Date().toLocaleTimeString());
    } catch (err: any) {
      setError(err.message || "Detection engine failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-200 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header & Back Button */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="text-sm text-slate-500 hover:text-blue-400 transition-colors">
            ← Back to Select
          </Link>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-slate-200">User Dashboard</h1>
            <p className="text-xs text-slate-500">Standard Threat Alert Interface</p>
          </div>
        </div>

        {/* Threat Level Banner */}
        <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-6 mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-300">System Status</h2>
            <p className="text-sm text-slate-500">
              {lastScan ? `Last scan completed at ${lastScan}` : "Awaiting initial scan..."}
            </p>
          </div>
          <Controls onRun={handleRun} isLoading={loading} />
        </div>

        {/* Error Display */}
        {error && (
          <div className="w-full mb-6 p-4 text-red-400 bg-red-950/30 border border-red-500/30 rounded-xl flex items-start gap-3">
            <span className="text-lg">⚠️</span>
            <div>
              <p className="font-bold text-sm">Scan Failed</p>
              <p className="text-xs opacity-80 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Simplified Table */}
        {data.length > 0 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h3 className="font-semibold text-slate-300">Latest Threat Alerts</h3>
              <button onClick={() => {setData([]); setLastScan(null)}} className="text-xs text-slate-500 hover:text-red-400">Clear Results</button>
            </div>
            <UserRiskTable data={data} />
          </div>
        )}

      </div>
    </main>
  );
}