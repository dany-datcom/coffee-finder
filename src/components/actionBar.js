/**
 * @file actionBar.js - Place Actions Bar Component
 * @description Generates HTML template string for quick-action buttons 
 * (Directions & Share) rendered inside coffee shop cards.
 * @module components/actionBar
 */

/**
 * Creates the HTML template markup for a coffee card's action bar.
 * Includes accessibility attributes and Lucide icon data tags.
 *
 * @function createActionBar
 * @returns {string} HTML markup string containing action buttons.
 */
export function createActionBar() {
  return `
    <div class="place-actions">
      
      <!-- Directions Button -->
      <button
        class="direction-btn"
        aria-label="Open directions">
        <i data-lucide="navigation"></i>
      </button>

      <!-- Share Button -->
      <button
        class="share-btn"
        aria-label="Share coffee shop">
        <i data-lucide="share-2"></i>
      </button>

    </div>
    `;

}