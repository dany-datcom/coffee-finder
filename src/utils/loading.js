/**
 * @file loading.js - UI Loading State Helper.
 * @description Controls the global loader visibility, updates feedback messages,
 * and toggles user input controls to prevent race conditions during async operations.
 * @module utils/loading
 */

/**
 * Toggles the application loading state.
 * Shows/hides the loading overlay, updates message text, and disables UI inputs while fetching data.
 * 
 * @exports setLoading
 * @param {boolean} loading - True to activate loading mode, false to restore interactive UI.
 * @param {string} [message="Searching coffee shops..."] - Custom message displayed inside the loader.
 * @returns {void}
 */
export function setLoadingUI(
  loading,
  message = "Searching coffee shops..."
) {
  const loader =document.getElementById("loader");
  const loaderText = document.querySelector(".loader-text");
  const input = document.getElementById("search-input");
  const button = document.getElementById("search-button");
  const sort = document.getElementById("sort-select");

  if (!loader) return;

  loader.classList.toggle("hidden", !loading);

  if (loaderText) {
    loaderText.textContent = message;
  }

  input?.toggleAttribute("disabled", loading);
  button?.toggleAttribute("disabled", loading);
  sort?.toggleAttribute("disabled", loading);
}