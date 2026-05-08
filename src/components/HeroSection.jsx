import React, { useState, useEffect } from "react";
import { useCity } from "../contexts/CityContext";
import { useLang } from "../contexts/LangContext";
import { getWeatherIcon } from "./WeatherIcons";

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

  const tzOffset = weatherData?.tzoffset ?? 0;
  const cityDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + tzOffset * 3600000);
  const hourStr =
    selectedHour ||
    cityDate.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });

  const data =
    weatherData.days[0]?.hours?.find((h) => h.datetime.includes(hourStr)) ||
    weatherData.currentConditions;

  const conditions = data?.conditions || "";
  const temp = Math.round(data?.temp ?? 0);

  const dayMin = Math.round(weatherData.days[0]?.tempmin ?? 0);
  const dayMax = Math.round(weatherData.days[0]?.tempmax ?? 0);

  const hour = parseInt(hourStr.split(":")[0], 10);
  const isDay = hour >= 6 && hour < 20;

  const dateStr = now.toLocaleDateString(t("dateLocale"), {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });

  return (
    <div className="hero-left fade-up-1">
      <p className="label-mono" style={{ marginBottom: 4 }}>
        {dateStr} &nbsp;·&nbsp;{hourStr}
      </p>

      <h1 className="hero-city">{city}</h1>

      <p className="hero-temp">{temp}°</p>

      <div className="hero-icon">
        {getWeatherIcon(conditions, isDay, {
          size: 80,
          color: "var(--accent)",
          strokeWidth: 1.4,
        })}
      </div>

      <p className="hero-condition">{conditions}</p>

      <div className="hero-minmax">
        <span>↓ {dayMin}°</span>
        <span>↑ {dayMax}°</span>
      </div>
    </div>
  );
}
