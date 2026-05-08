import React from "react";
import { useCity } from "../contexts/CityContext";
import { getWeatherIcon, Drop } from "./WeatherIcons";

export default function HourlyStrip() {
  const { weatherData } = useCity();
  if (!weatherData) return null;

  const hours = weatherData.days[0]?.hours ?? [];
  if (!hours.length) return null;

  return (
    <div className="hourly-strip">
      {hours.map((h, i) => {
        const hourNum = parseInt(h.datetime, 10);
        const isDay = hourNum >= 6 && hourNum < 20;
        const icon = getWeatherIcon(h.conditions || "", isDay, {
          size: 20, color: "var(--accent)", strokeWidth: 1.6,
        });
        return (
          <div key={i} className="glass hourly-card">
            <span className="hourly-time">{h.datetime.slice(0, 5)}</span>
            {icon}
            <span className="hourly-temp">{Math.round(h.temp)}°</span>
            <span className="hourly-rain">
              <Drop size={9} color="var(--accent)" strokeWidth={2} />
              {h.precipprob ?? 0}%
            </span>
          </div>
        );
      })}
    </div>
  );
}
