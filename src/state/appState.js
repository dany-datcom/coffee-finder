/**
 * @file appState.js - Centralized Application State Store.
 * @description Manages global app state including user location, loaded place,
 * current sorting criteria, active selections, and loading UI flags.
 * @module store/state
 */

/**
 * @typedef {Object} Location
 * @property {number} lat - Latitude coordinate.
 * @property {number} lng - Longitude coordinate.
 */

/**
 * Encapsulated internal application state object.
 * Private to this module to prevent direct mutations.
 */
const appState = {
  userLocation: null,
  currentSort: "distance",
  place: [],
  mapMode: "explore",
  activePlace: null,
  loading: false
};

/**
 * Updates the global loading status.
 * @param {boolean} value - True if application is fetching data, false otherwise.
 */
export function setLoadingState(value) {
  appState.loading = value;
}

/**
 * Checks whether the application is currently loading data.
 * @returns {boolean} Current loading status.
 */
export function isLoading() {
  return appState.loading;
}

/**
 * Sets the user's current geographic coordinates.
 * @param {Location|null} location - Coordinates object or null if unavailable.
 */
export function setUserLocation(location) {
  appState.userLocation = location;
}

/**
 * Retrieves the user's stored location coordinates.
 * @returns {Location|null} User location or null.
 */
export function getUserLocation() {
  return appState.userLocation;
}

/**
 * Gets the current place sorting criteria.
 * @returns {string} Current sort option (e.g., "distance", "rating").
 */
export function getCurrentSort() {
  return appState.currentSort;
}

/**
 * Sets the criteria for sorting place.
 * @param {string} sort - New sort parameter key.
 */
export function setCurrentSort(sort) {
  appState.currentSort = sort;
}

/**
 * Replace the list of stored place in state.
 * @param {Array<Object>} data - Array of place items.
 */
export function setPlace(data) {
  appState.place = data;
}

/**
 * Retrieves all stored place.
 * @returns {Array<Object>} List of place.
 */
export function getPlace() {
  return appState.place;
}

/**
 * Sets the current map display mode.
 * @param {string} mode - Mode name (e.g., "explore", "detail").
 */
export function setMapMode(mode) {
  appState.mapMode = mode;
}

/**
 * Gets the current map mode.
 * @returns {string} Map interaction mode.
 */
export function getMapMode() {
  return appState.mapMode;
}

/**
 * Sets the currently active/focused place.
 * @param {Object|null} place - Place object to activate, or null to clear.
 */
export function setActivePlace(place) {
  appState.activePlace = place;
}

/**
 * Retrieves the currently active place.
 * @returns {Object|null} Active place object or null.
 */
export function getActivePlace() {
  return appState.activePlace;
}

/**
 * Returns all currently visible place for UI rendering.
 * @returns {Array<Object>} List of place.
 */
export function getVisiblePlace() {
  return appState.place;
}