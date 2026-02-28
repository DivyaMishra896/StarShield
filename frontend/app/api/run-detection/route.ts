import { NextResponse } from "next/server";

export async function POST() {
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

const res = await fetch('${backendUrl}/run-detection', {
method: "POST",
headers: {
"Content-Type": "application/json",
"ngrok-skip-browser-warning": "true"
},
});

const data = await res.json();
return NextResponse.json(data);
}
