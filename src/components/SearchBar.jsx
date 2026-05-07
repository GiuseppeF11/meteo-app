import React, { useState, useEffect, useRef, useCallback } from "react";
import { useCity } from "../contexts/CityContext";
import { useLang } from "../contexts/LangContext";
import { SearchIcon } from "./WeatherIcons";

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
  const { setCity, error: apiError } = useCity();
  const { lang, setLang, t } = useLang();
  const containerRef = useRef(null);

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
    <div ref={containerRef} style={{ position: "relative", marginBottom: 28, display: "flex", alignItems: "flex-start", gap: 10 }}>
      <form onSubmit={handleSubmit} className="glass-pill search-bar fade-up">
        <SearchIcon size={18} color="var(--ink-2)" strokeWidth={1.8} />
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
        <button type="submit" aria-label={t("searchGo")}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 10,
            letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-2)" }}>
            {t("searchGo")}
          </span>
        </button>
      </form>

      <button
        type="button"
        onClick={() => setLang(lang === "it" ? "en" : "it")}
        className="glass-pill"
        style={{
          padding: "0 16px", height: 44, whiteSpace: "nowrap", flexShrink: 0,
          fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.12em",
          textTransform: "uppercase", color: "var(--ink)", cursor: "pointer",
          border: "none", background: "var(--card)",
        }}
        aria-label="Switch language"
      >
        {t("langToggle")}
      </button>

      {error && (
        <p style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#e05050",
          margin: "4px 16px 0", letterSpacing: "0.04em", position: "absolute",
          top: "100%", left: 0 }}>
          {error}
        </p>
      )}

      {open && suggestions.length > 0 && (
        <ul role="listbox" style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0,
          listStyle: "none", margin: 0, padding: "6px 0",
          background: "var(--card)", border: "1px solid var(--card-stroke)",
          backdropFilter: "blur(14px) saturate(140%)",
          WebkitBackdropFilter: "blur(14px) saturate(140%)",
          borderRadius: 14, zIndex: 100, boxShadow: "0 8px 32px rgba(0,0,0,.12)",
        }}>
          {suggestions.map((s, i) => (
            <li key={i} role="option" aria-selected={i === activeIdx}
              onMouseDown={() => selectCity(s.cityName)}
              onMouseEnter={() => setActiveIdx(i)}
              style={{
                padding: "9px 16px", cursor: "pointer",
                fontFamily: "var(--font-ui)", fontSize: 13,
                color: i === activeIdx ? "var(--accent)" : "var(--ink)",
                background: i === activeIdx ? "var(--accent-soft)" : "transparent",
                transition: "background 0.15s",
                display: "flex", flexDirection: "column", gap: 1,
              }}>
              <span style={{ fontWeight: 600 }}>{s.cityName}</span>
              <span style={{ fontSize: 11, color: "var(--ink-2)",
                fontFamily: "var(--font-mono)", letterSpacing: "0.04em" }}>
                {s.label.split(", ").slice(1).join(", ")}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
