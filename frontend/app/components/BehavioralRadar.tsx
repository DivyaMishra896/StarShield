"use client";
import React, { useMemo } from 'react';
import {
  Radar, RadarChart, PolarGrid, 
  PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer
} from 'recharts';

export default function BehavioralRadar({ userData }: { userData: any }) {
  // We map the raw risk scores to 0-100 scale for the Radar
  const data = useMemo(() => [
    { subject: 'Consistency', A: (userData.reasons?.behavioral === 'High' ? 95 : 40) },
    { subject: 'Similarity', A: (userData.reasons?.semantic === 'High' ? 90 : 35) },
    { subject: 'Centrality', A: (userData.reasons?.graph_centrality === 'Very High' ? 98 : 50) },
    { subject: 'Frequency', A: 85 },
    { subject: 'Timing', A: 80 },
  ], [userData]);

  return (
    <div className="w-full h-[250px] bg-slate-900/40 rounded-xl p-2 border border-slate-800/50">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <Radar
            name="Risk Profile"
            dataKey="A"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}