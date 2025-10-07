// server/src/weather.ts
// (uses global fetch)

export async function getWeather(lat: number, lon: number) {
  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(lat));
  url.searchParams.set("longitude", String(lon));
  url.searchParams.set("current", "temperature_2m,apparent_temperature,precipitation,wind_speed_10m");
  url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_probability_max");
  url.searchParams.set("timezone", "auto");

  const wx = await fetch(url.toString()).then(r => r.json());
  const current = (wx as any).current ?? {};
  const daily = (wx as any).daily ?? {};
  const timezone: string = (wx as any).timezone || "UTC";

  // Local date in the location’s timezone (YYYY-MM-DD)
  const localDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date()); // en-CA gives YYYY-MM-DD

  const weatherBrief = `Now ${current.temperature_2m}°C (feels ${current.apparent_temperature}°C).
High ${daily.temperature_2m_max?.[0]}°C / Low ${daily.temperature_2m_min?.[0]}°C.
Rain chance ${daily.precipitation_probability_max?.[0]}%.`;

  // return timezone + localDate so the API can stamp the plan correctly
  return { weatherBrief, wx, timezone, localDate };
}
