export async function runDetection() {
  const res = await fetch("http://localhost:8000/run-detection", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
});

  if (!res.ok) {
    const text = await res.text();
    throw new Error("Backend error: " + text);
  }

  const data = await res.json();
  return data;
}