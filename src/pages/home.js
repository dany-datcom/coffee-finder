/**
 * Home page component (Find Coffee)
 * Displays search functionality, coffee cards grid, and interactive map
 * Handles location search, geocoding, and dynamic coffee shop loading
 */

import { setLoading } from "../utils/loading.js";
import { geocodeCity, getCurrentLocation} from "../api.js";

/**
 * Create Home page HTML template
 * Keeps page structure separated from application logic
 * @returns {String} Home page HTML
 */
function createHomeTemplate() {
return `
<main class="home">

  <section class="hero">

    <div class="hero-content">

      <span class="hero-badge">
        ☕ Find your perfect workspace
      </span>

      <h1 class="hero-title">
        Find your next place to work,
        study and enjoy great coffee.
      </h1>

      <p class="hero-description">
        Discover cafés loved by developers,
        students, freelancers and digital nomads.
      </p>

      <form id="search-form" class="search-form">

      <div class="search-wrapper">

      <span class="search-icon">
      🔍
      </span>

    <input
      id="search-input"
      class="search-input"
      type="text"
      placeholder="Search by city..."
      required
    />

  </div>

  <button
    class="search-button"
    type="submit"
  >
    Explore
  </button>

</form>

    </div>

  </section>

  <section class="explore-layout">

    <section class="results-container">

      <div id="results" class="results-grid">

        <div id="loader" class="loader hidden"></div>

      </div>

    </section>

    <aside
      id="map"
      class="map-container"
    >
    </aside>

  </section>

</main>

<template id="place-template">
  <article class="place-card">

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

  // Load initial coffee shops for San Jose
  
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

