import { NextResponse } from "next/server";

export async function POST() {
  const res = await fetch("http://localhost:8000/run-detection", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  const data = await res.json();
  return NextResponse.json(data);
}