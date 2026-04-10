/**
 * Coffee shop card component
 * Displays individual coffee shop information with favorite and details buttons
 * Manages favorite functionality and modal interaction
 */

import { saveFavorite, removeFavorite, isFavorite } from "../storage.js";

/**
 * Creates HTML for a coffee shop card
 * @param {Object} place - Coffee shop data object
 * @returns {String} HTML string for the card
 */
export function createCoffeeCard(place) {
  const cardHTML = `
    <div class="coffee-card" data-place-id="${place.id}">
      <!-- Coffee shop image placeholder -->
      <div class="coffee-card-image">
        <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="150" fill="#e8e8e8"/>
          <circle cx="100" cy="75" r="40" fill="#8b6f47"/>
        </svg>
      </div>

      <!-- Card content section -->
      <div class="coffee-card-content">
        <h3 class="coffee-card-title">${place.name}</h3>
        <p class="coffee-card-address">${place.address}</p>

        <!-- Rating and distance display -->
        <div class="coffee-card-meta">
          <div class="rating">
            <span class="stars">⭐⭐⭐⭐⭐</span>
            <span class="distance">📍 2.5 km</span>
          </div>
        </div>

        <!-- Action buttons for user interaction -->
        <div class="coffee-card-actions">
          <button class="btn-favorite" data-place-id="${place.id}">
            ${isFavorite(place.id) ? "❤️ SAVED" : "🤍 SAVE TO FAVORITES"}
          </button>
          <button class="btn-details" data-place-id="${place.id}">
            ℹ️ DETAILS
          </button>
        </div>
      </div>
    </div>
  `;

  return cardHTML;
}

/**
 * Setup event listeners for coffee card buttons
 * Handles favorite toggling and details modal display
 * @param {Array} places - Array of coffee shop objects
 */
export function setupCardListeners(places) {
  // Handle favorite button clicks
  document.querySelectorAll(".btn-favorite").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const placeId = e.target.dataset.placeId;
      const place = places.find(p => p.id === placeId);

      if (isFavorite(placeId)) {
        removeFavorite(placeId);
        e.target.textContent = "🤍 SAVE TO FAVORITES";
      } else {
        saveFavorite(place);
        e.target.textContent = "❤️ SAVED";
      }
    });
  });

  // Handle details button clicks to open modal
  document.querySelectorAll(".btn-details").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const placeId = e.target.dataset.placeId;
      const place = places.find(p => p.id === placeId);
      showPlaceModal(place);
    });
  });
}

/**
 * Display coffee shop details in modal
 * @param {Object} place - Coffee shop data object
 */
function showPlaceModal(place) {
  const modal = document.getElementById("modal");
  const modalBody = document.getElementById("modal-body");

  modalBody.innerHTML = `
    <div class="modal-header">
      <h2>${place.name}</h2>
    </div>
    <div class="modal-body">
      <p><strong>Address:</strong> ${place.address}</p>
      <p><strong>Amenities:</strong></p>
      <ul>
        <li>📍 Good for work</li>
        <li>📶 Fast WiFi</li>
        <li>🔌 Power outlets</li>
        <li>🤫 Quiet environment</li>
      </ul>
    </div>
  `;

  modal.classList.remove("hidden");
}

// Close modal when close button is clicked
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("modal-close")) {
    document.getElementById("modal").classList.add("hidden");
  }
});