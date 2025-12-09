import { useEffect, useState } from "react";
import Layout from "./Layout";
import DataCard from "../components/DataCard";
import { getWeather } from "../api/weather";
import { getPrediction } from "../api/ml";

export default function AutoMode() {
  const [data, setData] = useState(null);

  async function autoCheck() {
    const weather = await getWeather();

    const payload = {
      features: {
        soil_moisture: 20,
        temperature: weather.temperature,
        humidity: weather.humidity,
        rain_prediction: weather.rain_prediction,
        last_irrigation_hours_ago: 40
      }
    };

    const result = await getPrediction(payload);

    setData({ weather, result });
  }

  useEffect(() => {
    autoCheck();

    const interval = setInterval(() => {
      autoCheck();
    }, 14400000); // 4 hours in ms

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Automatic Mode 🤖</h1>

      {data && (
        <div className="grid grid-cols-2 gap-4">
          <DataCard title="Temperature" value={data.weather.temperature} unit="°C" />
          <DataCard title="Humidity" value={data.weather.humidity} unit="%" />
          <DataCard title="Rain Probability" value={data.weather.rain_prediction} unit="" />
          <DataCard title="ML Decision" value={data.result.decision} unit="" />
        </div>
      )}

      {!data && <p className="text-gray-400 mt-4">Loading...</p>}
    </Layout>
  );
}
