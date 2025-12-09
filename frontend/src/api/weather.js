import axios from "axios";

const API_KEY = import.meta.env.VITE_WEATHERAPI_KEY;

export async function getWeather(lat = 12.9716, lon = 77.5946) {
  const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${lat},${lon}&days=1&aqi=no&alerts=no`;
  const res = await axios.get(url);
  const data = res.data;

  return {
    temperature: data.current.temp_c,
    humidity: data.current.humidity,
    rain_prediction: data.forecast.forecastday[0].day.daily_chance_of_rain / 100.0  // convert % to probability 0–1
  };
}
