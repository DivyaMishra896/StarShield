export async function runDetection() {
  const res = await fetch("/api/run-detection", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    // Try to parse JSON error from our API route
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body.error) message = body.error;
    } catch {
      // If JSON parsing fails, use raw text
      try {
        message = await res.text();
      } catch {
        // ignore
      }
    }
    throw new Error(message);
  }

  return res.json();
}