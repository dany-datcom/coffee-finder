/**
 * Home page component (Find Coffee)
 * Displays search functionality, coffee cards grid, and interactive map
 * Handles location search, geocoding, and dynamic coffee shop loading
 */

import { setLoading } from "../utils/loading.js";
import { geocodeCity, getCurrentLocation} from "../api.js";
import { createHero } from "../components/hero.js";

/**
 * Create Home page HTML template
 * Keeps page structure separated from application logic
 * @returns {String} Home page HTML
 */
function createHomeTemplate() {
  return `
  <main class="home">
  ${createHero()}

  <section class="explore-layout">

    <section class="results-container">

      <div id="results" class="results-grid">

        <div id="loader" class="loader hidden"></div>

      </div>

    </section>

    <aside class="map-panel">
      <div class="map-header">
        <h2>🗺 Coffee Map</h2>
        <p>Explore nearby coffee shops</p>
        <div class="map-stats">
          <span id="results-count">0 coffees</span>
          <span id="current-location"> in current location</span>
        </div>
      </div>

      <div 
        id="map" 
        class="map-container">
      </div>
    </aside>

  </section>

</main>

<template id="place-template">
  <article class="place-card">

    <div class="place-status">
        Coffee Shop
    </div>

    <div class="place-card-header">

        <h3 class="place-name"></h3>

        <button
            class="favorite-btn"
            aria-label="Save favorite">
            ♡
        </button>

    </div>

    <p class="place-address"></p>

    <div class="place-tags">

        <span class="place-tag">
            ☕ Coffee Shop
        </span>

        <span class="place-tag location-tag">
            📍 Costa Rica
        </span>

    </div>

    <div class="place-meta">

        <span class="meta-item">
            📍 Verified Location
        </span>

        <span class="meta-item">
            🗺 Google Maps
        </span>

    </div>

    <div class="place-actions">

        <button class="direction-btn">
            🧭 Directions
        </button>

        <button class="share-btn">
            📤 Share
        </button>

    </div>

</article>
</template>
`;
}

/**
 * Render home page with search bar, cards grid, and map
 */
export async function renderHomePage() {
  const app = document.getElementById("app");

  app.innerHTML = createHomeTemplate();

  // Initialize search form
  setupSearch();

  // Initialize Google Map
  const { createMap,centerMapOnCity } = await import("../map.js");
  createMap();

  try {
    const location = await getCurrentLocation();
    console.log("📍 User location:", location);
    centerMapOnCity(location.lat, location.lng);
  } catch (error){
    console.warn("Location not available:", error.message);
  }
  
}

/**
 * Setup search form submit handler
 * Geocodes city input and centers map on that location
 */
function setupSearch() {
  const form = document.getElementById("search-form");
  
  form.addEventListener("submit", handleSearch); 
}

async function handleSearch(e) {
  e.preventDefault();
  const input = document.getElementById("search-input");
  const query = input.value.trim();
    if (!query) return;
      console.log("🔎 Searching for:", query);
    try {
      setLoading(true);
      // Geocode city name to get coordinates
      const cityCoords = await geocodeCity(query);
        if (!cityCoords) {
          alert("❌ City not found");
        return;
      }

      // Center map on the found city
      const { centerMapOnCity: centerMap } = await import("../map.js");
      centerMap(cityCoords.lat, cityCoords.lng, 13);

      input.value = "";
    } catch (error) {
      console.error("❌ Error:", error);
    } finally {
      setLoading(false);
    }
  
}

