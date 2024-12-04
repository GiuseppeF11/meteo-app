import React, { useEffect, useState } from "react";
import TodayMeteo from "../components/TodayMeteo";
import { useCity } from "../contexts/CityContext";
import Loader from "../components/Loader";

function Header() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [inputCity, setInputCity] = useState("");
  const { city, setCity, loading, selectedHour } = useCity();

  useEffect(() => {
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleInputCityChange = (e) => setInputCity(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputCity) setCity(inputCity);
    setInputCity("");
  };

  if (loading) return <Loader />;

  return (
    <header className="mb-10">
      {/* Smartphone Layout */}
      <div className="block md:hidden">
        {/* Dati di oggi */}
        <section className="font-bold text-white text-center my-5">
          <h1 className="text-3xl">{city}</h1>
          <h1 className="text-xl">
            {currentDate.toLocaleDateString("it-IT", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </h1>
          <h2 className="text-xl">
            {selectedHour
              ? selectedHour
              : currentDate.toLocaleTimeString("it-IT", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
          </h2>
        </section>

        {/* Input per la città */}
        <section className="text-center mb-5">
          <form onSubmit={handleSubmit} className="inline-block">
            <input
              type="text"
              value={inputCity}
              onChange={handleInputCityChange}
              placeholder="Inserisci la città"
              className="px-3 py-2 rounded"
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Cerca
            </button>
          </form>
        </section>

        <TodayMeteo />
      </div>

      {/* Tablet Layout */}
      <div className="hidden md:flex md:flex-col lg:hidden">
        <div className="flex justify-between items-center mb-5">
          <section className="font-bold text-white text-center">
            <h1 className="text-3xl">{city}</h1>
            <h1 className="text-xl">
              {currentDate.toLocaleDateString("it-IT", {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </h1>
            <h2 className="text-xl">
              {selectedHour
                ? selectedHour
                : currentDate.toLocaleTimeString("it-IT", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
            </h2>
          </section>
          <section>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={inputCity}
                onChange={handleInputCityChange}
                placeholder="Inserisci la città"
                className="px-3 py-2 rounded"
              />
              <button
                type="submit"
                className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
              >
                Cerca
              </button>
            </form>
          </section>
        </div>
        <TodayMeteo />
      </div>

      {/* Computer Layout */}
      <div className="hidden lg:flex justify-between items-center">
        <TodayMeteo />
        <section className="font-bold text-white text-center">
          <h1 className="text-3xl md:text-5xl">{city}</h1>
          <h1 className="text-xl md:text-3xl">
            {currentDate.toLocaleDateString("it-IT", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </h1>
          <h2 className="text-xl md:text-3xl">
            {selectedHour
              ? selectedHour
              : currentDate.toLocaleTimeString("it-IT", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
          </h2>
        </section>
        <section>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={inputCity}
              onChange={handleInputCityChange}
              placeholder="Inserisci la città"
              className="px-3 py-2 rounded"
            />
            <button
              type="submit"
              className="ml-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Cerca
            </button>
          </form>
        </section>
      </div>
    </header>
  );
}

export default Header;
