import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "swiper/css";
import "swiper/css/pagination";
import "./global.css";

const el = document.getElementById("root");
if (!el) {
  throw new Error("Элемент #root не найден");
}

createRoot(el).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
