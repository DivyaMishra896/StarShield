"use client";
import { useState } from "react";
import { runDetection } from "../lib/api";
import Controls from "./components/Controls";
import RiskTable from "./components/RiskTable";

export default function Home() {
  const [data, setData] = useState<
    { user_id: string; risk_score: number }[]
  >([]);
  const [loading, setLoading] = useState(false);

  async function handleRun() {
    setLoading(true);
    try {
      const res = await runDetection();
      setData(res.top_suspicious_users);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">🛡 StarShield AI Dashboard</h1>
      <Controls onRun={handleRun} loading={loading} />
      {loading && <p className="mt-2 text-gray-500">Analyzing data…</p>}
      <RiskTable data={data} />
    </main>
  );
}