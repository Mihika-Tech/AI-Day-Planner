import type { Plan } from "../../../common/types";

export default function PlanView({ plan }: { plan: Plan }) {
  return (
    <div className="stack">
      <div className="card">
        <h3>{plan.date}</h3>
        <p>{plan.weatherBrief}</p>
      </div>

      {plan.outfit && (
        <div className="card">
          <h3>Outfit — {plan.outfit.title}</h3>
          <ul>
            {plan.outfit.items.map((it, i) => <li key={i}>{it}</li>)}
          </ul>
          {plan.outfit.tips && <p className="muted">{plan.outfit.tips}</p>}
        </div>
      )}

      {plan.activities && plan.activities.length > 0 && (
        <div className="card">
          <h3>Activities</h3>
          <ul>
            {plan.activities.map((a, i) => (
              <li key={i}>
                <strong>{a.title}</strong>
                {a.when ? ` — ${a.when}` : ""}
                {a.details ? `: ${a.details}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}

      {plan.meal && (
        <div className="card">
          <h3>Meal — {plan.meal.title}</h3>
          {plan.meal.recipeHint && <p>{plan.meal.recipeHint}</p>}
        </div>
      )}

      {plan.playlistMood && (
        <div className="card">
          <h3>Playlist mood</h3>
          <p>{plan.playlistMood}</p>
        </div>
      )}

      {plan.safetyNotes && plan.safetyNotes.length > 0 && (
        <div className="card">
          <h3>Notes</h3>
          <ul>
            {plan.safetyNotes.map((n, i) => <li key={i}>{n}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
