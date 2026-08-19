/**
 * @file navbar.js - Navigation Bar Component
 * @description Renders the application header, handles active route highlights,
 * and manages hash-based client navigation.
 * @module components/navbar
 */

/**
 * Generates the HTML template string for the navigation bar.
 * Evaluates the current active route to apply the `.active` class to the appropriate link.
 *
 * @param {string} currentPage - The identifier of the active page (e.g., 'home', 'favorites', 'about').
 * @returns {string} Concatenated HTML markup for the navbar.
 */
function createNavbarTemplate(currentPage) {
  return `
    <div class="navbar-container">
      <!-- Brand -->
      <div class="navbar-brand">
        <a href="#home" class="logo-link">
          <span class="logo-icon">☕</span>
          <div class="logo-content">
            <h1 class="logo-title">Code & Coffee</h1>
            <span class="logo-subtitle">Find your next place to work.</span>
          </div>
        </a>
      </div>

      <!-- Navigation -->
      <nav class="navbar-menu">
        <a
          href="#home"
          class="nav-link ${currentPage === "home" ? "active" : ""}">
          Discover
        </a>
        <a
          href="#favorites"
          class="nav-link ${currentPage === "favorites" ? "active" : ""}">
          Favorites
        </a>
        <a
          href="#about"
          class="nav-link ${currentPage === "about" ? "active" : ""}">
          About
        </a>

      </nav>

      <!-- Tagline -->
      <div class="navbar-tagline">
        Work • Study • Coffee
      </div>
    </div>
  `;
}

/**
 * Attaches event listeners to navbar interactive elements (links and logo).
 * Intercepts default anchor clicks to trigger hash-based Single Page Application (SPA) routing.
 */
function setupNavbarEvents() {
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = e.target.getAttribute("href").substring(1);
      window.location.hash = page;
    });
  });
}

/**
 * Renders the navigation bar into the DOM and initializes its event listeners.
 *
 * @param {string} [currentPage="home"] - The page route to highlight as active. Defaults to "home".
 */
export function renderNavbar(currentPage = "home") {
  const navbar = document.getElementById("navbar");

  if (!navbar) return;

  navbar.innerHTML = createNavbarTemplate(currentPage);

  setupNavbarEvents();
}
