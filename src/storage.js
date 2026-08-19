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
  if (!place || !place.id) return;
  const favorites = getFavorites();
  
  if (!isFavorite(place.id)) {
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
  if (!placeId) return;
  const favorites = getFavorites();
  const filtered = favorites.filter((f) => String(f.id) !== String(placeId));
  localStorage.setItem("favorites", JSON.stringify(filtered));
  console.log(`💔 Favorite removed: ${placeId}`);
}

/**
 * Toggles a place in favorites (adds if missing, removes if present).
 * 
 * @param {Object} place - Coffee shop object.
 * @returns {boolean} `true` if now saved, `false` if removed.
 */
export function toggleFavorite(place) {
  if (!place || !place.id) return false;
  
  if (isFavorite(place.id)) {
    removeFavorite(place.id);
    return false;
  } else {
    saveFavorite(place);
    return true;
  }
}

/**
 * Retrieves all bookmarked coffee shops from local storage.
 * Returns an empty array if no favorites have been saved yet.
 * 
 * @returns {Array<Object>} List of saved coffee shop objects.
 */
export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  } catch (error) {
    console.error("Error reading favorites from localStorage:", error);
    return [];
  }
}

/**
 * Checks whether a coffee shop is saved in local storage favorites.
 * 
 * @param {string|number} placeId - Unique identifier of the coffee shop to check.
 * @returns {boolean} `true` if the coffee shop is bookmarked, `false` otherwise.
 */
export function isFavorite(placeId) {
  if (!placeId) return false;
  const favorites = getFavorites();
  return favorites.some((f) => String(f.id) === String(placeId));
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