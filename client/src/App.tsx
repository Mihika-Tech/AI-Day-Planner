import { useState } from "react";
import CitySearch from "./components/CitySearch";
import PrefsForm from "./components/PrefsForm";
import PlanView from "./components/PlanView";
import { generatePlan } from "./api";
import type { LocationChoice, Plan, UserPrefs } from "./../../common/types";

export default function App() {
  const [location, setLocation] = useState<LocationChoice | null>(null);
  const [prefs, setPrefs] = useState<UserPrefs>({ likes: ["coffee", "long walks"], diet: "veg", style: "casual", budget: "medium" });
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const generate = async () => {
    if (!location) {
      setErr("Pick a location first.");
      return;
    }
    try {
      setLoading(true);
      setErr(null);
      const p = await generatePlan(location.lat, location.lon, prefs);
      setPlan(p);
    } catch (e) {
      if (e instanceof Error) {
    setErr(e.message || "Failed to generate");
  } else {
    setErr("Failed to generate");
  }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <header>
        <h1>AI Weather + Preferences Generator ✨</h1>
        <p className="muted">Outfit • Activities • Meal • Playlist — cute plans for today’s weather</p>
      </header>

      <CitySearch onSelect={(loc) => { setLocation(loc); setPlan(null); }} />

      {location && (
        <div className="card">
          <span className="selected-pill">
            <strong>Selected:</strong> {location.label}
          </span>
          <span className="muted"> ({location.lat.toFixed(4)}, {location.lon.toFixed(4)})</span>
        </div>
      )}




      <PrefsForm value={prefs} onChange={setPrefs} />

      <div className="row">
        <button onClick={generate} disabled={loading || !location}>
          {loading ? "Generating…" : "Generate plan"}
        </button>
        {err && <span className="error">{err}</span>}
      </div>

      {plan && <PlanView plan={plan} />}
    </main>
  );
}
