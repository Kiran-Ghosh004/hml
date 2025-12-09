import { useState } from "react";
import Layout from "./Layout";
import DataCard from "../components/DataCard";
import { getWeather } from "../api/weather";
import { getPrediction } from "../api/ml";

export default function ManualMode() {
  const [soil, setSoil] = useState("");
  const [data, setData] = useState(null);

  async function handlePredict() {
    const weather = await getWeather();

    const payload = {
      features: {
        soil_moisture: Number(soil),
        temperature: weather.temperature,
        humidity: weather.humidity,
        rain_prediction: weather.rain_prediction,
        last_irrigation_hours_ago: 40
      }
    };

    const result = await getPrediction(payload);

    setData({ weather, result });
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-6">Manual Mode 🌱</h1>

      <input
        className="p-3 w-full rounded-xl text-black mb-4"
        type="number"
        placeholder="Enter Soil Moisture"
        value={soil}
        onChange={(e) => setSoil(e.target.value)}
      />

      <button 
        onClick={handlePredict}
        className="bg-blue-600 px-6 py-3 rounded-xl hover:bg-blue-700"
      >
        Predict Irrigation
      </button>

      {data && (
        <div className="mt-6 space-y-4">

          <h2 className="text-xl font-semibold text-green-400">
            {data.result.decision === 1 
              ? "Irrigation Needed 💧" 
              : "Irrigation Not Needed 🌤️"}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <DataCard title="Temperature" value={data.weather.temperature} unit="°C" />
            <DataCard title="Humidity" value={data.weather.humidity} unit="%" />
            <DataCard title="Rain Probability" value={data.weather.rain_prediction} unit="" />
            <DataCard title="Soil Moisture" value={soil} unit="" />
          </div>

          <button className="bg-green-600 px-6 py-3 rounded-xl hover:bg-green-700 mt-6">
            Start Irrigation
          </button>
        </div>
      )}

    </Layout>
  );
}
