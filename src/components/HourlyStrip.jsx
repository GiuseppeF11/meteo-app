import React from "react";
import { useCity } from "../contexts/CityContext";
import { getWeatherIcon, Drop } from "./WeatherIcons";

export default function HourlyStrip() {
  const { weatherData } = useCity();
  if (!weatherData) return null;

  // Ora corrente nella timezone della città
  const tzOffset = weatherData?.tzoffset ?? 0;
  const now = new Date();
  const cityDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + tzOffset * 3600000);
  const currentHour = cityDate.getHours();

  const todayHours    = weatherData.days[0]?.hours ?? [];
  const tomorrowHours = weatherData.days[1]?.hours ?? [];

  // Ore rimanenti di oggi dall'ora corrente + ore di domani fino a 24 totali
  const remaining = todayHours.filter(h => parseInt(h.datetime, 10) >= currentHour);
  const needed    = 24 - remaining.length;
  const hours     = [...remaining, ...tomorrowHours.slice(0, needed)];

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
