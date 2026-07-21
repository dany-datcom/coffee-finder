/**
 * User Interface rendering functions
 * Handles dynamic rendering of coffee shop cards
 * Displays loading states and empty states
 */

import { saveFavorite } from "./storage.js";

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
        <h3>No coffee shops found</h3>
        <p>Try searching another location.</p>
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

  // Estado inicial
  button.textContent = "♡";

  button.addEventListener("click", () => {
    saveFavorite(place);

    button.textContent = "♥";
    button.disabled = true;
    button.style.opacity = "0.6";
  });
}

/**
 * Create a coffee shop card from template
 * @param {HTMLTemplateElement} template
 * @param {Object} place
 * @returns {DocumentFragment}
 */
function createPlaceCard(template, place) {
  const clone = template.content.cloneNode(true);

  clone.querySelector(".place-name").textContent = place.name;

  clone.querySelector(".place-address").textContent =
    place.address || "Address not available";

  const location =
    place.address?.split(",").at(-1)?.trim() || "Costa Rica";

  clone.querySelector(".location-tag").textContent =
    `📍 ${location}`;

  setupFavoriteButton(clone, place);

  return clone;
}

/**
 * Render coffee shop cards
 * @param {Array} places
 */
export function renderPlaces(places) {
  const container = document.getElementById("results");

  clearResults(container);

  if (!places || places.length === 0) {
    renderEmptyState(container);
    return;
  }

  const template = document.getElementById("place-template");

  places.forEach(place => {
    const card = createPlaceCard(template, place);
    container.appendChild(card);
  });

  console.log(`✅ ${places.length} cards rendered`);
}