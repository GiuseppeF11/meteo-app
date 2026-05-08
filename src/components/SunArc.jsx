import React, { useMemo } from "react";
import { useCity } from "../contexts/CityContext";
import { useLang } from "../contexts/LangContext";

function timeStrToMinutes(str) {
  if (!str) return 0;
  const [h, m] = str.split(":").map(Number);
  return h * 60 + (m || 0);
}

// Computes the position of the sun on the quadratic bezier arc using De Casteljau split.
// The bezier: M(cx-rx, baseY) Q(cx, baseY-ry) (cx+rx, baseY)
// At parameter p: x = cx + rx*(2p-1), y = baseY - 2*ry*p*(1-p)
// Control point of the split sub-curve: cp1 = lerp(P0, P1, p)
function posOnArc(t, tRise, tSet, W = 320, H = 90) {
  const progress = Math.max(0, Math.min(1, (t - tRise) / (tSet - tRise)));
  const cx = W / 2;
  const baseY = H - 14;
  const rx = (W - 40) / 2;
  const ry = H - 20;
  const p = progress;
  return {
    x: cx + rx * (2 * p - 1),
    y: baseY - 2 * ry * p * (1 - p),
    cp1x: cx - rx + p * rx,
    cp1y: baseY - p * ry,
    progress,
  };
}

export default function SunArc() {
  const { weatherData } = useCity();
  const { t } = useLang();
  if (!weatherData) return null;

  const day = weatherData.days[0];
  const sunrise = day?.sunrise || "06:00:00";
  const sunset  = day?.sunset  || "20:00:00";

  const now = new Date();
  const tzOffset = weatherData?.tzoffset ?? 0;
  const cityDate = new Date(now.getTime() + now.getTimezoneOffset() * 60000 + tzOffset * 3600000);
  const nowMin = cityDate.getHours() * 60 + cityDate.getMinutes();
  const riseMin = timeStrToMinutes(sunrise);
  const setMin  = timeStrToMinutes(sunset);

  const W = 320;
  const H = 90;
  const cx = W / 2;
  const baseY = H - 14;
  const rx = (W - 40) / 2;
  const ry = H - 20;

  const arcPath = `M ${cx - rx} ${baseY} Q ${cx} ${baseY - ry} ${cx + rx} ${baseY}`;

  const sun = useMemo(
    () => posOnArc(nowMin, riseMin, setMin, W, H),
    [nowMin, riseMin, setMin]
  );

  const fmt = (str) => str?.slice(0, 5) || "--:--";

  return (
    <div className="glass sun-arc-card">
      <p className="label-mono sun-arc-title">{t("sunArcTitle")}</p>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", display: "block" }}>
        {/* Track */}
        <path d={arcPath} fill="none"
          stroke="var(--accent-soft)" strokeWidth="2" strokeLinecap="round" />

        {/* Progress */}
        {sun.progress > 0 && sun.progress < 1 && (
          <>
            <path
              d={`M ${cx - rx} ${baseY} Q ${sun.cp1x} ${sun.cp1y} ${sun.x} ${sun.y}`}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Sun dot */}
            <circle cx={sun.x} cy={sun.y} r="8"
              fill="var(--accent)" fillOpacity="0.25" />
            <circle cx={sun.x} cy={sun.y} r="5"
              fill="var(--accent)" />
          </>
        )}

        {/* Horizon line */}
        <line x1={cx - rx - 8} y1={baseY} x2={cx + rx + 8} y2={baseY}
          stroke="var(--card-stroke)" strokeWidth="1" />

        {/* Labels */}
        <text x={cx - rx} y={baseY + 14} textAnchor="middle"
          fill="var(--ink-2)" fontSize="10" fontFamily="var(--font-mono)"
          letterSpacing="0.06em">
          {fmt(sunrise)}
        </text>
        <text x={cx + rx} y={baseY + 14} textAnchor="middle"
          fill="var(--ink-2)" fontSize="10" fontFamily="var(--font-mono)"
          letterSpacing="0.06em">
          {fmt(sunset)}
        </text>
      </svg>
    </div>
  );
}
