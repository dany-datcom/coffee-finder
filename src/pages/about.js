/**
 * About page component
 * Provides information about the application:
 * - Purpose and functionality
 * - Key features
 * - Technologies used
 * - Developer information
 */

export function renderAboutPage() {
  const app = document.getElementById("app");

  app.innerHTML = `
    <div class="about-container">
      <h1>About Code & Coffee Finder</h1>
      
      <!-- Purpose section -->
      <section class="about-section">
        <h2>What is this?</h2>
        <p>
          Code & Coffee Finder helps developers find the perfect coffee shop 
          to code, study, or work from. Filter by amenities like WiFi quality, 
          power outlets, and quiet atmosphere.
        </p>
      </section>

      <!-- Features section -->
      <section class="about-section">
        <h2>Features</h2>
        <ul>
          <li>🗺️ Interactive map powered by Google Maps</li>
          <li>🔍 Search coffee shops by location</li>
          <li>🔗 Filter by amenities</li>
          <li>❤️ Save your favorites with persistent storage</li>
          <li>📍 Real-time distance calculation</li>
          <li>🌍 Support for multiple cities</li>
        </ul>
      </section>

      <!-- Technologies section -->
      <section class="about-section">
        <h2>Technologies</h2>
        <ul>
          <li>⚡ Vite - Next generation frontend tooling</li>
          <li>🗺️ Google Maps JavaScript API - Interactive mapping</li>
          <li>🌍 Geoapify API - Geocoding and location services</li>
          <li>💾 LocalStorage - Client-side data persistence</li>
          <li>📱 Responsive Design - Mobile-first approach</li>
        </ul>
      </section>

      <!-- Developer information -->
      <section class="about-section">
        <h2>Developer</h2>
        <p>Made with ☕ and 💻 by <strong>Dany Datcom</strong></p>
      </section>
    </div>
  `;
}