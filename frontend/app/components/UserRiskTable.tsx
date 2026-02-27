"use client";

interface UserData {
  user_id: string;
  risk_score: number;
}

export default function UserRiskTable({ data }: { data: UserData[] }) {
  if (!data || data.length === 0) return null;

  const getRiskBadge = (score: number) => {
    const percent = score * 100;
    if (percent >= 45) return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30">🔴 HIGH</span>;
    if (percent >= 40) return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">🟡 MEDIUM</span>;
    return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">🟢 LOW</span>;
  };

  return (
    <div className="w-full bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-800/50 border-b border-slate-700 text-slate-400 uppercase tracking-wider text-xs">
          <tr>
            <th className="px-6 py-4 font-semibold">Alert Priority</th>
            <th className="px-6 py-4 font-semibold">Node ID</th>
            <th className="px-6 py-4 font-semibold text-right">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {data.map((row, index) => (
            <tr key={row.user_id} className="hover:bg-slate-800/40 transition-colors animate-[fadeIn_0.5s_ease-out_forwards]" style={{ animationDelay: `${index * 0.05}s`}}>
              <td className="px-6 py-4 text-slate-500 font-mono">#{index + 1}</td>
              <td className="px-6 py-4 text-slate-200 font-medium">{row.user_id}</td>
              <td className="px-6 py-4 text-right">{getRiskBadge(row.risk_score)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}