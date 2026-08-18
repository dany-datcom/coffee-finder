/**
 * @file about.js - About Page Component
 * @description Renders application overview, key features, technology stack, and developer credits.
 * @module pages/about
 */
import { createIcons, icons } from 'lucide';


export function renderAboutPage() {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <section class="about-hero">
      <div class="about-hero-content">
        <h1><i data-lucide="coffee" class="hero-icon"></i> About Code & Coffee Finder</h1>
        <p>Connecting developers with the perfect coffee shops to work, study, and build.</p>
      </div>
    </section>

    <div class="container about-container">
      <!-- Purpose Section -->
      <section class="about-card mission-card">
        <div class="card-icon-wrapper">
          <i data-lucide="compass" class="section-icon"></i>
        </div>
        <div>
          <h2>What is Code & Coffee Finder?</h2>
          <p>
            Finding a reliable spot to code shouldn't be a gamble. Code & Coffee Finder helps remote developers, 
            students, and tech workers discover coffee shops tailored to their workflow—filtering by high-speed WiFi, 
            power outlet availability, quiet atmospheres, and high-quality coffee.
          </p>
        </div>
      </section>

      <!-- Key Features Grid -->
      <section class="about-section">
        <h2 class="section-title"><i data-lucide="sparkles"></i> Key Features</h2>
        <div class="features-grid">
          <div class="feature-card">
            <i data-lucide="map" class="feature-icon"></i>
            <h3>Interactive Map</h3>
            <p>Explore nearby spots powered by Google Maps with custom interactive markers.</p>
          </div>
          <div class="feature-card">
            <i data-lucide="search" class="feature-icon"></i>
            <h3>Smart Search</h3>
            <p>Locate coffee shops near your current location or in specific cities worldwide.</p>
          </div>
          <div class="feature-card">
            <i data-lucide="sliders" class="feature-icon"></i>
            <h3>Amenity Filters</h3>
            <p>Filter venues by WiFi speed, power outlets, noise level, and seat availability.</p>
          </div>
          <div class="feature-card">
            <i data-lucide="heart" class="feature-icon"></i>
            <h3>Saved Favorites</h3>
            <p>Bookmark your top work sanctuaries and access them anytime with local storage.</p>
          </div>
          <div class="feature-card">
            <i data-lucide="navigation" class="feature-icon"></i>
            <h3>Real-Time Distance</h3>
            <p>Calculate exact distance and estimated travel time from your current location.</p>
          </div>
          <div class="feature-card">
            <i data-lucide="globe" class="feature-icon"></i>
            <h3>Multi-City Support</h3>
            <p>Seamlessly discover laptop-friendly cafes across major global tech hubs.</p>
          </div>
        </div>
      </section>

      <!-- Technology Stack -->
      <section class="about-section">
        <h2 class="section-title"><i data-lucide="code-2"></i> Built With</h2>
        <div class="tech-grid">
          <div class="tech-badge">
            <i data-lucide="zap" class="tech-icon"></i>
            <div>
              <strong>Vite</strong>
              <span>Next-Gen Frontend Tooling</span>
            </div>
          </div>
          <div class="tech-badge">
            <i data-lucide="map-pin" class="tech-icon"></i>
            <div>
              <strong>Google Maps API</strong>
              <span>Interactive Mapping & Places</span>
            </div>
          </div>
          <div class="tech-badge">
            <i data-lucide="locate" class="tech-icon"></i>
            <div>
              <strong>Geoapify API</strong>
              <span>Geocoding & Location Search</span>
            </div>
          </div>
          <div class="tech-badge">
            <i data-lucide="hard-drive" class="tech-icon"></i>
            <div>
              <strong>LocalStorage</strong>
              <span>Client-Side Data Persistence</span>
            </div>
          </div>
          <div class="tech-badge">
            <i data-lucide="smartphone" class="tech-icon"></i>
            <div>
              <strong>Responsive CSS3</strong>
              <span>Mobile-First Fluid Layouts</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Developer Info -->
      <section class="about-card dev-card">
        <div class="dev-avatar">
          <i data-lucide="laptop"></i>
        </div>
        <div class="dev-info">
          <h2>Developer</h2>
          <p>
            Crafted with passion, <i data-lucide="coffee" class="inline-icon"></i> and code by 
            <strong>Dany Datcom</strong>.
          </p>
        </div>
      </section>
    </div>
  `;

  // Re-initialize Lucide Icons for dynamic content
  if (window.lucide) {
    window.lucide.createIcons();
  }

  
createIcons({ icons });
}