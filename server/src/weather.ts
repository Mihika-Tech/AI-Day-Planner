import fetch from "node-fetch";

type WeatherApiResponse = {
    daily?: any;
    current?: any;
    [key: string]: any;
};

export async function getWeather(lat: number, lon: number) {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", String(lat));
    url.searchParams.set("longitude", String(lon));
    url.searchParams.set("current", "temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m");
    url.searchParams.set("hourly", "tempperature_2m,precipitation_probability,wind_speed_10m");
    url.searchParams.set("daily", "temperature_2m_max,temperature_2m_min,precipitation_probability_max");
    url.searchParams.set("timezone", "auto");

    const wx: WeatherApiResponse = await fetch(url.toString()).then(r => r.json() as WeatherApiResponse);
    const daily = wx?.daily ?? {};
    const current = wx?.current ?? {};

    const weatherBrief = `Now ${current.temperature_2m}°C (feels ${current.apparent_temperature}°C).
High ${daily.temperature_2m_max?.[0]}°C / Low ${daily.temperature_2m_min?.[0]}°C.
Rain chance ${daily.precipitation_probability_max?.[0]}%.`;

    return { weatherBrief, wx };
}