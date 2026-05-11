/**
 * Utility condivise per i dati meteo.
 * Centralizza logica ripetuta tra più componenti.
 */

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
 * Trova i dati dell'ora corrente nell'array orario del primo giorno.
 * Fallback su currentConditions se l'ora non è trovata.
 * @param {object} weatherData  — risposta Visual Crossing
 * @param {string} hourStr      — es. "14:00"
 * @returns {object}
 */
export function findHourlyData(weatherData, hourStr) {
  return (
    weatherData.days[0]?.hours?.find((h) => h.datetime.includes(hourStr)) ||
    weatherData.currentConditions
  );
}
