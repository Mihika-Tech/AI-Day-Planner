import { useState } from "react";
import { geocode } from "../api";
import type { LocationChoice } from "../../../common/types";

type Props = {
  onSelect: (loc: LocationChoice) => void;
};

export default function CitySearch({ onSelect }: Props) {
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LocationChoice[]>([]);
  const [error, setError] = useState<string | null>(null);

  const search = async () => {
    if (!q.trim()) return;
    try {
      setLoading(true);
      setError(null);
      const found = await geocode(q.trim());
      setResults(found.map(f => ({ ...f, source: "geocode" })));
    } catch (e: unknown) {
      if (typeof e === "object" && e !== null && "message" in e && typeof (e as { message?: unknown }).message === "string") {
        setError((e as { message: string }).message);
      } else {
        setError("Search failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const useMyLocation = () => {
    setError(null);
    navigator.geolocation.getCurrentPosition(
      pos => {
        onSelect({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
          label: "My location",
          source: "geo"
        });
      },
      err => setError(err.message || "Location blocked")
    );
  };

  return (
    <div className="card">
      <h3>Pick a location</h3>
      <div className="row">
        <input
          placeholder="City, address, landmark…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && search()}
        />
        <button onClick={search} disabled={loading}>{loading ? "Searching…" : "Search"}</button>
        <button onClick={useMyLocation}>Use my location</button>
      </div>

      {error && <p className="error">{error}</p>}

      {results.length > 0 && (
        <ul className="list">
          {results.map((r, i) => (
            <li key={i}>
              <button className="link" onClick={() => onSelect(r)}>
                {r.label}
              </button>
              <span className="muted"> — {r.lat.toFixed(4)}, {r.lon.toFixed(4)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
