import React, { useState, useEffect, useRef, useCallback } from "react";
import { useCity } from "../contexts/CityContext";
import { useLang } from "../contexts/LangContext";
import { SearchIcon, GpsIcon } from "./WeatherIcons";

async function reverseGeocode(lat, lon) {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
  const res = await fetch(url, { headers: { "Accept-Language": "it,en" } });
  if (!res.ok) return null;
  const data = await res.json();
  return (
    data.address?.city ||
    data.address?.town ||
    data.address?.village ||
    data.address?.county ||
    null
  );
}

function debounce(fn, ms) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
}

async function fetchSuggestions(query) {
  if (!query || query.length < 2) return [];
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=10&featuretype=city&addressdetails=1`;
    const res = await fetch(url, { headers: { "Accept-Language": "it,en" } });
    if (!res.ok) return [];
    const data = await res.json();
    const ql = query.toLowerCase();
    return data
      .filter((item) =>
        ["city", "town", "village", "municipality"].includes(item.addresstype)
      )
      .map((item) => {
        const city = item.address?.city || item.address?.town || item.address?.village || item.name;
        const country = item.address?.country || "";
        return { cityName: city, country, importance: item.importance ?? 0 };
      })
      .filter((item) => item.cityName)
      .sort((a, b) => {
        const aStarts = a.cityName.toLowerCase().startsWith(ql);
        const bStarts = b.cityName.toLowerCase().startsWith(ql);
        if (aStarts && !bStarts) return -1;
        if (!aStarts && bStarts) return 1;
        return b.importance - a.importance;
      })
      .filter((item, idx, arr) => arr.findIndex((x) => x.cityName === item.cityName) === idx)
      .slice(0, 5)
      .map(({ cityName, country }) => ({ cityName, label: `${cityName}, ${country}` }));
  } catch {
    return [];
  }
}

export default function SearchBar() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [activeIdx, setActiveIdx] = useState(-1);
  const [gpsLoading, setGpsLoading] = useState(false);
  const { setCity, error: apiError } = useCity();
  const { t } = useLang();
  const containerRef = useRef(null);

  const handleGps = useCallback(async () => {
    if (!navigator.geolocation) { setError(t("gpsError")); return; }
    setGpsLoading(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const city = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
          if (city) {
            setCity(city);
            setInput("");
          } else {
            setError(t("gpsCityNotFound"));
          }
        } catch {
          setError(t("gpsError"));
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        setGpsLoading(false);
        setError(err.code === 1 ? t("gpsDenied") : t("gpsError"));
      },
      { timeout: 8000 }
    );
  }, [t, setCity]);

  const debouncedFetch = useCallback(
    debounce(async (q) => {
      const results = await fetchSuggestions(q);
      setSuggestions(results);
      setOpen(results.length > 0);
      setActiveIdx(-1);
    }, 300),
    []
  );

  useEffect(() => {
    if (input.trim().length >= 2) debouncedFetch(input.trim());
    else { setSuggestions([]); setOpen(false); }
  }, [input]);

  useEffect(() => {
    if (apiError) setError(t("searchNotFound"));
    else setError("");
  }, [apiError, t]);

  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const selectCity = (cityName) => {
    setCity(cityName);
    setInput(""); setSuggestions([]); setOpen(false); setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0 && activeIdx >= 0) selectCity(suggestions[activeIdx].cityName);
    else if (suggestions.length > 0) selectCity(suggestions[0].cityName);
    else if (input.trim()) setError(t("searchSelectHint"));
  };

  const handleKeyDown = (e) => {
    if (!open || !suggestions.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => (i < suggestions.length - 1 ? i + 1 : 0)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => (i > 0 ? i - 1 : suggestions.length - 1)); }
    else if (e.key === "Escape") setOpen(false);
  };

  return (
    <div style={{ marginBottom: 28 }}>
      {/* Search form + dropdown scoped together */}
      <div ref={containerRef} className="search-bar-container" style={{ position: "relative", width: "fit-content" }}>
        <form onSubmit={handleSubmit} className="glass-pill search-bar fade-up">
          <SearchIcon size={18} color="var(--ink-2)" strokeWidth={1.8} />
          <button
            type="button"
            onClick={handleGps}
            aria-label={t("gpsLocate")}
            title={t("gpsLocate")}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              padding: 0, display: "flex", alignItems: "center", flexShrink: 0,
              opacity: gpsLoading ? 0.4 : 1,
              animation: gpsLoading ? "spin 1s linear infinite" : "none",
            }}
          >
            <GpsIcon size={18} color="var(--accent)" strokeWidth={1.8} />
          </button>
          <input
            type="text" value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder={t("searchPlaceholder")}
            autoComplete="off"
            aria-label={t("searchPlaceholder")}
            aria-autocomplete="list"
            aria-expanded={open}
          />
          {input && (
            <button type="button"
              onClick={() => { setInput(""); setSuggestions([]); setOpen(false); setError(""); }}
              style={{ background: "transparent", border: "none", cursor: "pointer",
                color: "var(--ink-2)", padding: 0, lineHeight: 1, fontSize: 16 }}
              aria-label={t("searchClear")}>
              ×
            </button>
          )}
          <button type="submit" className="search-submit" aria-label={t("searchGo")}>
            {t("searchGo")}
          </button>
        </form>

        {error && (
          <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#e05050",
            margin: "4px 16px 0", letterSpacing: "0.04em" }}>
            {error}
          </p>
        )}

        {open && suggestions.length > 0 && (
          <ul role="listbox" style={{
            position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
            listStyle: "none", margin: 0, padding: "4px 0",
            background: "var(--card)", border: "1px solid var(--card-stroke)",
            backdropFilter: "blur(14px) saturate(140%)",
            WebkitBackdropFilter: "blur(14px) saturate(140%)",
            borderRadius: 12, zIndex: 100, boxShadow: "0 8px 24px rgba(0,0,0,.10)",
          }}>
            {suggestions.map((s, i) => (
              <li key={i} role="option" aria-selected={i === activeIdx}
                onMouseDown={() => selectCity(s.cityName)}
                onMouseEnter={() => setActiveIdx(i)}
                style={{
                  padding: "7px 14px", cursor: "pointer",
                  fontFamily: "var(--font-ui)", fontSize: 13,
                  color: i === activeIdx ? "var(--accent)" : "var(--ink)",
                  background: i === activeIdx ? "var(--accent-soft)" : "transparent",
                  transition: "background 0.15s",
                  display: "flex", flexDirection: "column", gap: 1,
                }}>
                <span style={{ fontWeight: 600 }}>{s.cityName}</span>
                <span style={{ fontSize: 10, color: "var(--ink-2)",
                  fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
                  {s.label.split(", ").slice(1).join(", ")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
