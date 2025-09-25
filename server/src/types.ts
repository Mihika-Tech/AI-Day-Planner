export type UserPrefs = {
    likes?: string[];
    dislikes?: string[];
    diet?: "veg" | "non-veg" | "vegan" | "egg" | "custom";
    budget?: "low" | "medium" | "high";
    style?: "casual" | "sporty" | "formal" | "party" | "semi-formal";
    gear?: string[];
};

export type Plan = {
    date: string;
    weatherBrief: string;
    outfit: { title: string; items: string[]; tips?: string[] };
    activities: { title: string; when?: string; details?: string }[];
    meal?: { title: string; recipeHint?: string };
    playlistMood?: string;
    safetyNotes?: string[];
};