import { useEffect } from "react";
import { useCity } from "./contexts/CityContext";
import { useLang } from "./contexts/LangContext";
import { usePalette } from "./hooks/usePalette";
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
import "./App.css";

function AppContent() {
  const { weatherData, loading } = useCity();
  const { t } = useLang();
  const conditions = weatherData?.currentConditions?.conditions || "";
  const { key, condition, timeBucket } = usePalette(conditions);

  useEffect(() => {
    document.documentElement.setAttribute("data-palette", key);
  }, [key]);

  if (loading) return <Loader />;

  return (
    <div className="app-root">
      <LangToggle />
      <AtmosphericBackground condition={condition} timeOfDay={timeBucket} />
      <div className="app-layout">
        <SearchBar />
        <div className="hero-section">
          <HeroSection />
          <div className="hero-right fade-up-3">
            <MetricsGrid />
            <SunArc />
          </div>
        </div>
        {/* Hourly conditions — always visible */}
        <div className="glass chart-section fade-up-4">
          <p className="chart-section-title">{t("hourlyTitle")}</p>
          <HourlyStrip />
        </div>

        {/* Temperature chart — desktop only */}
        <div className="glass chart-section fade-up-4 chart-desktop-only">
          <p className="chart-section-title">{t("next24h")}</p>
          <Chart />
        </div>
        <ForecastGrid />
      </div>
    </div>
  );
}

export default AppContent;
