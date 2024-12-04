import React from "react";
import "./Chart.css";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useCity } from "../contexts/CityContext";

function CustomizedLabel(props) {
  const { x, y, value } = props;
  return (
    <text
      x={x}
      y={y}
      dy={-10}
      fill="#004AAD"
      fontSize={12}
      fontWeight="light"
      textAnchor="middle"
    >
      {value}°C
    </text>
  );
}

function Chart() {
  const { weatherData, error, loading, setHour } = useCity();

  if (error) {
    return (
      <p className="text-red-600 font-bold">
        Errore nel caricamento dei dati meteo: {error}
      </p>
    );
  }

  if (loading) {
    return <div></div>;
  }

  const data =
    weatherData?.days?.[0]?.hours.map((hour) => ({
      name: hour.datetime.split(":").slice(0, 2).join(":"),
      "°C": Math.round(hour.temp),
      day: hour.datetime.split(" ")[0],
    })) || [];

  const handleClick = (e) => {
    if (e && e.activeLabel) {
      console.log("Orario selezionato:", e.activeLabel);
      setHour(e.activeLabel);
    }
  };

  return (
    <div className="chart-container my-5">
      <div className="chart-scroll px-3">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
            onClick={handleClick}
            style={{ cursor: "pointer" }}
          >
            <Line
              type="monotone"
              dataKey="°C"
              stroke="#004AAD"
              strokeWidth={4}
              label={<CustomizedLabel />}
            />
            <XAxis dataKey="name" />
            <Tooltip />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default Chart;
