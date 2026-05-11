import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { useLang } from "./LangContext";

const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [city, setCity] = useState("Catania");
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null);
  const { lang } = useLang();

  const API_KEY = import.meta.env.VITE_VISUAL_CROSSING_KEY;

  const fetchWeatherData = async (city, language) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${encodeURIComponent(city)}?unitGroup=metric&lang=${language}&key=${API_KEY}`
      );
      if (response.data) {
        setWeatherData(response.data);
      } else {
        throw new Error("Nessun dato disponibile.");
      }
    } catch (err) {
      setError(err.message || "Errore nella chiamata API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) fetchWeatherData(city, lang);
  }, [city, lang]); // lang incluso: le condizioni meteo arrivano tradotte dall'API

  const setHour = (hour) => setSelectedHour(hour);

  return (
    <CityContext.Provider value={{ city, setCity, weatherData, loading, error, selectedHour, setHour }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);
