import React, { useMemo } from "react";
import { useCity } from "../contexts/CityContext";

const W = 1200;
const H = 180;
const PAD_X = 30;
const PAD_TOP = 36;   // space above curve for temp labels
const PAD_BOT = 28;   // space below curve for time labels

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

export default function Chart() {
  const { weatherData } = useCity();

  const { points, peakIdx } = useMemo(() => {
    const hours = weatherData?.days?.[0]?.hours ?? [];
    if (!hours.length) return { points: [], peakIdx: 0 };

    const temps = hours.map((h) => Math.round(h.temp));
    const minT = Math.min(...temps);
    const maxT = Math.max(...temps);
    const range = maxT - minT || 1;

    const drawW = W - PAD_X * 2;
    const drawH = H - PAD_TOP - PAD_BOT;

    const pts = hours.map((h, i) => ({
      x: PAD_X + (i / (hours.length - 1)) * drawW,
      y: PAD_TOP + drawH - ((Math.round(h.temp) - minT) / range) * drawH,
      t: Math.round(h.temp),
      label: h.datetime.slice(0, 5),
    }));

    return { points: pts, peakIdx: temps.indexOf(maxT) };
  }, [weatherData]);

  if (!points.length) return null;

  const curvePath = catmullRomToBezier(points);
  const areaPath = `${curvePath} L ${points[points.length - 1].x} ${H - PAD_BOT} L ${points[0].x} ${H - PAD_BOT} Z`;

  // Show label every 3 hours
  const STEP = 3;

  return (
    <div style={{ overflowX: "auto" }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: "100%", minWidth: 340, display: "block" }}
      >
        <defs>
          <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--accent)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <path d={areaPath} fill="url(#chart-fill)" />

        {/* Curve */}
        <path d={curvePath} fill="none" stroke="var(--accent)"
          strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />

        {/* Peak marker */}
        {peakIdx >= 0 && (
          <g>
            <circle cx={points[peakIdx].x} cy={points[peakIdx].y} r="9"
              fill="var(--accent)" fillOpacity="0.18" />
            <circle cx={points[peakIdx].x} cy={points[peakIdx].y} r="4.5"
              fill="var(--accent)" />
          </g>
        )}

        {/* Dots + temp labels + time labels every STEP hours */}
        {points.map((p, i) => {
          if (i % STEP !== 0) return null;
          const isPeak = i === peakIdx;
          return (
            <g key={i}>
              {/* Dot */}
              {!isPeak && (
                <circle cx={p.x} cy={p.y} r="3" fill="var(--accent)" fillOpacity="0.7" />
              )}
              {/* Temperature label above */}
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                fill="var(--ink)"
                fontSize="12"
                fontFamily="var(--font-mono)"
                fontWeight="600"
                letterSpacing="0.02em"
              >
                {p.t}°
              </text>
              {/* Time label below */}
              <text
                x={p.x}
                y={H - 6}
                textAnchor="middle"
                fill="var(--ink-2)"
                fontSize="11"
                fontFamily="var(--font-mono)"
                letterSpacing="0.05em"
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
