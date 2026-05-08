import React, { useState } from "react";
import { useCity } from "../contexts/CityContext";
import { useLang } from "../contexts/LangContext";
import { getWeatherIcon, Drop } from "./WeatherIcons";
import DayModal from "./DayModal";

function RangeBar({ min, max, absMin, absMax }) {
  const range = absMax - absMin || 1;
  const left  = ((min - absMin) / range) * 100;
  const width = ((max - min)  / range) * 100;
  return (
    <div className="forecast-range-bar" style={{ width: "100%" }}>
      <div className="forecast-range-fill" style={{ left: `${left}%`, width: `${width}%` }} />
    </div>
  );
}

export default function ForecastGrid() {
  const { weatherData } = useCity();
  const { t } = useLang();
  const [selectedDay, setSelectedDay] = useState(null);

  if (!weatherData) return null;

  const days = weatherData.days.slice(0, 5);
  const allMins = days.map((d) => Math.round(d.tempmin));
  const allMaxs = days.map((d) => Math.round(d.tempmax));
  const absMin = Math.min(...allMins);
  const absMax = Math.max(...allMaxs);

  return (
    <>
      <div className="forecast-grid fade-up-5">
        {days.map((day, i) => {
          // Parsing manuale: evita che YYYY-MM-DD venga letto come UTC midnight (bug iOS Safari)
          const [dy, dm, dd] = day.datetime.split("-").map(Number);
          const label = new Date(dy, dm - 1, dd).toLocaleDateString(t("dateLocale"), { weekday: "short" });
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
              <RangeBar min={min} max={max} absMin={absMin} absMax={absMax} />
              {/* Precip hint */}
              {day.precipprob > 20 && (
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 9,
                  color: "var(--ink-2)", letterSpacing: "0.06em",
                  display: "flex", alignItems: "center", gap: 3 }}>
                  <Drop size={10} color="var(--accent)" strokeWidth={2} />
                  {day.precipprob}%
                </span>
              )}
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
