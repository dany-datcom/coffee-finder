/**
 * Main application router and entry point
 * Handles navigation between pages (Home, Favorites, About)
 * Uses hash-based routing for single-page application
 */

import { renderNavbar } from "./components/navbar.js";
import { renderFooter } from "./components/footer.js";
import { renderHomePage } from "./pages/home.js";
import { renderFavoritesPage } from "./pages/favorites.js";
import { renderAboutPage } from "./pages/about.js";

/**
 * Router function that handles page navigation
 * Renders appropriate navbar and page content based on current hash
 */
function router() {
  const hash = window.location.hash.substring(1) || "home";

  console.log(`📄 Navigating to: ${hash}`);

  // Render navbar with active state indicator
  renderNavbar(hash);

  // Render footer (same on all pages)
  renderFooter();

  // Render page content based on current route
  const routes = {
    home: renderHomePage,
    favorites: renderFavoritesPage,
    about: renderAboutPage,
  };

  const renderPage = routes[hash] || renderHomePage;

  renderPage();
}

// Listen for hash changes to trigger navigation
window.addEventListener("hashchange", router);

// Initialize application on page load
window.addEventListener("load", () => {
  console.log("🚀 Application started");
  router();
});