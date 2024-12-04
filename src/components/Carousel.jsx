import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { useCity } from "../contexts/CityContext";
import "swiper/css";
import { IoIosSunny, IoMdRainy, IoMdSnow } from "react-icons/io";
import { BsCloudSun, BsCloudsFill } from "react-icons/bs";
import Card from "./Card";
import "./Carousel.css";

function Carousel() {
  const { weatherData, loading, error } = useCity();

  if (loading) {
    return null;
  }

  if (error) {
    console.error("Errore caricamento meteo:", error);
    return <div className="text-red-600 font-bold">Errore nel caricamento dei dati meteo</div>;
  }

  if (!weatherData) {
    return null;
  }

  const getWeatherIcon = (conditions) => {
    if (conditions.includes("Rain")) {
      return <IoMdRainy className="text-blue-500 text-6xl" />;
    } else if (conditions.includes("Snow")) {
      return <IoMdSnow className="text-blue-200 text-6xl" />;
    } else if (conditions.includes("Cloudy")) {
      return <BsCloudSun className="text-yellow-500 text-6xl" />;
    } else if (conditions.includes("Overcast")) {
      return <BsCloudsFill className="text-gray-400 text-6xl" />;
    } else {
      return <IoIosSunny className="text-yellow-400 text-6xl" />;
    }
  };

  const formattedData = weatherData.days.slice(0, 7).map((day) => ({
    day: new Date(day.datetime).toLocaleDateString("it-IT", {
      weekday: "short",
    }),
    icon: getWeatherIcon(day.conditions || "Clear"),
    min_t: `${Math.round(day.tempmin)}°C`,
    max_t: `${Math.round(day.tempmax)}°C`,
  }));

  return (
    <Swiper
      spaceBetween={20}
      breakpoints={{
        320: {
          slidesPerView: 2, // Smartphone
        },
        640: {
          slidesPerView: 3, // Tablet piccoli
        },
        1024: {
          slidesPerView: 4, // Laptop
        },
        1440: {
          slidesPerView: 5, // Desktop grandi
        },
      }}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
      className="cursor-grab active:cursor-grabbing"
    >
      {formattedData.map((data, index) => (
        <SwiperSlide key={index} className="swiper-slide">
          <Card
            day={data.day}
            icon={data.icon}
            min_t={data.min_t}
            max_t={data.max_t}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

export default Carousel;
