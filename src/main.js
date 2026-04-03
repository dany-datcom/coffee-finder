import { createMap, addMarkers } from "./map.js";
import { searchPlaces } from "./api.js";
import { renderPlaces } from "./ui.js";

async function loadApp() {
  if (!window.google) {
    console.error("Google Maps no cargó aún");
    return;
  }

  createMap();

  // 🔥 Carga inicial
  const places = await searchPlaces("San Jose");
  console.log("Places:", places);

  renderPlaces(places);
  addMarkers(places);
}

// 🔍 BUSCADOR DINÁMICO (esto te faltaba)
function setupSearch() {
  const form = document.getElementById("search-form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const input = document.getElementById("search-input");
    const query = input.value.trim();

    if (!query) return;

    console.log("🔎 Buscando:", query);

    const places = await searchPlaces(query);

    console.log("📍 Resultados:", places);

    renderPlaces(places);
    addMarkers(places);
  });
}

// 🚀 INIT
window.addEventListener("load", () => {
  loadApp();
  setupSearch();
});