import { NextResponse } from "next/server";

export async function POST() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://starshield.onrender.com";

  const res = await fetch(`${backendUrl}/run-detection`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
  });

  const data = await res.json();
  return NextResponse.json(data);
}
