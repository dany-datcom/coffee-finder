/**
 * @file favorites.js - Favorites Page Controller.
 * @description Renders saved coffee shops grid with full interactive actions (Directions, Share, Remove).
 * @module pages/favorites
 */

import { getFavorites, removeFavorite } from "../storage.js";
import { sharePlace } from "../services/shareService.js";

/**
 * Creates the HTML markup for an individual favorite coffee shop card.
 * Includes Directions, Share, and Remove quick action buttons.
 * 
 * @param {Object} fav - Coffee shop data object
 * @returns {string} HTML markup string
 */
function createFavoriteCardTemplate(fav) {
  const imageUrl =
    fav.image ||
    fav.photoUrl ||
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&q=80&w=600";
  const rating = fav.rating ? Number(fav.rating).toFixed(1) : "4.5";

  return `
    <article class="coffee-card favorite-card" data-id="${fav.id}">
      <div class="card-image-wrapper">
        <img src="${imageUrl}" alt="${fav.name}" loading="lazy" class="card-image" />
        <span class="rating-badge">
          <i data-lucide="star" class="star-icon"></i> ${rating}
        </span>
      </div>
      <div class="card-body">
        <h3 class="card-title">${fav.name}</h3>
        <p class="card-address">
          <i data-lucide="map-pin"></i> ${fav.address || "Address unavailable"}
        </p>
        
        <div class="card-actions">
          <!-- Button: How to get there -->
          <button class="btn btn-outline btn-directions" data-id="${fav.id}" aria-label="Open directions">
            <i data-lucide="navigation"></i> Directions
          </button>

          <!-- Button: Share place -->
          <button class="btn btn-outline btn-share" data-id="${fav.id}" aria-label="Share coffee shop">
            <i data-lucide="share-2"></i> Share
          </button>

          <!-- Button: Remove from favorites -->
          <button class="btn btn-danger btn-remove" data-id="${fav.id}" aria-label="Remove favorite">
            <i data-lucide="trash-2"></i> Remove
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Attaches event listeners using Event Delegation on the favorites container.
 * Handles Directions, Share, and Remove actions efficiently in a single listener.
 * 
 * @function setupFavoritesEvents
 * @returns {void}
 */
function setupFavoritesEvents() {
  const container = document.getElementById("favorites-grid");
  if (!container) return;

  container.addEventListener("click", async (e) => {
    const card = e.target.closest(".favorite-card");
    if (!card) return;

    const placeId = card.dataset.id;
    const favorites = getFavorites();
    const place = favorites.find((f) => String(f.id) === String(placeId));

    if (!place) return;

    // 1. Handle REMOVE Action
    const removeBtn = e.target.closest(".btn-remove");
    if (removeBtn) {
      removeFavorite(placeId);
      renderFavoritesPage(); // Refresh list / show empty state
      return;
    }

    // 2. Handle DIRECTIONS Action
    const directionsBtn = e.target.closest(".btn-directions");
    if (directionsBtn) {
      const lat = place.geocodes?.main?.latitude;
      const lng = place.geocodes?.main?.longitude;

      let destinationUrl = "";
      if (lat && lng) {
        destinationUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
      } else {
        // Fallback search by name and address if coordinates are missing
        const query = encodeURIComponent(`${place.name} ${place.address || ""}`);
        destinationUrl = `https://www.google.com/maps/dir/?api=1&destination=${query}`;
      }

      window.open(destinationUrl, "_blank");
      return;
    }

    // 3. Handle SHARE Action
    const shareBtn = e.target.closest(".btn-share");
    if (shareBtn) {
      await sharePlace(place);
      return;
    }
  });
}

/**
 * Renders the favorites page inside the main #app container.
 * 
 * @function renderFavoritesPage
 * @returns {void}
 */
export function renderFavoritesPage() {
  const app = document.getElementById("app");
  if (!app) return;

  const favorites = getFavorites();

  // 1. Build Header Banner
  let html = `
    <section class="favorites-hero">
      <div class="favorites-header">
        <h1><i data-lucide="heart" class="icon-heart-title"></i> My Favorite Coffee Shops</h1>
        <p>Your saved spots to visit and enjoy the best coffee.</p>
      </div>
    </section>
    <div class="container favorites-container">
  `;

  // 2. Render Empty State or Cards Grid
  if (favorites.length === 0) {
    html += `
      <div class="empty-state">
        <div class="empty-icon-wrapper">
          <i data-lucide="heart-off" class="empty-icon"></i>
        </div>
        <h2>No favorites saved yet!</h2>
        <p>Explore the map and save your favorite coffee shops by clicking the heart icon.</p>
        <a href="#home" class="btn btn-primary">
          <i data-lucide="compass"></i> Explore Coffee Shops
        </a>
      </div>
    `;
  } else {
    html += `
      <div class="favorites-grid" id="favorites-grid">
        ${favorites.map((fav) => createFavoriteCardTemplate(fav)).join("")}
      </div>
    `;
  }

  html += `</div>`;
  app.innerHTML = html;

  // 3. Re-initialize Lucide Icons via CDN
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 4. Attach event listeners
  setupFavoritesEvents();
}