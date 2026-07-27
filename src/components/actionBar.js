export function createActionBar() {

    return `
        <div class="place-actions">

      <button
        class="favorite-btn"
        aria-label="Save favorite">
        <i data-lucide="heart"></i>
      </button>

      <button
        class="direction-btn"
        aria-label="Open directions">
        <i data-lucide="navigation"></i>
      </button>

      <button
        class="share-btn"
        aria-label="Share coffee shop">
        <i data-lucide="share-2"></i>
      </button>

    </div>
    `;

}