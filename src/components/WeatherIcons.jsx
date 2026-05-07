const defaults = { size: 48, strokeWidth: 1.6, color: "currentColor" };

const Icon = ({ size, strokeWidth, color, children }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

export function Sun({ size = defaults.size, strokeWidth = defaults.strokeWidth, color = defaults.color }) {
  return (
    <Icon size={size} strokeWidth={strokeWidth} color={color}>
      <circle cx="24" cy="24" r="7" />
      <line x1="24" y1="6"  x2="24" y2="10" />
      <line x1="24" y1="38" x2="24" y2="42" />
      <line x1="6"  y1="24" x2="10" y2="24" />
      <line x1="38" y1="24" x2="42" y2="24" />
      <line x1="11.5" y1="11.5" x2="14.3" y2="14.3" />
      <line x1="33.7" y1="33.7" x2="36.5" y2="36.5" />
      <line x1="36.5" y1="11.5" x2="33.7" y2="14.3" />
      <line x1="14.3" y1="33.7" x2="11.5" y2="36.5" />
    </Icon>
  );
}

export function PartlyCloudy({ size = defaults.size, strokeWidth = defaults.strokeWidth, color = defaults.color }) {
  return (
    <Icon size={size} strokeWidth={strokeWidth} color={color}>
      <circle cx="20" cy="16" r="5" />
      <line x1="20" y1="8"  x2="20" y2="10.5" />
      <line x1="11" y1="16" x2="13.5" y2="16" />
      <line x1="13" y1="9"  x2="14.8" y2="10.8" />
      <path d="M18 28 a7 7 0 0 1 0-14h1a7 7 0 0 1 6.9 6 5 5 0 1 1-.9 9.9H18z" />
    </Icon>
  );
}

export function Cloud({ size = defaults.size, strokeWidth = defaults.strokeWidth, color = defaults.color }) {
  return (
    <Icon size={size} strokeWidth={strokeWidth} color={color}>
      <path d="M13 30 a9 9 0 0 1 0-18h2a9 9 0 0 1 17.4 3 6 6 0 1 1-1 11H13z" />
    </Icon>
  );
}

export function Rain({ size = defaults.size, strokeWidth = defaults.strokeWidth, color = defaults.color }) {
  return (
    <Icon size={size} strokeWidth={strokeWidth} color={color}>
      <path d="M13 25 a9 9 0 0 1 0-18h2a9 9 0 0 1 17.4 3 6 6 0 1 1-1 11H13z" />
      <line x1="16" y1="32" x2="14" y2="40" />
      <line x1="24" y1="32" x2="22" y2="40" />
      <line x1="32" y1="32" x2="30" y2="40" />
    </Icon>
  );
}

export function Storm({ size = defaults.size, strokeWidth = defaults.strokeWidth, color = defaults.color }) {
  return (
    <Icon size={size} strokeWidth={strokeWidth} color={color}>
      <path d="M13 25 a9 9 0 0 1 0-18h2a9 9 0 0 1 17.4 3 6 6 0 1 1-1 11H13z" />
      <polyline points="26,30 22,38 26,38 22,46" fill="none" />
    </Icon>
  );
}

export function Moon({ size = defaults.size, strokeWidth = defaults.strokeWidth, color = defaults.color }) {
  return (
    <Icon size={size} strokeWidth={strokeWidth} color={color}>
      <path d="M30 28a12 12 0 1 1-10-20 9 9 0 0 0 10 20z" />
    </Icon>
  );
}

export function Wind({ size = defaults.size, strokeWidth = defaults.strokeWidth, color = defaults.color }) {
  return (
    <Icon size={size} strokeWidth={strokeWidth} color={color}>
      <path d="M8 18 Q22 14 32 18 Q40 22 38 26 Q36 30 30 28" />
      <path d="M8 24 Q20 20 30 24 Q38 28 36 32 Q34 36 28 34" />
      <path d="M8 30 Q18 26 26 30" />
    </Icon>
  );
}

export function Drop({ size = defaults.size, strokeWidth = defaults.strokeWidth, color = defaults.color }) {
  return (
    <Icon size={size} strokeWidth={strokeWidth} color={color}>
      <path d="M24 8 C24 8 10 22 10 30 a14 14 0 0 0 28 0 C38 22 24 8 24 8z" />
    </Icon>
  );
}

export function UVIcon({ size = defaults.size, strokeWidth = defaults.strokeWidth, color = defaults.color }) {
  return (
    <Icon size={size} strokeWidth={strokeWidth} color={color}>
      <circle cx="24" cy="24" r="8" />
      <line x1="24" y1="5"  x2="24" y2="9" />
      <line x1="24" y1="39" x2="24" y2="43" />
      <line x1="5"  y1="24" x2="9"  y2="24" />
      <line x1="39" y1="24" x2="43" y2="24" />
      <line x1="10" y1="10" x2="13.2" y2="13.2" />
      <line x1="34.8" y1="34.8" x2="38" y2="38" />
      <line x1="38" y1="10" x2="34.8" y2="13.2" />
      <line x1="13.2" y1="34.8" x2="10" y2="38" />
    </Icon>
  );
}

export function SearchIcon({ size = defaults.size, strokeWidth = defaults.strokeWidth, color = defaults.color }) {
  return (
    <Icon size={size} strokeWidth={strokeWidth} color={color}>
      <circle cx="21" cy="21" r="10" />
      <line x1="28.5" y1="28.5" x2="40" y2="40" />
    </Icon>
  );
}

export function PinIcon({ size = defaults.size, strokeWidth = defaults.strokeWidth, color = defaults.color }) {
  return (
    <Icon size={size} strokeWidth={strokeWidth} color={color}>
      <path d="M24 6 a10 10 0 0 1 10 10 c0 8-10 20-10 20 S14 24 14 16 a10 10 0 0 1 10-10z" />
      <circle cx="24" cy="16" r="3.5" />
    </Icon>
  );
}

export function SunriseIcon({ size = defaults.size, strokeWidth = defaults.strokeWidth, color = defaults.color }) {
  return (
    <Icon size={size} strokeWidth={strokeWidth} color={color}>
      <path d="M8 34 Q24 16 40 34" fill="none" />
      <circle cx="24" cy="34" r="5" />
      <line x1="24" y1="6"  x2="24" y2="11" />
      <line x1="24" y1="20" x2="24" y2="25" />
      <line x1="13" y1="10" x2="16" y2="13" />
      <line x1="35" y1="10" x2="32" y2="13" />
    </Icon>
  );
}

export function SunsetIcon({ size = defaults.size, strokeWidth = defaults.strokeWidth, color = defaults.color }) {
  return (
    <Icon size={size} strokeWidth={strokeWidth} color={color}>
      <path d="M8 26 Q24 8 40 26" fill="none" />
      <circle cx="24" cy="26" r="5" />
      <line x1="24" y1="38" x2="24" y2="43" />
      <line x1="24" y1="29" x2="24" y2="34" />
      <line x1="13" y1="38" x2="16" y2="35" />
      <line x1="35" y1="38" x2="32" y2="35" />
    </Icon>
  );
}

export function SnowIcon({ size = defaults.size, strokeWidth = defaults.strokeWidth, color = defaults.color }) {
  return (
    <Icon size={size} strokeWidth={strokeWidth} color={color}>
      <path d="M13 25 a9 9 0 0 1 0-18h2a9 9 0 0 1 17.4 3 6 6 0 1 1-1 11H13z" />
      <line x1="18" y1="32" x2="18" y2="40" />
      <line x1="15" y1="35" x2="21" y2="35" />
      <line x1="26" y1="32" x2="26" y2="40" />
      <line x1="23" y1="35" x2="29" y2="35" />
    </Icon>
  );
}

export function getWeatherIcon(conditions = "", isDay = true, props = {}) {
  const c = conditions.toLowerCase();
  if (c.includes("thunder") || c.includes("storm")) return <Storm {...props} />;
  if (c.includes("snow") || c.includes("sleet") || c.includes("ice")) return <SnowIcon {...props} />;
  if (c.includes("rain") || c.includes("drizzle") || c.includes("shower")) return <Rain {...props} />;
  if (c.includes("overcast")) return <Cloud {...props} />;
  if (c.includes("cloud") || c.includes("partially")) return isDay ? <PartlyCloudy {...props} /> : <Cloud {...props} />;
  if (c.includes("fog") || c.includes("mist")) return <Cloud {...props} />;
  return isDay ? <Sun {...props} /> : <Moon {...props} />;
}
