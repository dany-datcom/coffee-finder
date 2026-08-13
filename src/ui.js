/**
 * @file ui.js 
 * @module ui
 * @description UI rendering functions for the Coffee Finder application. 
 * Manages dynamic rendering of place cards, loading skeletons, and empty states.
 */

import { createSkeletonCards } from "./components/skeletonCards.js";
import { initializeIcons } from "./icons/icons.js";
import { createCoffeeCard } from "./components/CoffeeCard.js";

/**
 * Remove rendered cards and empty states from the results container. 
 * while keeping any active loader or skeleton elements intact.
 * 
 * @param {HTMLElement} container - The DOM container element holding search results.
 * @returns {void}
*/
function clearResults(container) {
  if (!container) {
    console.warn("⚠️ Results container not found");
    return;
  }

  container
    .querySelectorAll(".place-card")
    .forEach(card => {
      card.remove();
    });

  const emptyState = container.querySelector(".empty-state");

  if(emptyState){
    emptyState.remove();
  }
}

/**
 * Render a fallback "empty state" message inside the results container
 * when no coffee shops match the search criteria.
 * 
 * @param {HTMLElement} container - The DOM container element where the message will be appended.
 * @returns {void}
 */
function renderEmptyState(container){
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
 * Displays animated skeleton cards in the results container while data is being fetched.
 * Replaces any existing results prior to rendering.
 * 
 * @param {number} [count=3] - Number of skeleton placeholder cards to render.
 * @returns {void}
 */
export function renderSkeletonCards(count = 3) {
  const container = document.getElementById("results");

  if (!container) {
    return;
  }

  clearResults(container);

  container.insertAdjacentHTML(
    "beforeend",
    createSkeletonCards(count)
  );
}

/**
 * Renders a list of coffee shop cards into the UI container.
 * Clears previous results, handles empty state fallbacks, and optimizes 
 * DOM insertion performance using a DocumentFragment.
 * 
 * @param {Array<Object>|null} places - List of coffee shop data objects to display.
 * @returns {void}
 */
export function renderPlaces(places){
  const container = document.getElementById("results");

  if(!container){
    console.error("❌ Results container missing");
    return;
  }

  clearResults(container);

  if(!places || places.length === 0){
    renderEmptyState(container);
    return;
  }

  const template = document.getElementById("place-template");

  if(!template){
    console.error("❌ Card template missing");
    return;
  }

  const fragment = document.createDocumentFragment();

  places.forEach(place => {
    const card = createCoffeeCard(template, place);
    fragment.appendChild(card);
  });

  container.appendChild(fragment);

  initializeIcons();
}

/**
 * Updates the map status panel with the current location name and results count.
 * Handles fallbacks for missing location data and dynamically formats plural labels.
 * 
 * @param {Object|null} location - Object containing optional `city` and `state` properties.
 * @param {number} total - Total count of coffee shops discovered.
 * @returns {void}
 */
export function updateMapStatus(location,total){
  const locationText = document.querySelector(".map-location");
  const resultsText = document.querySelector(".map-results");

  if(locationText){
    if(location){
      locationText.textContent = `${location.city ?? ""} ${location.state ?? ""}`;
    }else{
      locationText.textContent = "Unknown location";
    }
  }

  if(resultsText){
    resultsText.textContent = `${total} Coffee shop${total !== 1 ? "s" : ""} found`;
  }
}
