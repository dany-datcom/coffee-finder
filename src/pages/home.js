/**
 * Home page component (Find Coffee)
 * Displays search functionality, coffee cards grid, and interactive map
 * Handles location search, geocoding, and dynamic coffee shop loading
 */

import { setLoading } from "../utils/loading.js";
import { geocodeCity} from "../api.js";

/**
 * Create Home page HTML template
 * Keeps page structure separated from application logic
 * @returns {String} Home page HTML
 */
function createHomeTemplate() {
  return `
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

/**
 * Load initial coffee shops for San Jose on app start
 */
async function loadInitialCoffees() {
  try {
    setLoading(true);
    const { searchPlaces } = await import("../api.js");
    const places = await searchPlaces("San Jose");

    const { renderPlaces } = await import("../ui.js");
    renderPlaces(places);

    const { addMarkers } = await import("../map.js");
    addMarkers(places);
  } catch (error) {
    console.error("❌ Error loading coffees:", error);
  } finally {
    setLoading(false);
  }
}
