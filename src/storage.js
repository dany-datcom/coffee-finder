/**
 * Local storage management for favorites
 * Handles saving, retrieving, and removing favorite coffee shops
 * Uses browser LocalStorage API for data persistence
 */

/**
 * Save a coffee shop to favorites
 * Prevents duplicate entries
 * @param {Object} place - Coffee shop object to save
 */
export function saveFavorite(place) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  
  // Prevent duplicate favorites
  if (!favorites.find(f => f.id === place.id)) {
    favorites.push(place);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    console.log("❤️ Favorite saved:", place.name);
  }
}

/**
 * Remove a coffee shop from favorites by ID
 * @param {String|Number} placeId - ID of coffee shop to remove
 */
export function removeFavorite(placeId) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const filtered = favorites.filter(f => f.id !== placeId);
  localStorage.setItem("favorites", JSON.stringify(filtered));
  console.log("💔 Favorite removed");
}

/**
 * Get all saved favorites
 * @returns {Array} Array of favorite coffee shop objects
 */
export function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

/**
 * Check if a coffee shop is in favorites
 * @param {String|Number} placeId - ID to check
 * @returns {Boolean} True if shop is favorite, false otherwise
 */
export function isFavorite(placeId) {
  const favorites = getFavorites();
  return favorites.some(f => f.id === placeId);
}

/**
 * Clear all saved favorites
 */
export function clearFavorites() {
  localStorage.removeItem("favorites");
  console.log("🗑️ All favorites cleared");
}