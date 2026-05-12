/**
 * Utility condivise per i dati meteo.
 * Centralizza logica ripetuta tra più componenti.
 */

/**
 * Reverse geocoding: da coordinate GPS a nome città via Nominatim (OpenStreetMap).
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<string|null>}  nome della città, o null se non trovata
 */
export async function reverseGeocode(lat, lon) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
    const res = await fetch(url, { headers: { "Accept-Language": "it,en" } });
    if (!res.ok) return null;
    const data = await res.json();
    return (
      data.address?.city    ||
      data.address?.town    ||
      data.address?.village ||
      data.address?.county  ||
      null
    );
  } catch {
    return null;
  }
}

/**
 * Parsing sicuro di una stringa YYYY-MM-DD in oggetto Date locale.
 * Evita il bug di iOS Safari che interpreta la stringa come UTC midnight.
 * @param {string} dateStr  — es. "2024-05-10"
 * @returns {Date}
 */
export function parseDateStr(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/**
 * Calcola la data/ora corrente nella timezone della città
 * usando il campo `tzoffset` restituito dall'API Visual Crossing.
 * @param {number} tzOffset  — ore di offset (es. 2 per UTC+2)
 * @returns {Date}
 */
export function getCityDate(tzOffset = 0) {
  const now = new Date();
  return new Date(
    now.getTime() + now.getTimezoneOffset() * 60000 + tzOffset * 3600000
  );
}

/**
 * Restituisce true se l'ora fornita è diurna (06:00–19:59).
 * @param {number} hour  — ora intera (0–23)
 * @returns {boolean}
 */
export function isDaytime(hour) {
  return hour >= 6 && hour < 20;
}

/**
 * Trova i dati del forecast orario corrispondente all'ora richiesta.
 *
 * I `datetime` di Visual Crossing hanno formato "HH:00:00" (sempre ora piena).
 * Per evitare che un input con minuti (es. "14:37") non matchi nulla e cada
 * sul fallback `currentConditions` — che riflette l'ULTIMA OSSERVAZIONE della
 * stazione meteo (può essere stantia di ore o presa da una stazione lontana
 * dal centro città) — qui normalizziamo l'input alla sola ora e facciamo
 * match esatto.
 *
 * `currentConditions` resta come fallback estremo nel caso `days[0].hours`
 * manchi del tutto.
 *
 * @param {object} weatherData  — risposta Visual Crossing
 * @param {string} hourStr      — accetta sia "HH" sia "HH:MM" sia "HH:MM:SS"
 * @returns {object}
 */
export function findHourlyData(weatherData, hourStr) {
  const hh = hourStr?.slice(0, 2);
  const hours = weatherData.days?.[0]?.hours;
  if (hours && hh) {
    const match = hours.find((h) => h.datetime?.startsWith(`${hh}:`));
    if (match) return match;
  }
  return weatherData.currentConditions;
}
