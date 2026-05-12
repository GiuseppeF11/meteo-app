import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import axios from "axios";
import { useLang } from "./LangContext";
import { reverseGeocode } from "../utils/weather";

const FALLBACK_CITY = "Catania";

const CityContext = createContext();

export const CityProvider = ({ children }) => {
  // `null` finché il GPS non ha risposto: impedisce fetch prematuro
  const [city, setCity] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  // Parte `true` così il Loader appare subito, ancora prima che il GPS risponda
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const { lang } = useLang();
  // Ultima query andata a buon fine (per futuro riuso, es. cambio lingua)
  const lastGoodQueryRef = useRef(FALLBACK_CITY);

  const API_KEY = import.meta.env.VITE_VISUAL_CROSSING_KEY;

  // ── Richiesta GPS al primo caricamento ──────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setCity(FALLBACK_CITY);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const gpsCity = await reverseGeocode(
            pos.coords.latitude,
            pos.coords.longitude
          );
          setCity(gpsCity || FALLBACK_CITY);
        } catch {
          setCity(FALLBACK_CITY);
        }
      },
      () => {
        // Permesso negato o timeout: fallback silenzioso su città di default
        setCity(FALLBACK_CITY);
      },
      { timeout: 8000 }
    );
  }, []); // una sola volta al mount
  // ────────────────────────────────────────────────────────────────────────

  const fetchWeatherData = async (query, language) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(query)}?unitGroup=metric&lang=${language}&key=${API_KEY}`
      );
      if (response.data) {
        setWeatherData(response.data);
        lastGoodQueryRef.current = query; // salva query funzionante
      } else {
        throw new Error("Nessun dato disponibile.");
      }
    } catch (err) {
      const status = err.response?.status;
      if (status === 400 || status === 404) {
        setError("cityNotFound");
      } else {
        setError("networkError");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) fetchWeatherData(city, lang);
  }, [city, lang]); // lang incluso: le condizioni meteo arrivano tradotte dall'API

  const setHour = (hour) => setSelectedHour(hour);

  return (
    <CityContext.Provider value={{ city, setCity, weatherData, loading, error, setError, selectedHour, setHour }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);
