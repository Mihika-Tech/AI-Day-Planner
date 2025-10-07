// No import of node-fetch needed

export async function geocodeCity(q: string) {
  // Nominatim (no key). For demo/light usage only.
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("format", "json");
  url.searchParams.set("q", q);
  url.searchParams.set("limit", "5");
  // Add basic identification header (polite)
  const resp = await fetch(url.toString(), {
    headers: { "User-Agent": "ai-weather-gen/1.0 (demo)" }
  });
  const data = (await resp.json()) as Array<{ lat: string; lon: string; display_name: string }>;
  return data.map(d => ({
    lat: parseFloat(d.lat),
    lon: parseFloat(d.lon),
    label: d.display_name
  }));
}
