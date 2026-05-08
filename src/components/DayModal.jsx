import React, { useEffect, useMemo } from "react";
import { useLang } from "../contexts/LangContext";
import { getWeatherIcon, Wind, Drop, UVIcon } from "./WeatherIcons";

const W = 700;
const H = 100;
const PAD_X = 20;
const PAD_TOP = 28;
const PAD_BOT = 22;

function catmullRomToBezier(points) {
  if (points.length < 2) return "";
  const d = [`M ${points[0].x} ${points[0].y}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;
    d.push(`C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`);
  }
  return d.join(" ");
}

function MiniChart({ hours }) {
  const points = useMemo(() => {
    if (!hours?.length) return [];
    const temps = hours.map((h) => Math.round(h.temp));
    const minT = Math.min(...temps);
    const maxT = Math.max(...temps);
    const range = maxT - minT || 1;
    const drawW = W - PAD_X * 2;
    const drawH = H - PAD_TOP - PAD_BOT;
    return hours.map((h, i) => ({
      x: PAD_X + (i / (hours.length - 1)) * drawW,
      y: PAD_TOP + drawH - ((Math.round(h.temp) - minT) / range) * drawH,
      t: Math.round(h.temp),
      label: h.datetime.slice(0, 5),
    }));
  }, [hours]);

  if (!points.length) return null;
  const curve = catmullRomToBezier(points);
  const area = `${curve} L ${points[points.length - 1].x} ${H - PAD_BOT} L ${points[0].x} ${H - PAD_BOT} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
      <defs>
        <linearGradient id="modal-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="var(--accent)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.00" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#modal-fill)" />
      <path d={curve} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
      {points.map((p, i) => i % 3 !== 0 ? null : (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill="var(--accent)" fillOpacity="0.8" />
          <text x={p.x} y={p.y - 9} textAnchor="middle"
            fill="var(--ink)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
            {p.t}°
          </text>
          <text x={p.x} y={H - 4} textAnchor="middle"
            fill="var(--ink-2)" fontSize="9" fontFamily="var(--font-mono)" letterSpacing="0.04em">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function MetricChip({ label, value, unit, icon }) {
  return (
    <div className="glass" style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: 4 }}>
      <span className="label-mono">{label}</span>
      <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 600,
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

  const dateLabel = new Date(day.datetime).toLocaleDateString(t("dateLocale"), {
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

        {/* Mini chart */}
        {day.hours?.length > 0 && (
          <div className="glass" style={{ padding: "14px 10px", marginBottom: 20 }}>
            <p className="label-mono" style={{ marginBottom: 8, paddingLeft: 10 }}>{t("modalTempTrend")}</p>
            <MiniChart hours={day.hours} />
          </div>
        )}

        {/* Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 20 }}>
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
