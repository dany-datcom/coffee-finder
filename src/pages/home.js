/**
 * @file home.js - Home Page Controller (Find Coffee).
 * @description Orchestrates the main view logic. Handles user location acquisition,
 * geocoding searches, sorting interactions, and synchronizes data between the API,
 * the global app state, and the UI rendering modules.
 * @module views/home
 */

import { 
  geocodeCity, 
  getUserLocation, 
  reverseGeocode
} from "../api.js";

import { 
  setUserLocation, 
  getPlace, 
  setCurrentSort, 
  getCurrentSort, 
  setLoadingState,
  isLoading
} from "../state/appState.js";

import { createHero } from "../components/hero.js";
import { renderPlaces } from "../ui.js";

import { sortPlaces } from "../utils/sorting.js";
import { setLoadingUI } from "../utils/loading.js";

/**
 * Sets up the event listener for the UI sort selector element.
 * Synchronizes selected sort criteria with global state, re-sorts current places,
 * and updates the DOM grid view.
 * 
 * @function setupSorting
 * @module controllers/sorting
 * @returns {void}
 */
function setupSorting() {
  const select = document.getElementById("sort-select");
  if (!select) return;

  select.addEventListener("change", () => {
    const selectedSort = select.value;

    setCurrentSort(selectedSort);

    const places = getPlace();

    const sorted = sortPlaces(places, getCurrentSort());

    renderPlaces(sorted);
  });
}

/**
 * Generates the Home page HTML template string.
 * Keeps structural markup separate from application logic and defines
 * the reusable HTML5 <template> for place cards.
 * 
 * @function createHomeTemplate
 * @module templates/home
 * @returns {string} Multiline HTML layout template.
 */
function createHomeTemplate() {
  return `
  <main class="home">
    ${createHero()}
    
    <section class="explore-layout">
      <!-- Left Column: Search results grid controls -->
      <section class="results-container">
        <div class="results-toolbar">
          <label for="sort-select">Sort by:</label>
          <div id="sort-select-wrapper">
            <select id="sort-select">
              <option value="distance">Nearest</option>
              <option value="farthest">Farthest</option>
              <option value="name">Name (A-Z)</option>
            </select>
            <i data-lucide="chevron-down" class="sort-icon"></i>
          </div>
        </div>

        <div id="results" class="results-grid">
          <div id="loader" class="loader hidden">
            <div class="loader-spinner"></div>
            <p class="loader-text">Searching coffee Shops...</p>
          </div>
        </div>
      </section>

      <!-- Right Column: Interactive Map view -->
      <aside class="map-panel">
        <div class="map-header">
          <h2 class="map-title">
            <i class="title-icon" data-lucide="map"></i>
            Coffee Map
          </h2>
          <p>Explore nearby coffee shops</p>
          <div class="map-stats">
            <span class="map-location">Current Location</span>
            <span class="map-results">0 Coffee Shops</span>
          </div>
        </div>

        <div id="map" class="map-container"></div>
      </aside>
    </section>
  </main>

  <!-- Reusable HTML5 Card Template -->
  <template id="place-template">
    <article class="place-card">
      <div class="place-card-header">
        <h3 class="place-name"></h3>
        <button class="favorite-btn" aria-label="Favorite">
          <i class="icon" data-lucide="heart"></i>
        </button>
      </div>

      <p class="place-address"></p>

      <div class="place-tags">
        <span class="place-tag">
          <i class="tag-icon" data-lucide="coffee"></i> Coffee Shop
        </span>
        <span class="place-tag location-tag">
          <i class="tag-icon" data-lucide="map-pin"></i>
          <span class="location-text">Location</span>
        </span>
      </div>

      <div class="place-meta">
        <span class="meta-item distance-tag">
          <i class="meta-icon" data-lucide="map-pin"></i>
          <span class="distance-value"></span>
        </span>

        <span class="meta-item travel-time">
          <i class="meta-icon" data-lucide="footprints"></i>
          <span class="travel-time-value"></span>
        </span>

        <span class="meta-item">
          <i class="meta-icon" data-lucide="navigation"></i> Google Maps
        </span>
      </div>

      <div class="action-bar-container"></div>
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
  setupSorting();

  // Initialize Google Map
  const { createMap,centerMapOnCity } = await import("../map.js");
  createMap();

  try {
    const coordinates = await getUserLocation();
    setUserLocation(coordinates);

    const location = await reverseGeocode(
      coordinates.lat, 
      coordinates.lng
    );
    
    centerMapOnCity(
      location.lat, 
      location.lng
    );
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

  if (isLoading()) {
    return;
  }

  const input = document.getElementById("search-input");
  const query = input.value.trim();

  if (!query) {
    return;
  }

  console.log("🔎 Searching for:", query);

  setLoadingState(true);
  setLoadingUI(true);

  try {

    // Geocode city name to get coordinates
    const cityCoords = await geocodeCity(query);

    if (!cityCoords) {
      alert("❌ City not found");
      return;
    }

    // Center map on the found city
    const { centerMapOnCity: centerMap } = await import("../map.js");

    centerMap(
      cityCoords.lat,
      cityCoords.lng,
      13
    );

    input.value = "";

  } catch (error) {

    console.error("❌ Error:", error);

  } finally {

    setLoadingUI(false);
    setLoadingState(false);

  }
}

