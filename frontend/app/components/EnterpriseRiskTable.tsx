"use client";
import React, { useState } from "react";

interface UserData {
  user_id: string;
  risk_score: number;
  reasons?: {
    semantic: string;
    behavioral: string;
    graph_centrality: string;
    event_safety: string;
  };
}

export default function EnterpriseRiskTable({ data }: { data: UserData[] }) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  if (!data || data.length === 0) return null;

  const getRiskBadge = (score: number) => {
    const percent = score * 100;
    if (percent >= 45) return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">🔴 HIGH</span>;
    if (percent >= 40) return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">🟡 MEDIUM</span>;
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">🟢 LOW</span>;
  };

  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800/80 border-b border-slate-700 text-slate-300 uppercase tracking-wider text-xs">
          <tr>
            <th className="px-6 py-4 font-semibold">Rank</th>
            <th className="px-6 py-4 font-semibold">User ID (Node)</th>
            <th className="px-6 py-4 font-semibold">Fusion Risk</th>
            <th className="px-6 py-4 font-semibold text-right">Severity</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {data.map((row, index) => (
            <React.Fragment key={row.user_id}>
              {/* Main Row */}
              <tr 
                onClick={() => setExpandedRow(expandedRow === row.user_id ? null : row.user_id)}
                className="hover:bg-slate-800/60 transition-colors duration-200 cursor-pointer animate-[fadeIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="px-6 py-4 text-slate-500 font-mono">#{index + 1}</td>
                <td className="px-6 py-4 text-slate-200 font-medium flex items-center gap-2">
                  {row.user_id}
                  <svg className={`w-4 h-4 text-slate-400 transition-transform ${expandedRow === row.user_id ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </td>
                <td className="px-6 py-4 text-slate-300 font-mono">{(row.risk_score * 100).toFixed(1)}%</td>
                <td className="px-6 py-4 text-right">{getRiskBadge(row.risk_score)}</td>
              </tr>

              {/* Explainable AI Expandable Row */}
              {expandedRow === row.user_id && row.reasons && (
                <tr className="bg-slate-950/50 border-none">
                  <td colSpan={4} className="px-6 py-4">
                    <div className="p-4 rounded-lg bg-slate-900 border border-slate-700/50 grid grid-cols-2 md:grid-cols-4 gap-4 animate-[fadeIn_0.2s_ease-out]">
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Semantic Similarity</p>
                        <p className="font-semibold text-slate-200">{row.reasons.semantic}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Behavioral Anomaly</p>
                        <p className="font-semibold text-slate-200">{row.reasons.behavioral}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Graph Centrality</p>
                        <p className="font-semibold text-indigo-400">{row.reasons.graph_centrality}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase">Event Burst Safety</p>
                        <p className="font-semibold text-emerald-400">{row.reasons.event_safety}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}