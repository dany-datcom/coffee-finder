/**
 * @file main.js - Client-side SPA Router and Application Entry Point.
 * @description Coordinates page navigation, renders global layout components (Navbar, Footer),
 * and maps hash-based routes (#home, #favorites, #about) to page render functions.
 * @module main
 */

import { renderNavbar } from "./components/navbar.js";
import { renderFooter } from "./components/footer.js";
import { renderHomePage } from "./pages/home.js";
import { renderFavoritesPage } from "./pages/favorites.js";
import { renderAboutPage } from "./pages/about.js";

/**
 * Client-side hash router function.
 * Parses the current window location hash, updates global layout elements,
 * and dynamically invokes the matching page render function.
 * Implements fallback handling to default to the 'home' page for unknown routes.
 * 
 * @private
 * @returns {void}
 */

function router() {
  const rawHash = window.location.hash.substring(1);
  const cleanHash = rawHash.split("?")[0] || "home";

  console.log(`📄 Navigating to: ${cleanHash}`);
  
  window.scrollTo(0, 0);
  
  renderNavbar(cleanHash);
  renderFooter();

  const routes = {
    home: renderHomePage,
    favorites: renderFavoritesPage,
    about: renderAboutPage,
  };

  const renderPage = routes[cleanHash] || renderHomePage;
  renderPage();
}

window.addEventListener("hashchange", router);

window.addEventListener("load", () => {
  console.log("🚀 Application started");
  router();
});