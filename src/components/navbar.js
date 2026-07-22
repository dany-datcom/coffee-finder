/**
 * Navigation bar component
 * Renders header with logo and navigation links
 * Highlights current page in navigation menu
 */

function createNavbarTemplate(currentPage) {
  return `
    <div class="navbar-container">

      <!-- Brand -->
      <div class="navbar-brand">

        <a href="#home" class="logo-link">

          <span class="logo-icon">☕</span>

          <div class="logo-content">

            <h1 class="logo-title">
              Code & Coffee
            </h1>

            <span class="logo-subtitle">
              Find your next place to work.
            </span>

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

function setupNavbarEvents() {
  // registra todos los listeners
}

export function renderNavbar(currentPage = "home") {
  const navbar = document.getElementById("navbar");  

  navbar.innerHTML = createNavbarTemplate(currentPage);
  setupNavbarEvents();
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