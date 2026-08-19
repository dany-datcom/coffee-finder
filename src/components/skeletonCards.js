/**
 * Generates HTML markup for skeleton loading cards.
 * Displays placeholder cards with shimmer animations while fetching coffee shop data.
 *
 * @param {number} [count=3] - Number of skeleton cards to render. Defaults to 3.
 * @returns {string} Concatenated HTML string containing skeleton card structure.
 */
export function createSkeletonCards(count = 3) {
  return Array.from(
    { length: count },
    () => `
      <article class="place-card skeleton-card">
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line short"></div>
        <div class="skeleton skeleton-tags"></div>
        <div class="skeleton skeleton-footer"></div>
      </article>
    `
  ).join("");
}