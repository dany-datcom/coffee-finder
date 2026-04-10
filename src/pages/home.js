/**
 * Home page component (Find Coffee)
 * Displays search functionality, coffee cards grid, and interactive map
 * Handles location search, geocoding, and dynamic coffee shop loading
 */

import { createCoffeeCard, setupCardListeners } from "../components/coffee-card.js";
import { geocodeCity, searchPlacesByBounds } from "../api.js";
import { centerMapOnCity } from "../map.js";

/**
 * Render home page with search bar, cards grid, and map
 */
export async function renderHomePage() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="home-container">
      <!-- Search section for location input -->
      <div class="search-section">
        <form id="search-form" class="search-form">
          <input 
            type="text" 
            id="search-input" 
            placeholder="ENTER LOCATION" 
            class="search-input"
            required 
          />
          <button type="submit" class="btn-search">🔍</button>
        </form>
      </div>

      <div class="home-content">
        <!-- Center: Coffee cards grid with loader -->
        <section class="cards-container">
          <div id="results" class="results-grid">
            <div id="loader" class="loader hidden"></div>
          </div>
        </section>

        <!-- Right: Interactive Google Map -->
        <section id="map" class="map-container"></section>
      </div>
    </div>

    <!-- Template for dynamically generating coffee cards -->
    <template id="place-template">
      <div class="place-card">
        <h3 class="place-name"></h3>
        <p class="place-address"></p>
        <button class="favorite-btn">⭐ Save</button>
      </div>
    </template>
  `;

  // Initialize search form
  setupSearch();

  // Initialize Google Map
  const { createMap } = await import("../map.js");
  createMap();

  // Load initial coffee shops for San Jose
  await loadInitialCoffees();
}

/**
 * Setup search form submit handler
 * Geocodes city input and centers map on that location
 */
function setupSearch() {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const query = input.value.trim();
    if (!query) return;

    console.log("🔎 Searching for:", query);

    try {
      showLoader();

      // Geocode city name to get coordinates
      const cityCoords = await geocodeCity(query);
      if (!cityCoords) {
        alert("❌ City not found");
        hideLoader();
        return;
      }

      // Center map on the found city
      const { centerMapOnCity: centerMap } = await import("../map.js");
      centerMap(cityCoords.lat, cityCoords.lng, 13);

      input.value = "";
    } catch (error) {
      console.error("❌ Error:", error);
    } finally {
      hideLoader();
    }
  });
}

/**
 * Load initial coffee shops for San Jose on app start
 */
async function loadInitialCoffees() {
  try {
    showLoader();
    const { searchPlaces } = await import("../api.js");
    const places = await searchPlaces("San Jose");

    const { renderPlaces } = await import("../ui.js");
    renderPlaces(places);

    const { addMarkers } = await import("../map.js");
    addMarkers(places);
  } catch (error) {
    console.error("❌ Error loading coffees:", error);
  } finally {
    hideLoader();
  }
}

/**
 * Show loading spinner
 */
function showLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.classList.remove("hidden");
}

/**
 * Hide loading spinner
 */
function hideLoader() {
  const loader = document.getElementById("loader");
  if (loader) loader.classList.add("hidden");
}