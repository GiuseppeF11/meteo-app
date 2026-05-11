import React from "react";
import { useCity } from "../contexts/CityContext";
import { useLang } from "../contexts/LangContext";
import { Wind, Drop, UVIcon } from "./WeatherIcons";
import { getCityDate, findHourlyData } from "../utils/weather";

const METRICS = [
  { key: "windspeed",  labelKey: "metricWind",       unit: "km/h", icon: (s) => <Wind  size={s} color="var(--accent)" /> },
  { key: "humidity",   labelKey: "metricHumidity",    unit: "%",    icon: (s) => <Drop  size={s} color="var(--accent)" /> },
  { key: "uvindex",    labelKey: "metricUV",          unit: "",     icon: (s) => <UVIcon size={s} color="var(--accent)" /> },
  { key: "feelslike",  labelKey: "metricFeelsLike",   unit: "°C",   icon: (s) => <Drop  size={s} color="var(--accent)" />, format: (v) => `${Math.round(v)}` },
  { key: "pressure",   labelKey: "metricPressure",    unit: "hPa",  icon: (s) => <Wind  size={s} color="var(--accent)" /> },
  { key: "visibility", labelKey: "metricVisibility",  unit: "km",   icon: (s) => <UVIcon size={s} color="var(--accent)" /> },
];

export default function MetricsGrid() {
  const { weatherData, selectedHour } = useCity();
  const { t } = useLang();
  if (!weatherData) return null;

  const hourToUse =
    selectedHour ||
    getCityDate(weatherData.tzoffset ?? 0).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });

  const data = findHourlyData(weatherData, hourToUse);

  return (
    <div className="metrics-grid fade-up-2">
      {METRICS.map(({ key, labelKey, unit, icon, format }) => {
        const label = t(labelKey);
        const raw = data?.[key];
        if (raw === undefined || raw === null) return null;
        const value = format ? format(raw) : Math.round(raw * 10) / 10;
        return (
          <div key={key} className="glass metric-tile">
            <span className="label-mono">{label}</span>
            <div className="metric-value">
              {value}
              <span style={{ fontSize: "0.55em", color: "var(--ink-2)", marginLeft: 2 }}>
                {unit}
              </span>
            </div>
            {icon(20)}
          </div>
        );
      })}
    </div>
  );
}
