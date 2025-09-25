import { UserPrefs } from "./types.js";

export function buildPrompt(weatherBrief: string, prefs: UserPrefs) {
  return `
You are a helpful day-planner that tailors suggestions to WEATHER + USER PREFERENCES.

WEATHER:
${weatherBrief}

USER PREFERENCES:
${JSON.stringify(prefs ?? {}, null, 2)}

Return pure JSON with keys:
date, weatherBrief, outfit{title,items[],tips}, activities[{title,when,details}], meal{title,recipeHint}, playlistMood, safetyNotes[].

Rules:
- If high precipitation probability, bias indoor or add rain-ready alternatives.
- Outfit should match temperature, wind, and possible drizzle.
- Keep items realistic and easily available.
- Respect diet, dislikes, and gear availability.
- Be concise.
`;
}
