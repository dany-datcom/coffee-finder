/**
 * Hero component
 * Welcomes users to Code & Coffee
 * Displays application title and description
 */

export function createHero() {
  return `
    <section class="hero">
      <div class="hero-content">

        <span class="hero-badge">
          ☕ Find your perfect workspace
        </span>

        <h1 class="hero-title">
          Find your next place to work,
          study and enjoy great coffee.
        </h1>

        <p class="hero-description">
          Discover cafés loved by developers,
          students, freelancers and digital nomads.
        </p>

        <div class="hero-search">
          <form id="search-form" class="search-form">

            

            <div class="search-wrapper">
              <span class="search-icon">🔍</span>

              <input
                id="search-input"
                class="search-input"
                type="text"
                aria-label="Search for a city"
                placeholder="Search for a city..."
                required
              />
            </div>

            <button
              id="search-button"
              class="search-button"
              type="submit"
            >
              Explore
            </button>

          </form>
        </div>

      </div>
    </section>
  `;
}