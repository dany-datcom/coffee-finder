/**
 * @file hero.js - Hero Banner Component
 * @description Generates the HTML template for the main hero section,
 * including welcome headlines and the primary city search bar.
 * @module components/hero
 */

/**
 * Creates the HTML template string for the Hero banner.
 *
 * @function createHero
 * @returns {string} HTML markup string for the hero section.
 */

export function createHero() {
  return `
    <section class="hero">
      <div class="hero-content">

        <!-- Badge indicator -->
        <span class="hero-badge">
          <i data-lucide="coffee" class="badge-icon"></i> Find your perfect workspace
        </span>

        <!-- Main Title -->
        <h1 class="hero-title">
          Find your next place to work, study, and enjoy great coffee.
        </h1>

        <!--Subtitle Description -->
        <p class="hero-description">
          Discover cafés loved by developers, students, freelancers and digital nomads.
        </p>

        <!-- Search Form -->
        <div class="hero-search">
          <form id="search-form" class="search-form">

            <div class="search-wrapper">
              <i data-lucide="search" class="search-icon"></i>

              <input
                id="search-input"
                class="search-input"
                type="text"
                aria-label="Search for a city"
                placeholder="Search for a city..."
                required
                autocomplete="off"
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