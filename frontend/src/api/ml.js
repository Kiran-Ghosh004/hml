import axios from "axios";

export async function getPrediction(payload) {
  const res = await axios.post("http://127.0.0.1:8000/predict", payload);
  return res.data;
}
