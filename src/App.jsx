import { useEffect } from "react";
import { useCity } from "./contexts/CityContext";
import { useLang } from "./contexts/LangContext";
import { usePalette } from "./hooks/usePalette";
import { getCityDate, findHourlyData } from "./utils/weather";
import AtmosphericBackground from "./components/AtmosphericBackground";
import SearchBar from "./components/SearchBar";
import HeroSection from "./components/HeroSection";
import Chart from "./components/Chart";
import HourlyStrip from "./components/HourlyStrip";
import MetricsGrid from "./components/MetricsGrid";
import SunArc from "./components/SunArc";
import ForecastGrid from "./components/ForecastGrid";
import LangToggle from "./components/LangToggle";
import Loader from "./components/Loader";
import Toast from "./components/Toast";
import "./App.css";

function AppContent() {
  const { weatherData, loading } = useCity();
  const { t, lang } = useLang();
  const cityDate = getCityDate(weatherData?.tzoffset ?? 0);
  const hourStr = cityDate.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
  // Stessa fonte dell'icona nella HeroSection: forecast dell'ora corrente
  // invece di currentConditions (che può essere stantio o non allineato)
  const currentHourData = weatherData ? findHourlyData(weatherData, hourStr) : null;
  const conditions = currentHourData?.conditions || "";
  const { key, condition, timeBucket } = usePalette(conditions, cityDate);

  useEffect(() => {
    document.documentElement.setAttribute("data-palette", key);
  }, [key]);

  // Aggiorna lang sull'<html> in base alla lingua selezionata
  // (previene che Safari/Chrome propongano la traduzione automatica)
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  if (loading) return <Loader />;

  return (
    <div className="app-root">
      <Toast />
      <LangToggle />
      <AtmosphericBackground condition={condition} timeOfDay={timeBucket} />

      {/* Search bar fissa in basso */}
      <div className="search-bar-fixed">
        <SearchBar />
      </div>

      <div className="app-layout">

        {/* 1 — Hero + Dettagli (affiancati su desktop, solo hero su mobile) */}
        <div className="hero-with-details">
          <div className="hero-section">
            <HeroSection />
          </div>
          {/* Dettagli — visibile solo su desktop, affiancato all'hero */}
          <div className="metrics-section metrics-section--desktop fade-up-2">
            <p className="chart-section-title">{t("detailsTitle")}</p>
            <MetricsGrid />
          </div>
        </div>

        {/* 2+3 — Ora per ora + Alba & Tramonto (affiancati su desktop) */}
        <div className="hourly-sunarc-row">
          <div className="glass chart-section fade-up-2">
            <p className="chart-section-title">{t("hourlyTitle")}</p>
            <HourlyStrip />
          </div>
          <div className="sun-arc-section fade-up-3">
            <SunArc />
          </div>
        </div>

        {/* 4 — Dettagli della giornata (visibile solo su mobile, dopo sun arc) */}
        <div className="metrics-section metrics-section--mobile fade-up-4">
          <p className="chart-section-title">{t("detailsTitle")}</p>
          <MetricsGrid />
        </div>

        {/* 5 — Grafico temperatura (solo desktop) */}
        <div className="glass chart-section fade-up-5 chart-desktop-only">
          <p className="chart-section-title">{t("next24h")}</p>
          <Chart />
        </div>

        {/* 6 — Previsioni 5 giorni */}
        <ForecastGrid />
      </div>
    </div>
  );
}

export default AppContent;
