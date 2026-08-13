/**
 * @file storage.js
 * @module Storage
 * @description Local storage management module for bookmarked coffee shops.
 * Handles saving, retrieving, and removing favorite places using the Web Storage API.
 */

/**
 * Saves a coffee shop to local storage favorites list.
 * Prevents duplicate entries based on the place ID.
 * 
 * @param {Object} place - The coffee shop object to be saved.
 * @param {string|number} place.id - Unique identifier of the coffee shop.
 * @param {string} place.name - Name of the coffee shop.
 * @returns {void}
 */
export function saveFavorite(place) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  
  if (!favorites.find(f => f.id === place.id)) {
    favorites.push(place);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    console.log("❤️ Favorite saved:", place.name);
  }
}

/**
 * Removes a coffee shop from local storage favorites by its unique identifier.
 * 
 * @param {string|number} placeId - The unique identifier of the coffee shop to remove.
 * @returns {void}
 */
export function removeFavorite(placeId) {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const filtered = favorites.filter(f => f.id !== placeId);
  localStorage.setItem("favorites", JSON.stringify(filtered));
  console.log("💔 Favorite removed");
}

/**
 * Retrieves all bookmarked coffee shops from local storage.
 * Returns an empty array if no favorites have been saved yet.
 * 
 * @returns {Array<Object>} List of saved coffee shop objects.
 */
export function getFavorites() {
  return JSON.parse(localStorage.getItem("favorites")) || [];
}

/**
 * Checks whether a coffee shop is saved in local storage favorites.
 * 
 * @param {string|number} placeId - Unique identifier of the coffee shop to check.
 * @returns {boolean} `true` if the coffee shop is bookmarked, `false` otherwise.
 */
export function isFavorite(placeId) {
  const favorites = getFavorites();
  return favorites.some(f => f.id === placeId);
}

/**
 * Clears all saved coffee shops from local storage.
 * Removes the 'favorites' key entirely from Web Storage.
 * 
 * @returns {void}
 */
export function clearFavorites() {
  localStorage.removeItem("favorites");
  console.log("🗑️ All favorites cleared");
}