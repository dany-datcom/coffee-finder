/**
 * User Interface rendering functions
 * Handles dynamic rendering of coffee shop cards
 * Displays loading states and empty states
 */

import { saveFavorite } from "./storage.js";

/**
 * Render coffee shop cards to results container
 * Displays empty state if no results
 * Applies fade-in animation to cards
 * @param {Array} places - Array of coffee shop objects
 */
export function renderPlaces(places) {
  const container = document.getElementById("results");

  // Clear existing cards but preserve loader
  const oldCards = container.querySelectorAll(".place-card");
  oldCards.forEach(card => card.remove());

  // Display empty state if no results found
  if (!places || places.length === 0) {
    container.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #666;">
        <p>😢 No coffee shops found. Try a different search!</p>
      </div>
    `;
    return;
  }

  const template = document.getElementById("place-template");

  // Generate card for each coffee shop
  places.forEach((place, index) => {
    // Validate place data
    if (!place.name || !place.geocodes?.main) {
      console.warn(`⚠️ Incomplete place data at index ${index}:`, place);
      return;
    }

    // Clone template
    const clone = template.content.cloneNode(true);

    // Populate card data
    clone.querySelector(".place-name").textContent = place.name;

    const address = place.address || "Address not available";
    clone.querySelector(".place-address").textContent = address;

    // Setup favorite button
    const btn = clone.querySelector(".favorite-btn");

    btn.addEventListener("click", () => {
      saveFavorite(place);
      btn.textContent = "✅ Saved";
      btn.disabled = true;
      btn.style.opacity = "0.6";
    });

    // Add card to container
    container.appendChild(clone);
  });

  console.log(`✅ ${places.length} cards rendered`);
}