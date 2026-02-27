export async function runDetection() {
  const res = await fetch("/api/run-detection", {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
}