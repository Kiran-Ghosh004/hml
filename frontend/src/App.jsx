import { BrowserRouter, Routes, Route } from "react-router-dom";
import ManualMode from "./pages/ManualMode";
import AutoMode from "./pages/AutoMode";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/manual" element={<ManualMode />} />
        <Route path="/auto" element={<AutoMode />} />
        <Route path="*" element={<ManualMode />} />
      </Routes>
    </BrowserRouter>
  );
}
