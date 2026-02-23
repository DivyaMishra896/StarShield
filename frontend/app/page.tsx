"use client";
import { useState } from "react";
import { runDetection } from "../lib/api";
import Controls from "./components/Controls";
import RiskTable from "./components/RiskTable";

export default function Home() {
  const [data, setData] = useState<
    { user_id: string; risk_score: number }[]
  >([]);

  async function handleRun() {
    const res = await runDetection();
    setData(res.top_suspicious_users);
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">🛡 StarShield AI Dashboard</h1>
      <Controls onRun={handleRun} />
      <RiskTable data={data} />
    </main>
  );
}