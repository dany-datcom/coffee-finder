/**
 * Favorites page component (My Favorites)
 * Displays saved coffee shops
 * Allows users to remove favorites and navigate back to explore
 */

import { getFavorites, removeFavorite } from "../storage.js";

/**
 * Render favorites page with list of saved coffee shops
 */
export function renderFavoritesPage() {
  const app = document.getElementById("app");
  const favorites = getFavorites();

  let html = `
    <div class="favorites-container">
      <h1>❤️ MY FAVORITES</h1>
  `;

  // Display empty state if no favorites saved
  if (favorites.length === 0) {
    html += `
      <div class="empty-state">
        <p>You haven't saved any coffee shops yet!</p>
        <a href="#home" class="btn-primary">Explore Coffee Shops</a>
      </div>
    `;
  } else {
    // Display grid of saved coffee shops
    html += `
      <div class="favorites-grid">
        ${favorites.map((fav, index) => `
          <div class="favorite-item">
            <h3>${fav.name}</h3>
            <p>${fav.address}</p>
            <button class="btn-remove" data-index="${index}">Remove from Favorites</button>
          </div>
        `).join("")}
      </div>
    `;
  }

  html += `</div>`;
  app.innerHTML = html;

  // Setup remove button listeners - AQUI ESTABA EL PROBLEMA
  setupRemoveButtons();
}

/**
 * Setup event listeners for remove buttons
 * Handles removing favorites and refreshing the page
 */
function setupRemoveButtons() {
  document.querySelectorAll(".btn-remove").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = parseInt(e.target.dataset.index);
      const favorites = getFavorites();
      
      // Get the ID of the favorite to remove
const placeId = favorites[index].id;
      
      console.log(`🗑️ Removing favorite with ID: ${placeId}`);
      
      // Remove from storage
      removeFavorite(placeId);
      
      console.log("❤️ Favorite removed! Refreshing page...");
      
      // Refresh the favorites page
      renderFavoritesPage();
    });
  });
}