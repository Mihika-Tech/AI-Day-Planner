import type { GeocodeResult, Plan, UserPrefs } from "../../common/types.js";

const BASE = ""; // same-origin; Vite proxy handles dev

export async function geocode(q: string): Promise<GeocodeResult[]> {
  const r = await fetch(`${BASE}/api/geocode?q=${encodeURIComponent(q)}`);
  if (!r.ok) throw new Error(`Geocode failed: ${r.status}`);
  const data = await r.json();
  return data.results as GeocodeResult[];
}

export async function generatePlan(
  lat: number,
  lon: number,
  prefs: UserPrefs
): Promise<Plan> {
  const r = await fetch(`${BASE}/api/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lon, prefs })
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(err.error || `Generate failed: ${r.status}`);
  }
  return (await r.json()) as Plan;
}
