import React, { useEffect } from "react";
import { useLang } from "../contexts/LangContext";
import { getWeatherIcon, Wind, Drop, UVIcon } from "./WeatherIcons";

function MetricChip({ label, value, unit, icon }) {
  return (
    <div className="glass" style={{
      padding: "10px 10px", display: "flex", flexDirection: "column", gap: 3,
      minWidth: 0, overflow: "hidden",
    }}>
      <span className="label-mono" style={{ fontSize: 9, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-display)", fontSize: "clamp(15px, 4vw, 20px)", fontWeight: 600,
        color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1 }}>
        {value}
        <span style={{ fontSize: "0.6em", color: "var(--ink-2)", marginLeft: 2 }}>{unit}</span>
      </span>
      {icon}
    </div>
  );
}

export default function DayModal({ day, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const { t } = useLang();

  if (!day) return null;

  const [dmy, dmm, dmd] = day.datetime.split("-").map(Number);
  const dateLabel = new Date(dmy, dmm - 1, dmd).toLocaleDateString(t("dateLocale"), {
    weekday: "long", day: "2-digit", month: "long",
  });

  const icon = getWeatherIcon(day.conditions || "", true, {
    size: 56, color: "var(--accent)", strokeWidth: 1.4,
  });

  // Hourly breakdown: every 3h
  const hourlySlots = day.hours ?? [];

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,.45)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "16px",
        animation: "fade-in .25s ease both",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="glass"
        style={{
          width: "100%", maxWidth: 600, maxHeight: "90vh",
          overflowY: "auto", borderRadius: 24,
          padding: "28px 28px 32px",
          animation: "fade-up .3s cubic-bezier(.2,.7,.2,1) both",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <p className="label-mono" style={{ marginBottom: 4 }}>{dateLabel}</p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 28, fontWeight: 700,
              color: "var(--ink)", margin: 0, letterSpacing: "-0.03em" }}>
              {day.conditions}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Chiudi"
            style={{ background: "transparent", border: "none", cursor: "pointer",
              color: "var(--ink-2)", fontSize: 22, lineHeight: 1, padding: 4,
              borderRadius: "50%", width: 36, height: 36, display: "flex",
              alignItems: "center", justifyContent: "center" }}
          >
            ×
          </button>
        </div>

        {/* Hero temp + icon */}
        <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
          {icon}
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontSize: 64, fontWeight: 300,
              color: "var(--accent)", lineHeight: 1, letterSpacing: "-0.04em" }}>
              {Math.round(day.tempmax)}°
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--ink-2)",
              letterSpacing: "0.06em", marginTop: 2 }}>
              ↓ {Math.round(day.tempmin)}° &nbsp; ↑ {Math.round(day.tempmax)}°
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginBottom: 20 }}>
          <MetricChip label={t("metricWind")}       value={Math.round(day.windspeed ?? 0)} unit="km/h" icon={<Wind  size={18} color="var(--accent)" />} />
          <MetricChip label={t("metricHumidity")}   value={Math.round(day.humidity ?? 0)}  unit="%"    icon={<Drop  size={18} color="var(--accent)" />} />
          <MetricChip label={t("metricRain")}       value={day.precipprob ?? 0}             unit="%"    icon={<Drop  size={18} color="var(--accent)" />} />
          <MetricChip label={t("metricUV")}         value={day.uvindex ?? 0}                unit=""     icon={<UVIcon size={18} color="var(--accent)" />} />
          <MetricChip label={t("metricPressure")}   value={Math.round(day.pressure ?? 0)}  unit="hPa"  icon={<Wind  size={18} color="var(--accent)" />} />
          <MetricChip label={t("metricVisibility")} value={day.visibility ?? 0}             unit="km"   icon={<UVIcon size={18} color="var(--accent)" />} />
        </div>

        {/* Hourly slots */}
        {hourlySlots.length > 0 && (
          <div>
            <p className="label-mono" style={{ marginBottom: 10 }}>{t("modalHourly")}</p>
            <div style={{
              display: "flex", gap: 8,
              overflowX: "auto", scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
              scrollbarWidth: "none", msOverflowStyle: "none",
              paddingBottom: 2,
            }}>
              {hourlySlots.map((h, i) => {
                const hIcon = getWeatherIcon(h.conditions || "", parseInt(h.datetime) >= 6 && parseInt(h.datetime) < 20, {
                  size: 20, color: "var(--accent)", strokeWidth: 1.6,
                });
                return (
                  <div key={i} className="glass" style={{
                    flex: "0 0 68px", scrollSnapAlign: "start",
                    padding: "10px 6px", display: "flex",
                    flexDirection: "column", alignItems: "center", gap: 5,
                    borderRadius: 14,
                  }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 9,
                      color: "var(--ink-2)", letterSpacing: "0.06em" }}>
                      {h.datetime.slice(0, 5)}
                    </span>
                    {hIcon}
                    <span style={{ fontFamily: "var(--font-display)", fontSize: 15,
                      fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.02em" }}>
                      {Math.round(h.temp)}°
                    </span>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 8,
                      color: "var(--ink-2)", letterSpacing: "0.04em", display: "flex",
                      alignItems: "center", gap: 2 }}>
                      <Drop size={9} color="var(--accent)" strokeWidth={2} />
                      {h.precipprob ?? 0}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
