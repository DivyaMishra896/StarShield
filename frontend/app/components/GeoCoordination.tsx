"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import ClientOnly from './ClientOnly';

const data = [
  { name: 'Asia', value: 400 }, { name: 'Europe', value: 300 }, { name: 'NA', value: 300 },
];
const COLORS = ['#6366f1', '#818cf8', '#4f46e5'];

export default function GeoCoordination() {
  return (
    <ClientOnly>
      <div className="h-[230px] bg-slate-900/40 border border-slate-800/50 rounded-2xl p-4">
        <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-4">5️⃣ Regional Clustering</h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
              {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ClientOnly>
  );
}