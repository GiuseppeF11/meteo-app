import { useMemo } from "react";

const RAIN_DROPS = Array.from({ length: 30 }, (_, i) => ({
  x: 5 + (i * 31) % 90,
  delay: ((i * 0.17) % 3.5).toFixed(2),
  dur: (1.2 + (i * 0.11) % 2.5).toFixed(2),
}));

const STARS = [
  [15, 10], [28, 22], [55, 8], [70, 18], [82, 6],
  [40, 30], [62, 25], [90, 14], [8, 35],
];

export default function AtmosphericBackground({ condition = "sunny", timeOfDay = "day" }) {
  const isNight = timeOfDay === "night";
  const isDawn  = timeOfDay === "dawn";
  const isDusk  = timeOfDay === "dusk";
  const showRain = condition === "rainy" || condition === "stormy";
  const showLightning = condition === "stormy";
  const showClouds = ["cloudy", "p-cloudy", "rainy", "stormy"].includes(condition);

  const skyColors = useMemo(() => {
    if (isNight)  return ["#060b20", "#0e1535"];
    if (isDawn)   return ["#e8a870", "#c87848"];
    if (isDusk)   return ["#d06848", "#8830a0"];
    return ["var(--bg-1)", "var(--bg-2)"];
  }, [isNight, isDawn, isDusk]);

  const celestialColor = useMemo(() => {
    if (isNight)  return "#ffd76b";
    if (isDawn || isDusk) return "#f0903a";
    return "#f5c040";
  }, [isNight, isDawn, isDusk]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 100 100"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skyColors[0]} />
          <stop offset="100%" stopColor={skyColors[1]} />
        </linearGradient>
        <radialGradient id="celestial-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor={celestialColor} stopOpacity="0.9" />
          <stop offset="40%"  stopColor={celestialColor} stopOpacity="0.4" />
          <stop offset="100%" stopColor={celestialColor} stopOpacity="0" />
        </radialGradient>

        <style>{`
          @keyframes drift  { 0%,100%{transform:translate(0,0)} 50%{transform:translate(1.5px,-1px)} }
          @keyframes drift2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-2px,1.2px)} }
          @keyframes rain-drop {
            0%   { opacity:.7; transform:translateY(0) }
            80%  { opacity:.5 }
            100% { opacity:0; transform:translateY(30px) }
          }
          @keyframes lightning-flash {
            0%,90%,100% { opacity:0 }
            91%,93%,95% { opacity:1 }
          }
          .drift  { animation: drift  14s ease-in-out infinite; transform-origin: 50% 50%; }
          .drift2 { animation: drift2 18s ease-in-out infinite; transform-origin: 50% 50%; }
        `}</style>
      </defs>

      {/* Sky gradient */}
      <rect width="100" height="100" fill="url(#sky)" />

      {/* Stars (night only) */}
      {isNight && STARS.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.35" fill="#f0f3ff" opacity={0.5 + (i % 3) * 0.15} />
      ))}

      {/* Sun / Moon */}
      <g className="drift">
        {isNight ? (
          /* Crescent moon */
          <g transform="translate(75, 16)">
            <circle cx="0" cy="0" r="4" fill={celestialColor} opacity="0.92" />
            <circle cx="2" cy="-1.5" r="3.2" fill={skyColors[0]} />
          </g>
        ) : (
          /* Sun with glow */
          <g transform="translate(75, 16)">
            <circle cx="0" cy="0" r="8" fill="url(#celestial-glow)" />
            <circle cx="0" cy="0" r="4" fill={celestialColor} opacity="0.95" />
          </g>
        )}
      </g>

      {/* Clouds */}
      {showClouds && (
        <>
          <g className="drift2" opacity={condition === "stormy" ? "0.85" : "0.65"}>
            <ellipse cx="30" cy="28" rx="14" ry="7"
              fill={condition === "stormy" ? "#2a2828" : "rgba(200,210,220,.8)"} />
            <ellipse cx="38" cy="24" rx="10" ry="6"
              fill={condition === "stormy" ? "#302c2c" : "rgba(220,228,235,.8)"} />
            <ellipse cx="22" cy="30" rx="9" ry="5"
              fill={condition === "stormy" ? "#242020" : "rgba(190,202,212,.7)"} />
          </g>
          {showClouds && (
            <g className="drift" opacity="0.50">
              <ellipse cx="65" cy="20" rx="10" ry="5"
                fill={condition === "stormy" ? "#201e1e" : "rgba(210,218,228,.7)"} />
              <ellipse cx="73" cy="17" rx="8" ry="4.5"
                fill={condition === "stormy" ? "#262222" : "rgba(225,232,240,.7)"} />
            </g>
          )}
        </>
      )}

      {/* Rain */}
      {showRain && RAIN_DROPS.map((d, i) => (
        <line
          key={i}
          x1={`${d.x}%`} y1="25%"
          x2={`${d.x - 0.8}%`} y2="40%"
          stroke="rgba(130,170,210,0.7)"
          strokeWidth="0.3"
          style={{
            animation: `rain-drop ${d.dur}s ${d.delay}s linear infinite`,
          }}
        />
      ))}

      {/* Lightning */}
      {showLightning && (
        <polyline
          points="36,30 33,42 37,42 34,56"
          fill="none"
          stroke="#ffd700"
          strokeWidth="0.8"
          strokeLinecap="round"
          style={{ animation: "lightning-flash 3.5s ease-in-out infinite" }}
        />
      )}

      {/* City silhouette */}
      <path
        d="M0,85 L0,78 L4,78 L4,72 L6,72 L6,68 L8,68 L8,72 L10,72 L10,65 L12,65 L12,70 L15,70
           L15,73 L17,73 L17,66 L19,66 L19,73 L22,73 L22,68 L24,68 L24,75 L27,75 L27,70
           L30,70 L30,63 L32,63 L32,70 L35,70 L35,73 L38,73 L38,67 L40,64 L42,67 L42,73
           L46,73 L46,68 L48,68 L48,76 L52,76 L52,70 L55,70 L55,65 L57,65 L57,70 L60,70
           L60,74 L63,74 L63,69 L66,69 L66,72 L69,72 L69,78 L72,78 L72,74 L75,74 L75,70
           L78,70 L78,75 L82,75 L82,68 L85,68 L85,72 L88,72 L88,78 L91,78 L91,73 L94,73
           L94,79 L97,79 L97,82 L100,82 L100,85 Z"
        fill="var(--ink)"
        opacity="0.06"
      />
    </svg>
  );
}
