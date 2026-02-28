import { NextResponse } from "next/server";

export const maxDuration = 60; // Allow up to 60s for Render cold starts

export async function POST() {
  // Use BACKEND_URL (server-side only) — set this in Vercel Environment Variables
  const backendUrl = (
    process.env.BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "https://starshield.onrender.com"
  ).replace(/\/+$/, ""); // strip trailing slash

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 55000); // 55s timeout for Render cold starts

    const res = await fetch(`${backendUrl}/run-detection`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Backend error ${res.status}: ${errorText}`);
      return NextResponse.json(
        { error: `Backend returned ${res.status}: ${errorText}` },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Failed to reach backend:", message);

    if (message.includes("abort")) {
      return NextResponse.json(
        { error: "Backend request timed out. Render free-tier may be cold-starting — please try again in 30s." },
        { status: 504 }
      );
    }

    return NextResponse.json(
      { error: `Failed to connect to backend at ${backendUrl}: ${message}` },
      { status: 502 }
    );
  }
}
