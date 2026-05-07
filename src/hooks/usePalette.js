import { useMemo } from "react";

const CONDITION_MAP = [
  // EN + IT: stormy
  { keys: ["thunder", "storm", "lightning", "temporale", "fulmine"], palette: "stormy" },
  // EN + IT: rainy
  { keys: ["rain", "drizzle", "shower", "precipit", "pioggia", "pioviggine", "rovescio", "neve", "grandine", "nevischio"], palette: "rainy" },
  // EN + IT: overcast/fog
  { keys: ["overcast", "fog", "mist", "coperto", "nebbia", "foschia"], palette: "cloudy" },
  // EN + IT: partly cloudy
  { keys: ["cloud", "partially", "nuvoloso", "parzialmente", "nuvol"], palette: "p-cloudy" },
  // EN + IT: snow/ice (mapped to rainy palette)
  { keys: ["snow", "sleet", "ice", "hail"], palette: "rainy" },
  // EN + IT: clear/sunny
  { keys: ["clear", "sun", "fair", "sereno", "soleggiato", "limpido"], palette: "sunny" },
];

function getConditionCategory(conditions) {
  if (!conditions) return "sunny";
  const lower = conditions.toLowerCase();
  for (const { keys, palette } of CONDITION_MAP) {
    if (keys.some((k) => lower.includes(k))) return palette;
  }
  return "sunny";
}

function getTimeBucket(hour) {
  if (hour >= 5 && hour < 8)  return "dawn";
  if (hour >= 8 && hour < 18) return "day";
  if (hour >= 18 && hour < 21) return "dusk";
  return "night";
}

export function usePalette(conditions, date = new Date()) {
  return useMemo(() => {
    const condition = getConditionCategory(conditions);
    const timeBucket = getTimeBucket(date.getHours());
    const key = `${condition}-${timeBucket}`;
    return { key, condition, timeBucket };
  }, [conditions, date.getHours()]);
}

export { getConditionCategory, getTimeBucket };
