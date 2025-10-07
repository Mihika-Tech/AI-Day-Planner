import { Plan, UserPrefs } from "../../common/types";
import { buildPrompt } from "./prompt";

export async function generatePlan(weatherBrief: string, prefs: UserPrefs): Promise<Plan> {
  const key = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  const prompt = buildPrompt(weatherBrief, prefs);

  if (!key) {
    // No key -> simple fallback so UI still works
    return {
      date: new Date().toISOString().slice(0, 10),
      weatherBrief,
      outfit: { title: "Casual", items: ["T-shirt", "Jeans", "Sneakers"], tips: ["Carry an umbrella if it looks cloudy."] },
      activities: [
        { title: "Coffee shop + journaling", when: "Late morning", details: "Find a window seat; bring your notebook." }
      ],
      meal: { title: "Veg sandwich", recipeHint: "Tomato + cucumber + mint chutney." },
      playlistMood: "Lofi / indie",
      safetyNotes: ["Check rain chance again before heading out."]
    };
  }

  // Use OpenAI SDK
  const { OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey: key });

  const resp = await openai.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7
  });

  const content = resp.choices?.[0]?.message?.content ?? "{}";
  const plan = JSON.parse(content) as Plan;

  // Ensure weatherBrief is included even if model omitted it
  if (!plan.weatherBrief) plan.weatherBrief = weatherBrief;
  if (!plan.date) plan.date = new Date().toISOString().slice(0, 10);

  return plan;
}
