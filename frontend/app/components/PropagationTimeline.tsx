"use client";
import { AreaChart, Area, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import ClientOnly from './ClientOnly';

const data = [
  { t: 0, r: 10 }, { t: 10, r: 150 }, { t: 20, r: 800 }, { t: 30, r: 4500 }, { t: 40, r: 12000 }
];

export default function PropagationTimeline() {
  return (
    <ClientOnly>
      <div className="h-[230px] bg-slate-900/40 border border-slate-800/50 rounded-2xl p-4">
        <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4">3️⃣ Influence Velocity</h4>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorR" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="t" hide />
            <YAxis hide />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none' }} />
            <Area type="monotone" dataKey="r" stroke="#ef4444" fillOpacity={1} fill="url(#colorR)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ClientOnly>
  );
}