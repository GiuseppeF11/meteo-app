import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";

const CityContext = createContext();

export const CityProvider = ({ children }) => {
  const [city, setCity] = useState("Catania");
  const [weatherData, setWeatherData] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null);
  const [selectedHour, setSelectedHour] = useState(null); 

  const API_KEY = "4ZHN8M7GAK9M3PNAFDJFBSYY9";

  const fetchWeatherData = async (city) => {
    setLoading(true);
    setError(null);

    try {
      console.log("Fetching weather data for city:", city);

      const response = await axios.get(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${API_KEY}`
      );

      console.log("API Response:", response.data);

      if (response.data) {
        setWeatherData(response.data); 
      } else {
        throw new Error("Nessun dato disponibile per la città selezionata.");
      }
    } catch (err) {
      console.error("Errore nella chiamata API:", err);
      setError(err.message || "Errore nella chiamata API");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (city) {
      fetchWeatherData(city);
    }
  }, [city]);

  const setHour = (hour) => {
    setSelectedHour(hour);
    console.log('ORA: ', hour)
  };

  return (
    <CityContext.Provider value={{ city, setCity, weatherData, loading, error, selectedHour, setHour }}>
      {children}
    </CityContext.Provider>
  );
};

export const useCity = () => useContext(CityContext);
