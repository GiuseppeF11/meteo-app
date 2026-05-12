import React, { useState, useEffect } from "react";
import { useCity } from "../contexts/CityContext";
import { useLang } from "../contexts/LangContext";
import { getWeatherIcon } from "./WeatherIcons";
import { getCityDate, isDaytime, findHourlyData } from "../utils/weather";

function useNow() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export default function HeroSection() {
  const { city, weatherData, selectedHour } = useCity();
  const { t } = useLang();
  const now = useNow();

  if (!weatherData) return null;

  const cityDate = getCityDate(weatherData.tzoffset ?? 0);
  const hourStr =
    selectedHour ||
    cityDate.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });

  const data = findHourlyData(weatherData, hourStr);

  const conditions = data?.conditions || "";
  const temp = Math.round(data?.temp ?? 0);

  const dayMin = Math.round(weatherData.days[0]?.tempmin ?? 0);
  const dayMax = Math.round(weatherData.days[0]?.tempmax ?? 0);

  // Usiamo weatherData.address (risposta API) invece dello state `city`:
  // weatherData si aggiorna SOLO su fetch riuscito, quindi il nome rimane
  // quello dell'ultima città valida anche se l'utente ha cercato qualcosa
  // che non esiste. "Roma, Italia" → split → "Roma".
  const cityDisplay = (weatherData.address ?? city).split(",")[0].trim();

  const hour = parseInt(hourStr.split(":")[0], 10);
  const isDay = isDaytime(hour);

  const dateStr = now.toLocaleDateString(t("dateLocale"), {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <div className="hero-left fade-up-1">
      <p className="label-mono hero-datetime" style={{ marginBottom: 4 }}>
        {dateStr} &nbsp;·&nbsp;{hourStr}
      </p>

      {/* Desktop only: city name above the icon+temp row */}
      <h1 className="hero-city hero-city--desktop">{cityDisplay}</h1>

      {/* Main row: mobile = icon+city+temp | desktop = icon+temp */}
      <div className="hero-main-row">
        <div className="hero-icon">
          {getWeatherIcon(conditions, isDay, {
            size: 80,
            color: "var(--accent)",
            strokeWidth: 1.4,
          })}
        </div>
        {/* Mobile only: city inside the row */}
        <h1 className="hero-city hero-city--mobile">{cityDisplay}</h1>
        <p className="hero-temp">{temp}°</p>
      </div>

      <p className="hero-condition">{conditions}</p>
      <div className="hero-minmax">
        <span>↓ {dayMin}°</span>
        <span>↑ {dayMax}°</span>
      </div>
    </div>
  );
}
