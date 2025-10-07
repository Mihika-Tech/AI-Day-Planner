import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import { getWeather } from "./weather";
import { geocodeCity } from "./geocode";
import { generatePlan } from "./llm";
import { UserPrefs } from "../../common/types";
import { error } from "console";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const WeatherBody = z.object({
    lat: z.number(),
    lon: z.number(),
    prefs: z.any().optional()
});

app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: Date.now() });
});

app.get("/api/geocode", async (req, res) => {
    try {
        const q = String(req.query.q || "");
        if (!q) return res.status(400).json({ error: "Missing ?q=" });
        const results = await geocodeCity(q);
        res.json({ results });
    } catch (e: any) {
        res.status(500).json({ error: e.message || "Geocode Failed "});
    }
});

app.post("/api/generate", async (req, res) => {
    try {
        const { lat, lon, prefs } = WeatherBody.parse(req.body);
        const { weatherBrief, localDate } = await getWeather(lat, lon);
        const plan = await generatePlan(weatherBrief, prefs || {});
        plan.date = localDate;
        res.json(plan);
    } catch (e: any) {
        console.error(e);
        res.status(400).json({ error: e.message || "Generate Failed" });
    } 
});

const clientDist = path.join(__dirname, "../client_dist");

if (process.env.NODE_ENV === "production") {
    app.use(express.static(clientDist));
    app.get("*", (_req, res) => {
        res.sendFile(path.join(clientDist, "index.html"));
    });
}

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => {
    console.log(`Server on http:localhost:${PORT}`);
});