/**
 * Footer component
 * Displays application footer with links, social media, and copyright information
 * Appears on all pages of the application
 */
import { techIcons } from "../icons/tech-icons.js";


export function initializeTechIcons(){

  document
    .querySelectorAll(".tech-icon")
    .forEach(icon => {

      const name = icon.dataset.tech;

      if(techIcons[name]){
        icon.innerHTML = techIcons[name];
      }

    });

}

initializeTechIcons();

export function renderFooter() {
  const footer = document.getElementById("footer");

  if (!footer) return; // Si no existe el elemento footer, salir

  const currentYear = new Date().getFullYear();

  footer.innerHTML = `
    <div class="footer-container">
      <!-- Footer top section with content -->
      <div class="footer-grid">
        
        <!-- About section -->
        <div class="footer-brand">
          <h3>☕ Code & Coffee</h3>
          <p>Find your next place to work,
            study and enjoy great coffee.</p>
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

        <!-- Features section -->
        <div class="footer-tech">
  <h4>Built With</h4>

  <ul>

    <li class="tech-item">

  <img 
    class="tech-logo"
    src="assets/javascript.svg"
    alt="JavaScript logo">

  <span>JavaScript</span>

</li>


    <li class="tech-item">
<img 
class="tech-logo"
src="assets/vite.svg"
alt="Vite">
<span>Vite</span>
</li>


    <li class="tech-item">
<img 
class="tech-logo"
src="assets/google.svg"
alt="Google Maps">
<span>Google Maps</span>
</li>


<li class="tech-item">
<img 
class="tech-logo"
src="assets/geoapify.svg"
alt="Geoapify">
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
class="social-link">

<img 
src="assets/github-icon.svg"
alt="GitHub">

</a>


<a 
href="https://www.linkedin.com/in/dany-jimenez-051672b4/"
target="_blank"
rel="noopener noreferrer"
class="social-link">

<img 
src="assets/linkedin-icon.svg"
alt="LinkedIn">

</a>

</div>

      </div>

      <!-- Footer bottom with copyright -->
      <div class="footer-bottom">
        <div class="footer-copyright">
          <p>&copy; ${currentYear} Code & Coffee.</p>
        </div>
        <div class="footer-credits">
          <p> Designed & Developed by Dany Jimenez</p>
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
  document.querySelectorAll(".footer-navigation a").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const page = link.getAttribute("href").substring(1);
      window.location.hash = page;
    });
  });
}