import { saveFavorite } from "./storage.js";

export function renderPlaces(places) {
  const container = document.getElementById("results");
  container.innerHTML = "";

  const template = document.getElementById("place-template");

  places.forEach(place => {
    const clone = template.content.cloneNode(true);

    // 👇 DEBUG (déjalo mientras pruebas)
    console.log("🧩 Place:", place);

    clone.querySelector(".place-name").textContent =
      place.name || "No name";

    clone.querySelector(".place-address").textContent =
      place.address ||
      place.formatted ||
      "Dirección no disponible";

    const btn = clone.querySelector(".favorite-btn");

    btn.addEventListener("click", () => {
      saveFavorite(place);
      btn.textContent = "✅ Saved";
    });

    container.appendChild(clone);
  });
}