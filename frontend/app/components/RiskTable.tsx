"use client";

interface RiskTableProps {
  data: { user_id: string; risk_score: number }[];
}

export default function RiskTable({ data }: RiskTableProps) {
  if (!data || data.length === 0) return null;

  // Helper function to color-code the risk score badge
  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "bg-red-500/20 text-red-400 border-red-500/30";
    if (score >= 0.5) return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
  };

  return (
    <div className="w-full bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-800/80 border-b border-slate-700 text-slate-300 uppercase tracking-wider text-xs">
            <tr>
              <th className="px-6 py-4 font-semibold">Rank</th>
              <th className="px-6 py-4 font-semibold">User ID (Node)</th>
              <th className="px-6 py-4 font-semibold">Fusion Risk Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {data.map((row, index) => (
              <tr 
                key={row.user_id} 
                // Adds a slight staggered fade-in effect and a row hover highlight
                className="hover:bg-slate-800/40 transition-colors duration-200 animate-[fadeIn_0.5s_ease-out_forwards]"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="px-6 py-4 text-slate-500 font-mono">
                  #{index + 1}
                </td>
                <td className="px-6 py-4 text-slate-200 font-medium">
                  {row.user_id}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getScoreColor(row.risk_score)}`}>
                    {(row.risk_score * 100).toFixed(1)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}