import { useState } from "react";

type Plan = {
  date: string;
  weatherBrief: string;
  outfit?: { title: string; items: string[]; tips?: string };
  activities?: { title: string; when?: string; details?: string }[];
  meal?: { title: string; recipeHint?: string };
  playlistMood?: string;
  safetyNotes?: string[];
};

export default function App() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(false);

  const prefs = {
    likes: ["coffee", "long walks"],
    diet: "veg",
    style: "casual",
    budget: "medium"
  };

  const getPlan = () => {
    navigator.geolocation.getCurrentPosition(async pos => {
      setLoading(true);
      const resp = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat: pos.coords.latitude, lon: pos.coords.longitude, prefs })
      });
      const data = await resp.json();
      setPlan(data);
      setLoading(false);
    });
  };

  return (
    <main style={{ maxWidth: 700, margin: "0 auto", padding: 20 }}>
      <h1>AI Weather Generator</h1>
      <button onClick={getPlan} disabled={loading}>
        {loading ? "Loading..." : "Generate Plan"}
      </button>

      {plan && (
        <div style={{ marginTop: 20 }}>
          <h2>{plan.date}</h2>
          <p>{plan.weatherBrief}</p>

          {plan.outfit && (
            <Card title={`Outfit — ${plan.outfit.title}`}>
              <ul>{plan.outfit.items.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
              {plan.outfit.tips && <em>{plan.outfit.tips}</em>}
            </Card>
          )}

          {plan.activities && (
            <Card title="Activities">
              <ul>
                {plan.activities.map((a, i) => (
                  <li key={i}>
                    <strong>{a.title}</strong> {a.when && `— ${a.when}`} {a.details && `: ${a.details}`}
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {plan.meal && (
            <Card title={`Meal — ${plan.meal.title}`}>
              {plan.meal.recipeHint && <p>{plan.meal.recipeHint}</p>}
            </Card>
          )}

          {plan.playlistMood && <Card title="Playlist">{plan.playlistMood}</Card>}
          {plan.safetyNotes && <Card title="Notes"><ul>{plan.safetyNotes.map((n,i)=><li key={i}>{n}</li>)}</ul></Card>}
        </div>
      )}
    </main>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid #444", borderRadius: 8, padding: 12, marginTop: 12 }}>
      <h3>{title}</h3>
      {children}
    </div>
  );
}
