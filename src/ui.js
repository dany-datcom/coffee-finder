/**
 * User Interface rendering functions
 * Handles dynamic rendering of coffee shop cards
 * Displays loading states and empty states
 */
import { focusPlace,highlightMarker } from "./map.js";
import { saveFavorite } from "./storage.js";
import { initializeIcons } from "./icons/icons.js";
import { getUserLocation } from "./state/appState.js";
import { formatDistance } from "./utils/distance.js";
import { formatTravelTime } from "./utils/travelTime.js";

/**
 * Remove all rendered cards and empty state
 * Keeps the loader element intact
 * @param {HTMLElement} container
 */
function clearResults(container) {
  
  const oldCards = container.querySelectorAll(".place-card");
  oldCards.forEach(card => card.remove());

  const emptyState = container.querySelector(".empty-state");
  if (emptyState) {
    emptyState.remove();
  }

}

/**
 * Display empty state when no coffee shops are found
 * @param {HTMLElement} container
 */

function renderEmptyState(container) {
  container.insertAdjacentHTML(
    "beforeend",
    `
      <div class="empty-state">
        <div class="empty-icon">☕</div>
        <h3>No coffee shops found</h3>
        <p>
          Try another location, move the map,
          or zoom out to discover more places.
        </p>
      </div>
    `
  );
}

/**
 * Setup favorite button behavior
 * @param {DocumentFragment} clone
 * @param {Object} place
 */
function setupFavoriteButton(clone, place) {
  const button = clone.querySelector(".favorite-btn");
  
  button.textContent = "♡";
  
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    saveFavorite(place);
    button.textContent = "♥";
    button.disabled = true;
    button.classList.add("saved");
  });
}

function setupDirectionButton(clone, place) {
  const button = clone.querySelector(".direction-btn");
  
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    const lat = place.geocodes.main.latitude;
    const lng = place.geocodes.main.longitude;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, 
    "_blank");
  });
}

/**
 * Get simplified location from full address
 * @param {Object} place
 * @returns {string}
 */

function getLocation(place) {
  return place.address?.split(",").at(-1)?.trim() || "Costa Rica";
}

/**
 * Create a coffee shop card from template
 * @param {HTMLTemplateElement} template
 * @param {Object} place
 * @returns {DocumentFragment}
 */
function createPlaceCard(template, place) {
  const clone = template.content.cloneNode(true);

  const card = clone.querySelector(".place-card");
  card.dataset.place = place.name;

  card.addEventListener("click", () => {
    focusPlace(place);
  });

  card.addEventListener("click", () => {
    highlightMarker(place.name);
  });

  clone.querySelector(".place-name").textContent = place.name;

  clone.querySelector(".place-address").textContent =
  place.address || "Address not available";

  clone.querySelector(".location-tag").textContent =
  `📍 ${getLocation(place)}`;

  setupFavoriteButton(clone, place);
    card.addEventListener("click", async () => {
    activateCard(card);
    focusPlace(place);
  });

  const distance = clone.querySelector(".distance-value");
  if (distance && place.distance) {  
    distance.textContent = ` ${formatDistance(place.distance)}`;
  }

  const walking = clone.querySelector(".travel-time-value");
  if (walking && place.walkingTime) {
    walking.textContent = ` ${formatTravelTime(place.walkingTime)}`;
  }

  

  setupDirectionButton(clone, place);

  return clone;
}

function activateCard(card) {
  document
  .querySelectorAll(".place-card")
  .forEach(item => item.classList.remove("active-card")); 
  card.classList.add("active-card");
}

/**
 * Render coffee shop cards
 * @param {Array} places
 */
export function renderPlaces(places) {
  const container = document.getElementById("results");
  console.log(getUserLocation());
  clearResults(container);

  if (!places || places.length === 0) {
    renderEmptyState(container);
  return;
  }

  const template = document.getElementById("place-template");

  const userLocation = getUserLocation();

  places.forEach(place => {

    
    const card = createPlaceCard(template, place);
    container.appendChild(card);
  });

  console.log(`✅ ${places.length} cards rendered`);

  initializeIcons();
}

export function updateMapStatus(location, total) {
  const locationText = document.querySelector(".map-location");
  const resultsText = document.querySelector(".map-results");

  if (locationText) {
    locationText.textContent = `📍 ${location}`;
  }
  if (resultsText) {
    resultsText.textContent = `${total} Coffee shops found`;
  }
}

export function highlightPlace(placeName) {
  document
  .querySelectorAll(".place-card")
  .forEach(card => card.classList.remove("active-card"));
  const card = document.querySelector(
    `[data-place="${placeName}"]`
    );
    
  if (!card) return;
  card.classList.add("active-card");
  card.scrollIntoView({ behavior: "smooth", block: "center" });
}