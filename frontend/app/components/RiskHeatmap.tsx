"use client";
import { BarChart, Bar, ResponsiveContainer, Cell, XAxis, Tooltip } from 'recharts';
import ClientOnly from './ClientOnly';

const data = [
  { time: '08:00', risk: 30 }, { time: '12:00', risk: 85 }, { time: '16:00', risk: 45 },
  { time: '20:00', risk: 95 }, { time: '00:00', risk: 20 },
];

export default function RiskHeatmap() {
  return (
    <ClientOnly>
      <div className="h-[230px] bg-slate-900/40 border border-slate-800/50 rounded-2xl p-4">
        <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4">2️⃣ Attack Wave Heatmap</h4>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="time" hide />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
            <Bar dataKey="risk" radius={[4, 4, 0, 0]}>
              {data.map((entry, i) => <Cell key={i} fill={entry.risk > 70 ? '#ef4444' : '#6366f1'} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ClientOnly>
  );
}