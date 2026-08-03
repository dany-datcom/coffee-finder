export function createSkeletonCards(
  count = 3
) {
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