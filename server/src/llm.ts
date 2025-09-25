import { buildPrompt } from "./prompt.js";
import { Plan, UserPrefs } from "./types.js";

export async function generatePlan(weatherBrief: string, prefs: UserPrefs): Promise<Plan> {
  const key = process.env.OPENAI_API_KEY;
  const prompt = buildPrompt(weatherBrief, prefs);

  if (!key) {
    return {
      date: new Date().toISOString().slice(0, 10),
      weatherBrief,
      outfit: {
        title: "Breezy casual",
        items: ["Light jacket", "Cotton tee", "Jeans", "Sneakers"],
        tips: ["Carry a compact umbrella just in case."]
      },
      activities: [
        { title: "Coffee + reading at a cozy café", when: "Late morning", details: "Find a window seat; 60–90 min." },
        { title: "Golden-hour walk", when: "6–7pm", details: "Choose a loop; turn back if drizzle starts." }
      ],
      meal: { title: "Veg sandwich", recipeHint: "Onion, bell peppers, cilantro; 10–12 min." },
      playlistMood: "Lofi + mellow indie",
      safetyNotes: ["Wind may increase in the evening; secure loose layers."]
    };
  }

  const { OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey: key });

  const resp = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    temperature: 0.7
  });

  const txt = resp.choices[0]?.message?.content ?? "{}";
  return JSON.parse(txt);
}
