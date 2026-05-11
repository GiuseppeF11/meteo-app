import React, { useState } from "react";
import { useCity } from "../contexts/CityContext";
import { useLang } from "../contexts/LangContext";
import { getWeatherIcon, Drop } from "./WeatherIcons";
import DayModal from "./DayModal";
import { parseDateStr } from "../utils/weather";

export default function ForecastGrid() {
  const { weatherData } = useCity();
  const { t } = useLang();
  const [selectedDay, setSelectedDay] = useState(null);

  if (!weatherData) return null;

  const days = weatherData.days.slice(0, 5);

  return (
    <>
      <div className="forecast-grid fade-up-5">
        {days.map((day, i) => {
          const label = parseDateStr(day.datetime).toLocaleDateString(t("dateLocale"), { weekday: "short" });
          const min = Math.round(day.tempmin);
          const max = Math.round(day.tempmax);
          const icon = getWeatherIcon(day.conditions || "", true, {
            size: 36, color: "var(--accent)", strokeWidth: 1.5,
          });

          return (
            <div
              key={i}
              className="glass forecast-card"
              onClick={() => setSelectedDay(day)}
              style={{ cursor: "pointer" }}
              title="Clicca per i dettagli"
            >
              <span className="forecast-day-label">{label}</span>
              {icon}
              <span className="forecast-temps">{max}° / {min}°</span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 9,
                color: "var(--ink-2)", letterSpacing: "0.06em",
                display: "flex", alignItems: "center", gap: 3 }}>
                <Drop size={10} color="var(--accent)" strokeWidth={2} />
                {day.precipprob ?? 0}%
              </span>
            </div>
          );
        })}
      </div>

      {selectedDay && (
        <DayModal day={selectedDay} onClose={() => setSelectedDay(null)} />
      )}
    </>
  );
}
