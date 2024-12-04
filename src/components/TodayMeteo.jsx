import React from "react";
import { useCity } from "../contexts/CityContext";
import { IoIosSunny, IoMdRainy, IoMdSnow } from "react-icons/io";
import { BsCloudSun, BsCloudsFill, BsMoon, BsCloudMoon } from "react-icons/bs"; 
import "./TodayMeteo.css";

function TodayMeteo() {
  const { weatherData, error, selectedHour } = useCity();
  if (!weatherData) return null;

  if (error) return <div className="text-red-600 font-bold">Errore: {error}</div>;

  const hourToUse = selectedHour || new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

  const selectedData = weatherData.days[0]?.hours.find(hour => hour.datetime.includes(hourToUse)) || weatherData.currentConditions;

  const { temp, precip, humidity, windSpeed, conditions } = selectedData;

  const isDayTime = (hour) => {
    const hourInt = parseInt(hour.split(":")[0]);
    return hourInt >= 6 && hourInt < 18;
  };

  const weatherIcons = {
    rain: <IoMdRainy className="text-blue-500" />,
    snow: <IoMdSnow className="text-blue-200" />,
    cloud: <BsCloudSun className="text-gray-200" />,
    overcast: <BsCloudsFill className="text-gray-400" />,
    clear: <IoIosSunny className="text-yellow-400" />,
    cloudMoon: <BsCloudMoon className="text-gray-300" />,
    moon: <BsMoon className="text-gray-100" />
  };

  const getWeatherIcon = (conditions, hour) => {
    const conditionLower = conditions.toLowerCase();

    if (!isDayTime(hour)) {
      if (conditionLower.includes("rain")) return weatherIcons.rain;
      if (conditionLower.includes("snow")) return weatherIcons.snow;
      if (conditionLower.includes("cloud")) return weatherIcons.cloudMoon;
      if (conditionLower.includes("overcast")) return weatherIcons.overcast;
      return weatherIcons.moon;
    }

    if (conditionLower.includes("rain")) return weatherIcons.rain;
    if (conditionLower.includes("snow")) return weatherIcons.snow;
    if (conditionLower.includes("cloud")) return weatherIcons.cloud;
    if (conditionLower.includes("overcast")) return weatherIcons.overcast;
    return weatherIcons.clear;
  };

  return (
    <section className="today-container p-5 rounded-lg bg-gray-800 text-white grid gap-4 grid-cols-1 md:grid-cols-2 md:items-center">
      {/* Icona meteo */}
      <div className="flex justify-center items-center text-6xl md:text-8xl">
        {getWeatherIcon(conditions, hourToUse)}
      </div>

      {/* Dati meteo */}
      <div className="flex flex-col justify-center text-center md:text-left">
        <h1 className="text-4xl font-bold mb-4">
          {Math.round(temp)} °C
        </h1>
        <ul className="space-y-1  md:w-44">
          <li className="text-lg">Precipitazioni: {precip}%</li>
          <li className="text-lg">Umidità: {humidity}%</li>
          <li className="text-lg">Vento: {windSpeed} km/h</li>
        </ul>
      </div>
    </section>
  );
}

export default TodayMeteo;
