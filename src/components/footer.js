/**
 * @file footer.js - Footer Component
 * @description Generates and renders the application footer, handles SPA quick links navigation,
 * and maintains dynamic copyright information.
 * @module components/footer
 */
import { techIcons } from "../icons/tech-icons.js";

/**
 * Scans the footer for elements with `data-tech` attributes and injects
 * corresponding SVG icons from the `techIcons` dictionary if present.
 */
export function initializeTechIcons(){
  document.querySelectorAll(".tech-icon").forEach(icon => {
    const name = icon.dataset.tech;
    if(techIcons[name]){
        icon.innerHTML = techIcons[name];
      }
  });
}

/**
 * Attaches event listeners to footer navigation links to trigger hash-based SPA routing.
 */
function setupFooterLinks() {
  document.querySelectorAll(".footer-navigation a").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const href = e.currentTarget.getAttribute("href");
      if (href) {
        window.location.hash = href.substring(1);
      }
    });
  });
}

/**
 * Main render function for the Footer component.
 * Injects HTML into `<footer id="footer">`, attaches events, and calculates the current year dynamically.
 */
export function renderFooter() {
  const footer = document.getElementById("footer");

  if (!footer) return;

  const currentYear = new Date().getFullYear();

  footer.innerHTML = `
    <div class="footer-container">

      <!-- Footer top section with content -->
      <div class="footer-grid">
        
        <!-- About section -->
        <div class="footer-brand">
          <h3>☕ Code & Coffee</h3>
          <p>Find your next place to work, study and enjoy great coffee.</p>
        </div>

        <!-- Quick links section -->
        <div class="footer-navigation">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#home">Discover</a></li>
            <li><a href="#favorites">Favorites</a></li>
            <li><a href="#about">About</a></li>
          </ul>
        </div>

        <!-- Technologies Used -->
        <div class="footer-tech">
          <h4>Built With</h4>
          <ul>
            <li class="tech-item">
              <img class="tech-logo" src="assets/javascript.svg" alt="JavaScript logo"/>
              <span>JavaScript</span>
            </li>
            <li class="tech-item">
              <img class="tech-logo" src="assets/vite.svg" alt="Vite"/>
              <span>Vite</span>
            </li>
            <li class="tech-item">
              <img class="tech-logo" src="assets/google.svg" alt="Google Maps"/>
              <span>Google Maps</span>
            </li>
            <li class="tech-item">
              <img class="tech-logo" src="assets/geoapify.svg" alt="Geoapify"/>
              <span>Geoapify</span>
            </li>
          </ul>
        </div>

        <!-- Contact & Social section -->
        <div class="footer-contact">
          <h4>Connect</h4>
          <p>Made with ❤️ in Costa Rica</p>
          <div class="social-links">
            <a 
              href="https://github.com/dany-datcom"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              aria-label="GitHub profile link"
            >
              <img src="assets/github-icon.svg" alt="GitHub" />
            </a>
            <a 
              href="https://www.linkedin.com/in/dany-jimenez-051672b4/"
              target="_blank"
              rel="noopener noreferrer"
              class="social-link"
              aria-label="LinkedIn profile link"
            >
              <img src="assets/linkedin-icon.svg" alt="LinkedIn"/>
            </a>
          </div>
        </div>
      </div>

      <!-- Footer bottom with copyright -->
      <div class="footer-bottom">
        <div class="footer-copyright">
          <p>&copy; ${currentYear} Code & Coffee. All rights reserved.</p>
        </div>
        <div class="footer-credits">
          <p> Designed & Developed by Dany Jimenez</p>
        </div>
      </div>
    </div>
  `;

  // Setup link event listeners for navigation
 initializeTechIcons();
  setupFooterLinks();
}
