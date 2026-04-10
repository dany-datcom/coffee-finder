/**
 * Navigation bar component
 * Renders header with logo and navigation links
 * Highlights current page in navigation menu
 */

export function renderNavbar(currentPage = "home") {
  const navbar = document.getElementById("navbar");

  navbar.innerHTML = `
    <div class="navbar-container">
      <!-- Application logo and branding -->
      <div class="navbar-logo">
        <a href="#home" class="logo-link">
          <span class="logo-icon">☕</span>
          <span class="logo-text">CODE & COFFEE FINDER</span>
        </a>
      </div>

      <!-- Main navigation menu -->
      <nav class="navbar-menu">
        <a href="#home" class="nav-link ${currentPage === "home" ? "active" : ""}">
          FIND COFFEE
        </a>
        <a href="#favorites" class="nav-link ${currentPage === "favorites" ? "active" : ""}">
          MY FAVORITES
        </a>
        <a href="#about" class="nav-link ${currentPage === "about" ? "active" : ""}">
          ABOUT
        </a>
      </nav>
    </div>
  `;

  // Navigation link event listeners
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = e.target.getAttribute("href").substring(1);
      window.location.hash = page;
    });
  });

  // Logo click returns to home
  document.querySelector(".logo-link").addEventListener("click", (e) => {
    e.preventDefault();
    window.location.hash = "home";
  });
}