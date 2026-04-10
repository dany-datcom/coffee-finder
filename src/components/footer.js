/**
 * Footer component
 * Displays application footer with links, social media, and copyright information
 * Appears on all pages of the application
 */

export function renderFooter() {
  const footer = document.getElementById("footer");

  if (!footer) return; // Si no existe el elemento footer, salir

  const currentYear = new Date().getFullYear();

  footer.innerHTML = `
    <div class="footer-container">
      <!-- Footer top section with content -->
      <div class="footer-content">
        
        <!-- About section -->
        <div class="footer-section">
          <h3>☕ CODE & COFFEE FINDER</h3>
          <p>Find the perfect coffee shop to code, study, or work from. Discover amazing places with great WiFi and atmosphere.</p>
        </div>

        <!-- Quick links section -->
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Find Coffee</a></li>
            <li><a href="#favorites">My Favorites</a></li>
            <li><a href="#about">About Us</a></li>
          </ul>
        </div>

        <!-- Features section -->
        <div class="footer-section">
          <h4>Features</h4>
          <ul>
            <li>🗺️ Interactive Map</li>
            <li>🔍 Search by Location</li>
            <li>❤️ Save Favorites</li>
            <li>📍 Distance Display</li>
          </ul>
        </div>

        <!-- Contact & Social section -->
        <div class="footer-section">
          <h4>Connect</h4>
          <p>Built with ☕ and 💻</p>
          <div class="social-links">
            <a href="https://github.com/dany-datcom" target="_blank" class="social-link" title="GitHub">
              <span>GitHub</span>
            </a>
          </div>
        </div>

      </div>

      <!-- Footer bottom with copyright -->
      <div class="footer-bottom">
        <div class="footer-copyright">
          <p>&copy; ${currentYear} Code & Coffee Finder. All rights reserved.</p>
        </div>
        <div class="footer-credits">
          <p>Made by <strong>Dany Jimenez</strong> | Powered by Google Maps & Geoapify</p>
        </div>
      </div>
    </div>
  `;

  // Setup link event listeners for navigation
  setupFooterLinks();
}

/**
 * Setup footer link event listeners for SPA navigation
 */
function setupFooterLinks() {
  document.querySelectorAll(".footer-section a[href^='#']").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.getAttribute("href").substring(1);
      window.location.hash = page;
    });
  });
}